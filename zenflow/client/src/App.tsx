import { Layout, Tooltip, Typography } from 'antd';
import { KanbanBoard } from './components/KanbanBoard'; 
import { TaskModal } from './components/TaskModal';
import { Footer } from 'antd/es/layout/layout';
import { FocusTimer } from './components/FocusTimer';
import { WeeklyReportModal } from './components/WeeklyReportModal';
import { useUiStore } from './store/uiStore';
import { FundViewOutlined } from '@ant-design/icons'; 

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const { openReportModal } = useUiStore();
  
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FocusTimer />
          <Tooltip title="Haftalık Raporu Görüntüle">
            <FundViewOutlined
              style={{
                fontSize: '24px',
                cursor: 'pointer',
                marginLeft: '16px',
              }}
              onClick={openReportModal} 
            />
          </Tooltip>
        </div>
      </Header>
      <Content style={{ padding: '0 24px' }}>
        <KanbanBoard/>
        <TaskModal />
        <WeeklyReportModal />
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        ZenFlow ©{new Date().getFullYear()} — A Full-Stack Kanban Board
      </Footer>
    </Layout>
  );
}

export default App;