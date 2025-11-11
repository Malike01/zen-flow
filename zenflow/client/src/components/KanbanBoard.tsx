import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import type { IColumn, MoveTaskPayload } from '../types';
import { Column } from './Column';
import { useBoardQuery } from '../hooks/useBoardQuery';
import { Layout, Spin, Alert } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moveTask } from '../api/boardApi';
import { message } from 'antd'; 

export const KanbanBoard = () => {
  const queryClient = useQueryClient();
  
  const { data: boardData, isLoading, isError, error } = useBoardQuery();

  // 2. DATA MUTATION 
  const moveTaskMutation = useMutation({
    mutationFn: moveTask,

    // --- This is the Optimistic Update logic ---
    onMutate: async (movedTask: MoveTaskPayload) => {
      await queryClient.cancelQueries({ queryKey: ['boardData'] });

      const previousBoard = queryClient.getQueryData<IColumn[]>(['boardData']);

      queryClient.setQueryData<IColumn[]>(['boardData'], (oldBoard) => {
        if (!oldBoard) return [];

        // Create a new copy of the board state
        const newBoard = oldBoard.map(col => ({ ...col, tasks: [...col.tasks] }));

        const sourceCol = newBoard.find(col => col._id === movedTask.sourceColumnId);
        const destCol = newBoard.find(col => col._id === movedTask.destinationColumnId);
        
        if (!sourceCol || !destCol) return oldBoard; // Safety check

        const taskToMove = sourceCol.tasks.find(task => task._id === movedTask.taskId);
        if (!taskToMove) return oldBoard;

        // Remove task from source column
        sourceCol.tasks = sourceCol.tasks.filter(task => task._id !== movedTask.taskId);
        
        // Add task to destination column at the correct index
        destCol.tasks.splice(movedTask.destinationIndex, 0, taskToMove);

        return newBoard;
      });

      // 4. Return the snapshotted value (to be used in onError)
      return { previousBoard };
    },

    // --- This is the Rollback logic ---
    onError: (err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(['boardData'], context.previousBoard);
      }
      message.error(`Failed to move task: ${err.message}`);
    },

    // --- This runs after success OR error ---
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['boardData'] });
    },
  });

  // ----------------------------------------------------


  // 3. DRAG END HANDLER
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveTaskMutation.mutate({
      taskId: draggableId,
      sourceColumnId: source.droppableId,
      destinationColumnId: destination.droppableId,
      destinationIndex: destination.index,
    });
  };

  if (isLoading) {
    return (
      <Layout style={{ minHeight: 'calc(100vh - 64px)', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" tip="Loading Board..." />
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout style={{ minHeight: 'calc(100vh - 64px)', padding: '50px' }}>
        <Alert
          message="Error!"
          description={`Could not fetch board data: ${error.message}`}
          type="error"
          showIcon
        />
      </Layout>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', padding: '24px 0' }}>
        {boardData && boardData.map((column) => (
          <Column key={column._id} column={column} />
        ))}
      </div>
    </DragDropContext>
  );
};