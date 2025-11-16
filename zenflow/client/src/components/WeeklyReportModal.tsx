import { Modal, Row, Col, Statistic, Spin, Alert, Empty, List, Typography, Button } from 'antd';
import { useUiStore } from '../store/uiStore';
import { useQuery } from '@tanstack/react-query';
import { fetchWeeklyReport } from '../api/reportApi';
import { Column } from '@ant-design/charts';
import dayjs from 'dayjs';
import type { ITask } from '../types';

const { Title, Text } = Typography;

const processDataForChart = (tasks: ITask[] = []) => {
  const daysOfWeek = ['Paz', 'Sal', 'Çar', 'Per', 'Cuma', 'Cts', 'Paz'];
  const dailyData: { day: string; tasks: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day');
    dailyData.push({
      day: daysOfWeek[date.day()], 
      tasks: 0,
    });
  }

  tasks.forEach(task => {
    if (task.completedAt) {
      const completionDay = dayjs(task.completedAt).day();
      const dayName = daysOfWeek[completionDay];
      
      const dayData = dailyData.find(d => d.day === dayName);
      if (dayData) {
        dayData.tasks += 1;
      }
    }
  });


  const simplerData: { [key: string]: number } = {};
  tasks.forEach(task => {
    if (task.completedAt) {
      const dateKey = dayjs(task.completedAt).format('YYYY-MM-DD');
      if (!simplerData[dateKey]) {
        simplerData[dateKey] = 0;
      }
      simplerData[dateKey] += 1;
    }
  });

  // { '2025-11-16': 2, '2025-11-15': 1 } -> [ { date: '11-16', tasks: 2 }, ... ]
  const chartData = Object.keys(simplerData).map(dateKey => ({
    date: dayjs(dateKey).format('MM-DD'),
    tasks: simplerData[dateKey],
  })).sort((a, b) => dayjs(a.date, 'MM-DD').isAfter(dayjs(b.date, 'MM-DD')) ? 1 : -1);


  return chartData;
};


export const WeeklyReportModal = () => {
  const { isReportModalOpen, closeReportModal } = useUiStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['weeklyReport'],
    queryFn: fetchWeeklyReport,
    enabled: isReportModalOpen, 
  });

  const chartData = processDataForChart(data?.tasks);

  const chartConfig = {
    data: chartData,
    xField: 'date',
    yField: 'tasks',
    xAxis: { title: { text: 'Tarih' } },
    yAxis: { title: { text: 'Bitirilen Görev' } },
    label: {
      position: 'top' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  const renderContent = () => {
    if (isLoading) {
      return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }
    if (isError) {
      return <Alert message="Hata!" description={error.message} type="error" showIcon />;
    }
    if (!data || data.totalTasksCompleted === 0) {
      return <Empty description="Görünüşe göre bu hafta hiç görev tamamlamamışsınız. Devam edin!" />;
    }

    return (
      <Row gutter={[16, 24]}>
        {/*Statistics */}
        <Col span={12}>
          <Statistic title="Toplam Bitirilen Görev" value={data.totalTasksCompleted} />
        </Col>
        <Col span={12}>
          <Statistic
            title="Toplam Odaklanma (Pomodoro)"
            value={data.totalPomodoros}
            suffix="🍅"
          />
          <Text type="secondary">{`(Yaklaşık ${Math.round((data.totalPomodoros * 25) / 60)} saat)`}</Text>
        </Col>

        {/*Chart*/}
        <Col span={24}>
          <Title level={5} style={{ marginTop: '16px' }}>Haftalık Döküm</Title>
          <Column {...chartConfig} />
        </Col>
        
        {/* Completed List */}
        <Col span={24}>
           <Title level={5} style={{ marginTop: '16px' }}>Tamamlanan Görevler</Title>
           <List
              size="small"
              bordered
              dataSource={data.tasks}
              renderItem={(item) => (
                <List.Item>
                  <Text>{item.title}</Text>
                  <Text type="secondary">{`(${item.pomodoroCount} 🍅)`}</Text>
                </List.Item>
              )}
           />
        </Col>
      </Row>
    );
  };

  return (
    <Modal
      title="Haftalık Akış Raporu"
      open={isReportModalOpen}
      onCancel={closeReportModal}
      centered
      footer={[
        <Button key="close" onClick={closeReportModal}>
          Kapat
        </Button>,
      ]}
      width="800px" 
    >
      {renderContent()}
    </Modal>
  );
};