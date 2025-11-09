import { Button, Layout } from 'antd'; // Button ve Layout'u import et
import './App.css'; // İsteğe bağlı, bu dosyayı da temizleyebilirsiniz

function App() {
  return (
    <Layout style={{ minHeight: '100vh', padding: '50px' }}>
      <h1>ZenFlow Projesi</h1>
      <Button type="primary" size="large">
        Kurulum Başarılı!
      </Button>
    </Layout>
  );
}

export default App;