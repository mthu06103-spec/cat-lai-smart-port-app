import React, { useState } from 'react';
import { Card, Form, Button, Table, Space, InputNumber, Select, Alert, Spin, Progress } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import axios from 'axios';

const YardOptimization = ({ socket }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleOptimize = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/yard/optimize`,
        {
          containerIds: Array.from({ length: values.containerCount }, (_, i) => `container-${i}`),
          optimization: values.algorithm,
        }
      );
      setResults(response.data.data);
    } catch (error) {
      console.error('Error optimizing yard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>📦 Container Yard Optimization</h2>

      <Card style={{ marginBottom: 20 }}>
        <Alert
          message="Yard Stacking Optimization (stackAI)"
          description="Optimize container positions in yard to minimize re-handling (shifters) and increase productivity by 15-20%."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <Form form={form} layout="vertical" onFinish={handleOptimize}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Form.Item
              label="Number of Containers"
              name="containerCount"
              rules={[{ required: true }]}
            >
              <InputNumber placeholder="e.g., 500" min={0} max={5000} />
            </Form.Item>

            <Form.Item
              label="Optimization Algorithm"
              name="algorithm"
              initialValue="greedy"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: '⚡ Greedy (Fast)', value: 'greedy' },
                  { label: '🧬 Genetic (Advanced)', value: 'genetic' },
                  { label: '🤖 AI Model (Best)', value: 'ai' },
                ]}
              />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" size="large" loading={loading}>
            🔄 Optimize Stacking
          </Button>
        </Form>
      </Card>

      {results && (
        <Card title="📈 Optimization Results">
          <Spin spinning={loading}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              <div style={{ padding: 20, border: '1px solid #eee', borderRadius: 4 }}>
                <h3>📊 Shifters Reduction</h3>
                <p style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                  {results.shiftersReduction}%
                </p>
                <Progress percent={results.shiftersReduction} strokeColor="#52c41a" />
                <p style={{ color: '#999', marginTop: 10 }}>↓ Fewer container re-handling</p>
              </div>

              <div style={{ padding: 20, border: '1px solid #eee', borderRadius: 4 }}>
                <h3>⚡ Productivity Gain</h3>
                <p style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                  {results.productivityGain}%
                </p>
                <Progress percent={results.productivityGain} strokeColor="#1890ff" />
                <p style={{ color: '#999', marginTop: 10 }}>↑ Higher crane efficiency</p>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h4>📍 Optimized Container Positions: {results.positions?.length || 0} containers</h4>
              <Table
                dataSource={results.positions?.slice(0, 10)}
                columns={[
                  {
                    title: 'Container',
                    dataIndex: 'containerNumber',
                    key: 'containerNumber',
                  },
                  {
                    title: 'Block',
                    dataIndex: 'blockId',
                    key: 'blockId',
                  },
                  {
                    title: 'Priority',
                    dataIndex: 'priority',
                    key: 'priority',
                  },
                ]}
                pagination={false}
                size="small"
              />
            </div>
          </Spin>
        </Card>
      )}
    </div>
  );
};

export default YardOptimization;
