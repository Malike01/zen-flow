import { Layout, Typography } from 'antd';
import { KanbanBoard } from './components/KanbanBoard'; 
import { TaskModal } from './components/TaskModal';
import { Footer } from 'antd/es/layout/layout';
import { FocusTimer } from './components/FocusTimer';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
        }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={3} style={{ color: 'inherit', margin: '16px 0' }}>
              ZenFlow
            </Title>
        </div>
        <div>
          <FocusTimer />
        </div>
      </Header>
      <Content style={{ padding: '0 24px' }}>
        <KanbanBoard/>
        <TaskModal />
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        ZenFlow ©{new Date().getFullYear()} — A Full-Stack Kanban Board
      </Footer>
    </Layout>
  );
}

export default App;