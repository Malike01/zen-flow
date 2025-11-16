import { create } from 'zustand';

const POMODORO_TIME = 25 * 60;
const BREAK_TIME = 5 * 60; 

type TimerMode = 'pomodoro' | 'break';

interface UiState {
  // Modal State
  isTaskModalOpen: boolean;
  modalMode: 'create' | 'edit';
  editingTaskId: string | null;
  openModal: (mode: 'create' | 'edit', taskId?: string) => void;
  closeModal: () => void;

  //Timer
  isTimerRunning: boolean;
  timerMode: TimerMode;
  activeTaskId: string | null; 
  secondsRemaining: number;

  startTimer: (taskId: string) => void;
  stopTimer: () => void;
  tick: () => void;
  // ------------------------------------------
}

export const useUiStore = create<UiState>((set, get) => ({
  // Modal State
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

  //Timer
  isTimerRunning: false,
  timerMode: 'pomodoro',
  activeTaskId: null,
  secondsRemaining: POMODORO_TIME,

  startTimer: (taskId) =>
    set({
      isTimerRunning: true,
      activeTaskId: taskId,
      secondsRemaining: POMODORO_TIME,
      timerMode: 'pomodoro',
    }),

  stopTimer: () =>
    set({
      isTimerRunning: false,
      activeTaskId: null,
      secondsRemaining: POMODORO_TIME, 
      timerMode: 'pomodoro',
    }),

  tick: () => {
    const { secondsRemaining, timerMode } = get();
    if (secondsRemaining > 0) {
      set({ secondsRemaining: secondsRemaining - 1 });
    } else {
      if (timerMode === 'pomodoro') {
        set({
          isTimerRunning: false,
          timerMode: 'break',
          secondsRemaining: BREAK_TIME,
        });
      } else {
        set({
          isTimerRunning: false,
          timerMode: 'pomodoro',
          secondsRemaining: POMODORO_TIME,
        });
      }
    }
  },
  // ------------------------------------
}));