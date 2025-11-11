import { Typography, Button } from 'antd'; 
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import { useUiStore } from '../store/uiStore'; 
import { PlusOutlined } from '@ant-design/icons'; 
import type { IColumn } from '../types';

const { Title } = Typography;

interface ColumnProps {
  column: IColumn;
}

export const Column = ({ column }: ColumnProps) => {
  const { openModal } = useUiStore();

  return (
    <div
      style={{
        width: '300px',
        margin: '0 8px',
        background: '#f0f2f5',
        borderRadius: '8px',
        display: 'flex', 
        flexDirection: 'column', 
      }}
    >
      <Title level={5} style={{ padding: '16px 16px 8px 16px' }}>
        {column.title}
      </Title>

      {column.title === 'To Do' && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          style={{ margin: '0 16px 16px 16px' }}
          onClick={()=> openModal('create')}
        >
          Add New Task
        </Button>
      )}
      {/* ---------------------------------- */}

      <Droppable droppableId={column._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              padding: '8px 16px 16px 16px',
              minHeight: '400px',
              background: snapshot.isDraggingOver ? '#d9f7be' : 'transparent',
              flexGrow: 1,
            }}
          >
            {column.tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};