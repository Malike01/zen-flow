import { useUiStore } from '../store/uiStore';
import { Alert, Breadcrumb, Button, Layout, message, Spin, Tooltip } from 'antd';
import {  Footer } from 'antd/es/layout/layout';
import { FocusTimer } from '../components/FocusTimer';
import { FundViewOutlined, HomeOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons'; 
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import { WeeklyReportModal } from '../components/WeeklyReportModal';
import { SettingsModal } from '../components/SettingsModal';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore'; 
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import { useQuery } from '@tanstack/react-query';
import { getBoardById } from '../api/boardApi';
import { useState } from 'react';
import { InviteModal } from '../components/InviteModal';

const { Header, Content } = Layout;

function BoardDetailPage() {
  const { openReportModal, openSettingsModal} = useUiStore();

  const [messageApi, contextHolder] = message.useMessage();

  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const { boardId } = useParams<{ boardId: string }>();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const {
    data: boardData, 
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['boardData', boardId],
    queryFn: () => getBoardById(boardId!), 
    enabled: !!boardId, 
  });

  const handleLogout = () => {
    logout(); 
    messageApi.success('Başarıyla çıkış yaptınız.');
    navigate('/auth'); 
  };

  const renderContent = () => {
    if (isLoading) {
      return <div style={{ display: 'grid', placeItems: 'center', height: 'calc(100vh - 128px)' }}><Spin size="large" /></div>;
    }

    if (isError) {
      return <Alert message="Pano Yüklenemedi" description={error.message} type="error" showIcon />;
    }

    if (boardData) {
      return <KanbanBoard board={boardData} />;
    }
    
    return null;
  };
  
  
  return (
    <>
    {contextHolder}
    <Layout style={{ minHeight: '100vh'}}>
      <Header style={{ 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
        }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center' }}>
          <Breadcrumb
            style={{ color: 'white' }}
            items={[
              {
                title: (
                  <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    <HomeOutlined />
                    <span style={{ marginLeft: '8px' }}>Panolarım</span>
                  </Link>
                ),
              },
              {
                title: (
                  <span style={{ color: 'white', fontWeight: 'bold' }}>
                    {isLoading ? '...' : boardData?.name}
                  </span>
                ),
              },
            ]}
          />
        </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FocusTimer />
          <Tooltip title="Invite User">
            <Button
              type="primary" 
              icon={<UserAddOutlined />}
              style={{ marginLeft: '24px' }}
              onClick={() => setIsInviteModalOpen(true)}
            >
              Invite
            </Button>
          </Tooltip>
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
          <Tooltip title="Ayarlar">
            <SettingOutlined
              style={{ fontSize: '24px', cursor: 'pointer', marginLeft: '16px' }}
              onClick={openSettingsModal} // 'uiStore'u tetikle
            />
          </Tooltip>
          <Tooltip title="Çıkış Yap (Logout)">
            <LogoutOutlined
              style={{
                fontSize: '24px',
                cursor: 'pointer',
                marginLeft: '16px',
                color: '#ff7875',
              }}
              onClick={handleLogout}
            />
          </Tooltip>
        </div>
      </Header>
      <Content style={{ padding: '0 24px' }}>
        {renderContent()}
        <TaskModal boardId={boardId!} />
        <WeeklyReportModal />
        <SettingsModal/>
        <InviteModal
          boardId={boardId!}
          open={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
        />
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        ZenFlow ©{new Date().getFullYear()} — A Full-Stack Kanban Board
      </Footer>
    </Layout>
    </>
  );
}

export default BoardDetailPage