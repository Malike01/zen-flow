import { Badge, Card, Popconfirm, Tooltip, message } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { DeleteOutlined, EditOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api/taskApi'; 
import { useUiStore } from '../store/uiStore'; 
import type { ITask } from '../types';
import React from 'react';

interface TaskCardProps {
  task: ITask;
  index: number;
}

export const TaskCard = React.memo(({ task, index }: TaskCardProps) => {
  const queryClient = useQueryClient();

  const [messageApi, contextHolder] = message.useMessage();

  const { openModal, startTimer, stopTimer, activeTaskId, isTimerRunning  } = useUiStore();

  const isTimerActiveOnThisCard = isTimerRunning && activeTaskId === task._id;

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      messageApi.success('Task deleted');
      queryClient.invalidateQueries({ queryKey: ['boardData'] });
    },
    onError: (err) => {
      messageApi.error(`Failed to delete task: ${err.message}`);
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTaskMutation.mutate(task._id);
  };

  const handleCardClick = () => {
   if (isTimerRunning) {
      messageApi.warning('Please stop the timer before editing a task.');
      return;
    }
    openModal('edit', task._id);
  };

  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isTimerActiveOnThisCard) {
      stopTimer();
    } else if (!isTimerRunning) {
      startTimer(task._id);
    } else {
      messageApi.warning('Another task is already in focus!');
    }
  };

 return (
    <>
    {contextHolder}
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
              title={task.title}
              onClick={handleCardClick}
              style={{
                background: snapshot.isDragging ? '#e6f7ff' : 'white',
                border: isTimerActiveOnThisCard ? '2px solid #52c41a' : '1px solid #d9d9d9',
              }}
              extra={
                <div onClick={(e) => e.stopPropagation()}> {/* İkon alanının kart tıklamasını tetiklemesini engelle */}
                  <Tooltip title={isTimerActiveOnThisCard ? 'Stop Timer' : 'Start Focus Timer'}>
                    <span onClick={handleTimerClick} style={{ marginRight: 8, cursor: 'pointer' }}>
                      {isTimerActiveOnThisCard ? (
                        <StopOutlined style={{ color: '#ff4d4f' }} />
                      ) : (
                        <PlayCircleOutlined style={{ color: '#52c41a' }} />
                      )}
                    </span>
                  </Tooltip>
                  <EditOutlined
                    style={{ marginRight: 8, color: '#1890ff', cursor: 'pointer' }}
                    onClick={handleCardClick}
                  />
                                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={(e:any)=> handleDelete(e)}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
                  </Popconfirm>
                </div>
              }
            >
              {/* 5. GÖREV BAŞLIĞI VE POMODORO SAYACI */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{task.description}</span>
                {task.pomodoroCount > 0 && (
                  <Tooltip title={`${task.pomodoroCount} Pomodoro(s) completed`}>
                    <Badge
                      count={`🍅 ${task.pomodoroCount}`}
                      style={{ backgroundColor: '#fff0f0', color: '#cf1322' }}
                    />
                  </Tooltip>
                )}
              </div>
            </Card>
          </div>
        )}
      </Draggable>
      </>
  );
});