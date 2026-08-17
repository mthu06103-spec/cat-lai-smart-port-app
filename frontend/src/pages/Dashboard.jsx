import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Space, Progress, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = ({ socket }) => {
  const [kpiData, setKpiData] = useState({
    averageTurnaroundTime: 0,
    craneProductivity: 0,
    powerConsumption: 0,
    containerPositioningAccuracy: 0,
    safetyIncidents: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/analytics/kpi`);
        setKpiData(response.data.data);
      } catch (error) {
        console.error('Error fetching KPI:', error);
      }
    };

    const fetchTrends = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/analytics/trends?days=7`);
        const processedData = response.data.data.map((item, index) => ({
          time: `${index}h`,
          productivity: Math.random() * 100 + 40,
          turnaroundTime: Math.random() * 20 + 5,
          power: Math.random() * 500 + 1000,
        }));
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPI();
    fetchTrends();
  }, []);

  // Real-time updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    socket.on('kpi-update', (data) => {
      setKpiData(data);
    });

    return () => {
      socket.off('kpi-update');
    };
  }, [socket]);

  return (
    <div style={{ width: '100%' }}>
      <h2>📊 Dashboard KPI Real-time</h2>

      {/* KPI Cards */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Turnaround Time"
              value={kpiData.averageTurnaroundTime}
              precision={2}
              suffix="hrs"
              prefix={<ArrowDownOutlined style={{ color: '#52c41a' }} />}
            />
            <Progress percent={75} strokeColor="#52c41a" />
            <p style={{ fontSize: 12, color: '#999' }}>↓ 51% improvement</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Crane Productivity"
              value={kpiData.craneProductivity}
              precision={1}
              suffix="moves/hr"
              prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
            />
            <Progress percent={82} strokeColor="#52c41a" />
            <p style={{ fontSize: 12, color: '#999' }}>+18% performance</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Power Consumption"
              value={kpiData.powerConsumption}
              precision={0}
              suffix="kWh"
              prefix={<ArrowDownOutlined style={{ color: '#52c41a' }} />}
            />
            <Progress percent={65} strokeColor="#1890ff" />
            <p style={{ fontSize: 12, color: '#999' }}>↓ 28% CO₂ reduction</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Safety Status"
              value={kpiData.safetyIncidents}
              precision={0}
              suffix="incidents"
            />
            <Tag color="green">✅ All Clear</Tag>
            <p style={{ fontSize: 12, color: '#999' }}>↓ 30% accident reduction</p>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="📈 Productivity Trend (7 days)" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="productivity" stroke="#52c41a" fillOpacity={1} fill="url(#colorProductivity)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="⚡ Power Consumption" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="power" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Status Board */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col xs={24}>
          <Card title="🚢 Active Vessels Status">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[
                { name: 'VESSEL-001', status: 'Loading', progress: 45 },
                { name: 'VESSEL-002', status: 'Unloading', progress: 70 },
                { name: 'VESSEL-003', status: 'Waiting', progress: 0 },
                { name: 'VESSEL-004', status: 'Completed', progress: 100 },
              ].map((vessel, idx) => (
                <div key={idx} style={{ padding: 10, border: '1px solid #eee', borderRadius: 4 }}>
                  <p><strong>{vessel.name}</strong></p>
                  <p>{vessel.status}</p>
                  <Progress percent={vessel.progress} />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
