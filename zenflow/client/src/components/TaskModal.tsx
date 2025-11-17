import { Modal, Form, Input, Button, message, Select, Spin, Tooltip, Typography, Space } from 'antd';
import { useUiStore } from '../store/uiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '../api/taskApi';
import { getTags } from '../api/tagApi';
import { useAiAssistant } from '../hooks/useAiAssistant'; 
import { useEffect } from 'react';
import { ThunderboltOutlined  } from '@ant-design/icons';
import type { CreateTaskPayload, ITag, UpdateTaskPayload } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

export const TaskModal = () => {
  const { isTaskModalOpen, modalMode, editingTaskId, closeModal } = useUiStore();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditMode = modalMode === 'edit';

  const [messageApi, contextHolder] = message.useMessage();
  

  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    enabled: isTaskModalOpen,
  });

  // --- Task CRUD
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardData'] });
    },
    onError: (err) => messageApi.error(`Failed to create task: ${err.message}`),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string, payload: UpdateTaskPayload }) =>
      updateTask(taskId, payload),
    onSuccess: () => {
      messageApi.success('Task updated!');
      queryClient.invalidateQueries({ queryKey: ['boardData'] });
      closeModal();
    },
    onError: (err) => messageApi.error(`Failed to update task: ${err.message}`),
  });

  // --- AI Call --
  const aiCallbacks = {
    onSubtaskSuccess: (subtasks: string[]) => {
      subtasks.forEach(subtaskTitle => {
        createTaskMutation.mutate({ title: subtaskTitle, tags: [] });
      });
      closeModal();
    },
    onDescriptionSuccess: (description: string) => {
      form.setFieldsValue({ description });
    },
    onTagSuccess: (suggestedTags: ITag[]) => {
      const tagIds = suggestedTags.map(tag => tag._id);
      form.setFieldsValue({ tags: tagIds });
    },
  };

  const {
    generateSubtasks,
    isSubtaskLoading,
    generateDescription,
    isDescriptionLoading,
    suggestTags,
    isTagLoading,
  } = useAiAssistant(aiCallbacks);

  useEffect(() => {
    if (isTaskModalOpen) {
      if (isEditMode && editingTaskId) { /* ... */ } else { form.resetFields(); }
    }
  }, [isTaskModalOpen, isEditMode, editingTaskId, queryClient, form]);
  
  const onFinish = (values: CreateTaskPayload | UpdateTaskPayload) => {
    if (isEditMode) {
      if (!editingTaskId) return;
      updateTaskMutation.mutate({ taskId: editingTaskId, payload: values });
    } else {
      createTaskMutation.mutate(values as CreateTaskPayload, {
        onSuccess: () => {
          messageApi.success('Task created!');
          closeModal();
        }
      });
    }
  };

  const handleGenerateSubtasks = () => {
    const title = form.getFieldValue('title');
    if (!title) {
      messageApi.warning('Please enter a main task title first.'); return;
    }
    generateSubtasks(title); 
  };

  const handleGenerateDescription = () => {
    const title = form.getFieldValue('title');
    if (!title) {
      messageApi.warning('Please enter a title first.'); return;
    }
    generateDescription(title); 
  };

  const handleSuggestTags = () => {
    const title = form.getFieldValue('title');
    const description = form.getFieldValue('description') || '';
    if (!title) {
      messageApi.warning('Please enter a title or description first.'); return;
    }
    suggestTags({ title, description }); 
  };
  
  const AiIcon = ({ onClick, isLoading, title }: { onClick: () => void; isLoading: boolean; title: string }) => (
    <Tooltip title={title}>
      {isLoading ? <Spin size="small" /> : <ThunderboltOutlined style={{cursor: 'pointer', color: '#1890ff', fontSize: '22px'}} onClick={onClick} />}
    </Tooltip>
  );

  
  return (
    <>
    {contextHolder}
    <Modal 
      title={isEditMode ? "Edit Task" : "Create New Task"}
      open={isTaskModalOpen}
      onCancel={closeModal}
      footer={null}
      centered
      confirmLoading={isTagsLoading}
    >
      {isTagsLoading ? ( <Spin /> ) : (
        <Form 
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            name="title"
            label={
              <div>
                <Text style={{marginRight:5}}>Title</Text>
                {!isEditMode && (
                  <AiIcon
                    onClick={handleGenerateSubtasks}
                    isLoading={isSubtaskLoading}
                    title="Generate subtasks with AI"
                  />
                )}
              </div>
            }
            rules={[{ required: true }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="description"
            label={
              <div>
                <Text style={{marginRight:5}}>Description</Text>
                <AiIcon
                  onClick={handleGenerateDescription}
                  isLoading={isDescriptionLoading}
                  title="Generate description with AI"
                />
              </div>
            }
          >
            <TextArea  rows={4}/>
          </Form.Item>
          <Form.Item
            name="tags"
            label={
              <div >
                <Text style={{marginRight:5}}>Tags</Text>
                <AiIcon
                  onClick={handleSuggestTags}
                  isLoading={isTagLoading} 
                  title="Suggest tags with AI"
                />
              </div>
            }
          >
            <Select  
              mode="multiple" 
              allowClear
              placeholder="Select tags..."
              options={tagsData?.map(tag => ({
                label: ( 
                  <span>
                    <span 
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        backgroundColor: tag.color,
                        marginRight: '8px',
                        borderRadius: '2px',
                        border: '1px solid #ccc', 
                      }}
                    ></span>
                    {tag.name}
                  </span>
                ),
                value: tag._id, 
              }))}
              optionFilterProp="label"  
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }} wrapperCol={{ span: 12, offset: 12}}>
            <Space>
              <Button onClick={closeModal} > Cancel </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={
                  createTaskMutation.isPending ||
                  updateTaskMutation.isPending ||
                  isSubtaskLoading || 
                  isDescriptionLoading || 
                  isTagLoading 
                }
              >
                {isEditMode ? "Save Changes" : "Create Task"}
              </Button>
            </Space>

          </Form.Item>
        </Form>
      )}
    </Modal>
    </>
  );
};