import { Button, Modal, Switch, Typography, message } from 'antd';
import { useUiStore } from '../store/uiStore'; 
import { useAuthStore } from '../store/authStore'; 
import { useMutation } from '@tanstack/react-query';
import { updateUserSettings } from '../api/userApi';

const { Text } = Typography;

export const SettingsModal = () => {
  const { isSettingsModalOpen, closeSettingsModal } = useUiStore();
  
  const { user, updateSettings: updateAuthStore } = useAuthStore();
  
  const updateSettingsMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (newSettings) => {
      updateAuthStore(newSettings); 
      message.success('Settings updated!');
    },
    onError: (err) => {
      message.error(`Failed to update settings: ${err.message}`);
    },
  });

  const handleMusicToggle = (checked: boolean) => {
    updateSettingsMutation.mutate({ enableMusic: checked });
  };

  return (
    <Modal
      title="Ayarlar"
      open={isSettingsModalOpen}
      onCancel={closeSettingsModal}
      footer={[
        <Button key="close" onClick={closeSettingsModal}>
          Kapat
        </Button>,
      ]}
    >
      <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>Rahatlatıcı Müziği Etkinleştir</Text>
        <Switch
          checked={user.settings.enableMusic} 
          onChange={handleMusicToggle}
          loading={updateSettingsMutation.isPending} 
        />
      </div>
    </Modal>
  );
};