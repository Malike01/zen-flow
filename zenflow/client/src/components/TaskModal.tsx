import { Modal, Form, Input, Button, message } from 'antd';
import { useUiStore } from '../store/uiStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '../api/taskApi';
import { useEffect } from 'react';

import type { CreateTaskPayload, IColumn, ITask, UpdateTaskPayload } from '../types';

const { TextArea } = Input;

export const TaskModal = () => {
  const { isTaskModalOpen, modalMode, editingTaskId, closeModal } = useUiStore();

  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const isEditMode = modalMode === 'edit';

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      message.success('Task created!');
      queryClient.invalidateQueries({ queryKey: ['boardData'] });
      closeModal(); 
    },
    onError: (err) => message.error(`Failed to create task: ${err.message}`),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string, payload: UpdateTaskPayload }) =>
      updateTask(taskId, payload),
    onSuccess: () => {
      message.success('Task updated!');
      queryClient.invalidateQueries({ queryKey: ['boardData'] });
      closeModal();
    },
    onError: (err) => message.error(`Failed to update task: ${err.message}`),
  });

  useEffect(() => {
    if (isEditMode && editingTaskId) {
      const taskData: ITask | undefined = queryClient
        .getQueryData<IColumn[]>(['boardData'])
        ?.flatMap((col) => col.tasks)
        .find((task) => task._id === editingTaskId);
      
      if (taskData) {
        form.setFieldsValue(taskData);
      }
    } else {
      form.resetFields();
    }
  }, [isEditMode, editingTaskId, queryClient, form]);

  const onFinish = (values: CreateTaskPayload | UpdateTaskPayload) => {
    if (isEditMode) {
      // Edit Mode
      if (!editingTaskId) return;
      updateTaskMutation.mutate({ taskId: editingTaskId, payload: values });
    } else {
      // Create Mode
      createTaskMutation.mutate(values as CreateTaskPayload);
      form.resetFields();
    }
  };

  return (
    <Modal
      title={isEditMode ? "Edit Task" : "Create New Task"}
      open={isTaskModalOpen} 
      onCancel={closeModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button onClick={closeModal} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createTaskMutation.isPending || updateTaskMutation.isPending}
          >
            {isEditMode ? "Save Changes" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};