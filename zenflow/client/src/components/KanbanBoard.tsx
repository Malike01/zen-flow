import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import type { IBoard, IColumn, MoveTaskPayload } from '../types';
import { Column } from './Column';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd'; 
import { moveTask } from '../api/taskApi';

type KanbanBoardProps = {
  board: IBoard; 
}

export const KanbanBoard = ({ board }: KanbanBoardProps) => {
  const queryClient = useQueryClient();

  // 2. DATA MUTATION 
const moveTaskMutation = useMutation({
    mutationFn: moveTask,

    onMutate: async (movedTask: MoveTaskPayload) => {
      await queryClient.cancelQueries({ queryKey: ['boardData', board._id] });

      const previousBoard = queryClient.getQueryData<IBoard>(['boardData', board._id]);

      queryClient.setQueryData<IBoard>(['boardData', board._id], (oldBoard) => {
        if (!oldBoard) return undefined; 
 
        const newColumns = oldBoard.columns.map(col => ({
          ...col,
          tasks: [...col.tasks], 
        }));

        const sourceCol = newColumns.find(col => col._id === movedTask.sourceColumnId);
        const destCol = newColumns.find(col => col._id === movedTask.destinationColumnId);
        
        if (!sourceCol || !destCol) return oldBoard; 

        const [taskToMove] = sourceCol.tasks.splice(movedTask.sourceIndex, 1);
        
        if (!taskToMove) return oldBoard;

        destCol.tasks.splice(movedTask.destinationIndex, 0, taskToMove);

        return {
          ...oldBoard,
          columns: newColumns,
        };
      });

      return { previousBoard };
    },

    onError: (err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(['boardData', board._id], context.previousBoard);
      }
      message.error(`Failed to move task: ${err.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['boardData', board._id] });
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
      sourceIndex: source.index,
      boardId: board._id,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', padding: '24px 0' }}>
       {board.columns.map((column: IColumn) => ( // Tip adını 'IColumnType' olarak değiştirdik
          <Column key={column._id} column={column} />
        ))}
      </div>
    </DragDropContext>
  );
};