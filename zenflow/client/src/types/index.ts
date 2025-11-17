export interface ITask {
  _id: string;
  title: string;
  description?: string;
  tags?: ITag[];
  pomodoroCount:number;
  completedAt: string;
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
  boardId: string;
  sourceIndex: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  tags: string[];
  boardId: string;
  columnId: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
}

export interface ITag {
  _id: string;
  name: string;
  color: string;
}
export interface IBoard {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  columns: IColumn[]; 
  createdAt: string;
}
export interface IBoardSummary {
  _id: string;
  name: string;
  owner: string;
  createdAt: string;
}

export type BoardData = IColumn[];