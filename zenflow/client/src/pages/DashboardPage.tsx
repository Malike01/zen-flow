import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyBoards, createBoard } from '../api/boardApi';
import { Layout, Row, Col, Card, Spin, Alert, Typography, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const { Header, Content } = Layout;
const { Title } = Typography;

export const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();


  const {
    data: boards,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['myBoards'],
    queryFn: getMyBoards,
  });

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: (newBoard) => {
      messageApi.success(`'${newBoard.name}' panosu oluşturuldu!`);
      queryClient.invalidateQueries({ queryKey: ['myBoards'] }); 
      setIsModalOpen(false);
      form.resetFields();
      navigate(`/board/${newBoard._id}`); 
    },
    onError: (err) => {
      messageApi.error(`Pano oluşturulamadı: ${err.message}`);
    },
  });

  const handleCreateBoard = (values: { name: string }) => {
    createBoardMutation.mutate(values.name);
  };

  const handleLogout = () => {
    logout();
    messageApi.success('Başarıyla çıkış yaptınız.');
    navigate('/auth');
  };

  const renderContent = () => {
    if (isLoading) {
      return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>;
    }
    if (isError) {
      return <Alert message="Panolar yüklenemedi" description={error.message} type="error" showIcon />;
    }
    return (
      <Row gutter={[16, 16]} style={{ padding: '24px', width: '100%'}}>
        {boards?.map((board) => (
          <Col xs={24} sm={12} md={8} lg={6} key={board._id}>
            <Card
              hoverable
              title={board.name}
              onClick={() => navigate(`/board/${board._id}`)} 
            >
              <p>Oluşturan: {board.owner}</p> 
              <p>Oluşturulma: {new Date(board.createdAt).toLocaleDateString()}</p>
            </Card>
          </Col>
        ))}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{ borderStyle: 'dashed', height: '100%', minHeight: '158px', display: 'grid', placeItems: 'center' }}
            onClick={() => setIsModalOpen(true)}
          >
            <Button type="text" icon={<PlusOutlined />} size="large">
              Yeni Pano Oluştur
            </Button>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <>
    {contextHolder}
    <Layout style={{height:'100vh'}}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <Title level={3} style={{ color: 'inherit', margin: 0 }}>Panolarım (Dashboard)</Title>
        <Button danger onClick={handleLogout}>Çıkış Yap</Button>
      </Header>
      <Content style={{ background: '#f0f2f5' }}>
        {renderContent()}
      </Content>

      <Modal
        title="Yeni Pano Oluştur"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createBoardMutation.isPending}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateBoard} style={{ marginTop: '24px' }}>
          <Form.Item
            name="name"
            label="Pano Adı"
            rules={[{ required: true, message: 'Lütfen bir pano adı girin!' }]}
          >
            <Input placeholder="Örn: Kişisel Projelerim" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
    </>
  );
};