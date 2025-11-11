import { Card, Popconfirm, message } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api/taskApi'; 
import { useUiStore } from '../store/uiStore'; 
import type { ITask } from '../types';

interface TaskCardProps {
  task: ITask;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const queryClient = useQueryClient();

  const { openModal } = useUiStore();

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      message.success('Task deleted');
      queryClient.invalidateQueries({ queryKey: ['boardData'] });
    },
    onError: (err) => {
      message.error(`Failed to delete task: ${err.message}`);
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTaskMutation.mutate(task._id);
  };

  const handleCardClick = () => {
    openModal("edit", task._id); 
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            marginBottom: '8px',
            ...provided.draggableProps.style,
          }}
        >
          <Card
            hoverable
            size="small"
            onClick={handleCardClick} 
            title={task.title}
            style={{
              background: snapshot.isDragging ? '#e6f7ff' : 'white',
            }}
            extra={
              <>
                <EditOutlined
                  style={{ marginRight: 8, color: '#1890ff' }}
                />
                
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={(e:any)=> handleDelete(e)} 
                  onCancel={(e) => e?.stopPropagation()} 
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined
                    style={{ color: '#ff4d4f' }}
                    onClick={(e) => e.stopPropagation()} 
                  />
                </Popconfirm>
              </>
            }
          >
            {task.description}
          </Card>
        </div>
      )}
    </Draggable>
  );
};