export interface ITask {
  _id: string;
  title: string;
  description?: string;
  pomodoroCount:number;
  createdAt: string;
  updatedAt: string;
}

export interface IColumn {
  _id: string;
  title: string;
  tasks: ITask[];
}

export interface MoveTaskPayload {
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  destinationIndex: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
}

export type BoardData = IColumn[];