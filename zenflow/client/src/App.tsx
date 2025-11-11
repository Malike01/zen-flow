import { Layout, Typography } from 'antd';
import { KanbanBoard } from './components/KanbanBoard'; 
import { TaskModal } from './components/TaskModal';
import { Footer } from 'antd/es/layout/layout';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white' }}>
        <Title level={3} style={{ color: 'inherit', margin: '16px 0' }}>
          ZenFlow
        </Title>
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