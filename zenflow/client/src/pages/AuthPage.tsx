import { useState } from 'react';
import { Layout, Row, Col, Card, Form, Input, Button, message, Typography } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginUser, registerUser } from '../api/authApi';

const { Title, Link, Text } = Typography;

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { login: loginToStore } = useAuthStore();

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  };

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      message.success('Welcome back!');
      loginToStore(data);
      navigate('/');
    },
    onError: (error) => {
      message.error(`Login failed: ${getErrorMessage(error)}`);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      message.success('Registration successful! Logging you in...');
      loginToStore(data); 
      navigate('/');
    },
    onError: (error) => {
      message.error(`Registration failed: ${getErrorMessage(error)}`);
    },
  });

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    if (mode === 'login') {
      loginMutation.mutate(values);
    } else {
      registerMutation.mutate(values);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    form.resetFields(); 
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f0f2f5' }}>
      <Row>
        <Col>
          <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={2}>ZenFlow</Title>
              <Text>{mode === 'login' ? 'Welcome back!' : 'Create your account'}</Text>
            </div>
            
            <Form
              form={form}
              name="auth-form"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
              >
                <Input placeholder="test@example.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]}
              >
                <Input.Password placeholder="******" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loginMutation.isPending || registerMutation.isPending}
                >
                  {mode === 'login' ? 'Login' : 'Register'}
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                {mode === 'login' ? (
                  <Text>
                    Don't have an account? <Link onClick={toggleMode}>Register now</Link>
                  </Text>
                ) : (
                  <Text>
                    Already have an account? <Link onClick={toggleMode}>Login</Link>
                  </Text>
                )}
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};