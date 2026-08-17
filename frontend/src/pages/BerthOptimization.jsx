import React, { useState } from 'react';
import { Card, Form, Button, Table, Space, InputNumber, Select, Alert, Spin } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import axios from 'axios';

const BerthOptimization = ({ socket }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [berthData, setBerthData] = useState([]);

  const handleOptimize = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/berth/optimize`,
        {
          vesselId: values.vesselId,
          arrivalTime: new Date(),
          requiredCranes: values.requiredCranes,
          containerCount: values.containerCount,
        }
      );
      setResults(response.data.data);
    } catch (error) {
      console.error('Error optimizing berth:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Berth Name',
      dataIndex: ['assignedBerth', 'berthName'],
      key: 'berthName',
    },
    {
      title: 'Status',
      dataIndex: ['assignedBerth', 'status'],
      key: 'status',
      render: (text) => (
        <span style={{
          color: text === 'available' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold',
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Assigned Cranes',
      dataIndex: 'optimizedCranes',
      key: 'cranes',
    },
    {
      title: 'Est. Service Time',
      dataIndex: 'estimatedServiceTime',
      key: 'serviceTime',
      render: (text) => `${text} hours`,
    },
    {
      title: 'Time Savings',
      dataIndex: 'potentialSavings',
      key: 'savings',
      render: (text) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          <ArrowUpOutlined /> {text} hours
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>⚓ Berth Allocation Optimization</h2>

      <Card style={{ marginBottom: 20 }}>
        <Alert
          message="Berth Optimization Engine"
          description="Automatically allocate berths and cranes to minimize turnaround time. Algorithm reduces service time by up to 51%."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <Form form={form} layout="vertical" onFinish={handleOptimize}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Form.Item
              label="Vessel ID"
              name="vesselId"
              rules={[{ required: true, message: 'Please select vessel' }]}
            >
              <Select
                placeholder="Select vessel"
                options={[
                  { label: 'VESSEL-001', value: '001' },
                  { label: 'VESSEL-002', value: '002' },
                  { label: 'VESSEL-003', value: '003' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Container Count"
              name="containerCount"
              rules={[{ required: true, message: 'Please enter count' }]}
            >
              <InputNumber placeholder="e.g., 800" min={0} max={10000} />
            </Form.Item>

            <Form.Item
              label="Required Cranes"
              name="requiredCranes"
              rules={[{ required: true, message: 'Please select' }]}
            >
              <Select
                placeholder="Number of cranes"
                options={[
                  { label: '2 Cranes', value: 2 },
                  { label: '3 Cranes', value: 3 },
                  { label: '4 Cranes', value: 4 },
                  { label: '5 Cranes', value: 5 },
                ]}
              />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" size="large" loading={loading}>
            🚀 Run Optimization
          </Button>
        </Form>
      </Card>

      {results && (
        <Card title="📊 Optimization Results">
          <Spin spinning={loading}>
            <Table
              dataSource={[results]}
              columns={columns}
              pagination={false}
              rowKey="assignedBerth._id"
            />
          </Spin>
        </Card>
      )}
    </div>
  );
};

export default BerthOptimization;
