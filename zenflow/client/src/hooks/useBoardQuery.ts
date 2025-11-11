import { useQuery } from '@tanstack/react-query';
import { fetchBoard } from '../api/boardApi'; 

export const useBoardQuery = () => {
  return useQuery({
    queryKey: ['boardData'], 
    queryFn: fetchBoard,     
  });
};
