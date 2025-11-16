import { useEffect, useRef } from 'react';
import { useUiStore } from '../store/uiStore';
import { Button, message, Typography } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completePomodoro } from '../api/taskApi';
import { useAuthStore } from '../store/authStore';

const { Text } = Typography;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const FocusTimer = () => {
  const {
    secondsRemaining,
    isTimerRunning,
    activeTaskId,
    timerMode,
    tick,
    stopTimer,
  } = useUiStore();

  const { enableMusic } = useAuthStore((state) => state.user.settings);
  
  const queryClient = useQueryClient();

  const audioRef = useRef(new Audio('/sounds/relaxing-music.mp3'));
  audioRef.current.loop = true;
  
  const pomodoroMutation = useMutation({
    mutationFn: completePomodoro,
    onSuccess: (updatedTask) => {
      message.success(`Pomodoro for "${updatedTask.title}" completed! Time for a break.`);
      queryClient.invalidateQueries({ queryKey: ['boardData'] });
    },
    onError: (err) => message.error(`Failed to log Pomodoro: ${err.message}`),
  });


  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, tick]); 

  useEffect(() => {
    if (secondsRemaining === 0) {
      if (timerMode === 'pomodoro' && activeTaskId) {
        pomodoroMutation.mutate(activeTaskId);
        new Audio('/sounds/notification.mp3').play(); 
      } else if (timerMode === 'break') {
        message.info('Break is over! Time to focus.');
        new Audio('/sounds/notification.mp3').play();
      }
    }
  }, [secondsRemaining, timerMode, activeTaskId, pomodoroMutation]);

  useEffect(() => {
    if (isTimerRunning && enableMusic) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [isTimerRunning, enableMusic]);

  if (!isTimerRunning && secondsRemaining === 1500) {
    return null;
  }
  
  return (
    <div style={{ marginRight: '24px', display: 'flex', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: '1.2rem', marginRight: '16px' }}>
        {timerMode === 'break' ? '☕️ ' : '🍅 '}
        {formatTime(secondsRemaining)}
      </Text>
      {isTimerRunning ? (
        <Button danger onClick={stopTimer}>
          Stop
        </Button>
      ) : (
        <Button type="primary" onClick={() => { /* Start/Resume logic */ }}>
    
          Resume
        </Button>
      )}
    </div>
  );
};