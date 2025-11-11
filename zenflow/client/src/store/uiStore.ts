import { create } from 'zustand';

interface UiState {
isTaskModalOpen: boolean;
  modalMode: 'create' | 'edit';
  editingTaskId: string | null; 
  openModal: (mode: 'create' | 'edit', taskId?: string) => void;
  closeModal: () => void;
}


export const useUiStore = create<UiState>((set) => ({
  isTaskModalOpen: false,
  modalMode: 'create', 
  editingTaskId: null,

  openModal: (mode, taskId = undefined) =>
    set({
      isTaskModalOpen: true,
      modalMode: mode,
      editingTaskId: taskId || null,
    }),

  closeModal: () =>
    set({
      isTaskModalOpen: false,
      editingTaskId: null,
      modalMode: 'create', 
    }),
}));