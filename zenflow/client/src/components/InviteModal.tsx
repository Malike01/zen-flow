import { Modal, Form, Input, Button, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inviteUserToBoard } from '../api/boardApi';

interface InviteModalProps {
  boardId: string;
  open: boolean;
  onClose: () => void;
}

export const InviteModal = ({ boardId, open, onClose }: InviteModalProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [messageApi, contextHolder] = message.useMessage();


  const inviteMutation = useMutation({
    mutationFn: (email: string) => inviteUserToBoard(boardId, email),
    onSuccess: () => {
      messageApi.success('User invited!');
      queryClient.invalidateQueries({ queryKey: ['boardData', boardId] });
      form.resetFields();
      onClose();
    },
    onError: (err) => {
      messageApi.error(`Failed to invite: ${err.message}`);
    },
  });

  const handleInvite = (values: { email: string }) => {
    inviteMutation.mutate(values.email);
  };

  return (
    <>
    {contextHolder}
    <Modal
      title="Invite User to Board"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={inviteMutation.isPending}
          onClick={() => form.submit()}
        >
          Send Invite
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleInvite} style={{ marginTop: '24px' }}>
        <Form.Item
          name="email"
          label="User Email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
};