import React, { useState } from 'react';
import { Card, Form, Button, Table, Space, InputNumber, Select, Modal, Alert, Spin, Progress, Tag } from 'antd';
import { PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const Simulations = ({ socket }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [results, setResults] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateSimulation = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/simulation/create`,
        {
          name: values.simulationName,
          description: values.description,
          parameters: {
            duration: values.duration * 3600000, // Convert hours to ms
            vesselCount: values.vesselCount,
            containerCount: values.containerCount,
            craneCount: values.craneCount,
          },
        }
      );
      setScenarios([...scenarios, response.data.data]);
      form.resetFields();
      alert('✅ Simulation created! Click "Run" to execute.');
    } catch (error) {
      alert('❌ Error creating simulation');
    }
  };

  const handleRunSimulation = async (simulationId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/simulation/${simulationId}/run`
      );
      setResults(response.data.data);
      setModalVisible(true);
    } catch (error) {
      alert('❌ Error running simulation');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Simulation Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        const colors = { created: 'blue', running: 'orange', completed: 'green', failed: 'red' };
        return <Tag color={colors[text]}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Vessels',
      dataIndex: ['parameters', 'vesselCount'],
      key: 'vessels',
    },
    {
      title: 'Containers',
      dataIndex: ['parameters', 'containerCount'],
      key: 'containers',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handleRunSimulation(record._id)}
            loading={loading}
          >
            Run
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>🔬 Discrete Event Simulation (DES) Laboratory</h2>

      <Card style={{ marginBottom: 20 }}>
        <Alert
          message="What-if Simulation Engine"
          description="Create and run port operation scenarios to test optimization strategies before real-world deployment."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <Form form={form} layout="vertical" onFinish={handleCreateSimulation}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Form.Item
              label="Simulation Name"
              name="simulationName"
              rules={[{ required: true }]}
            >
              <input type="text" placeholder="e.g., Peak Hour Scenario" style={{ width: '100%', padding: 8 }} />
            </Form.Item>

            <Form.Item
              label="Duration (hours)"
              name="duration"
              initialValue={8}
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={24} />
            </Form.Item>

            <Form.Item
              label="Number of Vessels"
              name="vesselCount"
              initialValue={5}
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={20} />
            </Form.Item>

            <Form.Item
              label="Total Containers"
              name="containerCount"
              initialValue={2000}
              rules={[{ required: true }]}
            >
              <InputNumber min={100} max={10000} />
            </Form.Item>

            <Form.Item
              label="Available Cranes"
              name="craneCount"
              initialValue={6}
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={15} />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" size="large">
            ➕ Create Simulation Scenario
          </Button>
        </Form>
      </Card>

      <Card title="📋 Saved Scenarios">
        <Table
          dataSource={scenarios}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      </Card>

      {/* Results Modal */}
      <Modal
        title="📊 Simulation Results"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Spin spinning={loading}>
          {results && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div>
                <h4>Vessels Processed</h4>
                <p style={{ fontSize: 24, fontWeight: 'bold' }}>{results.vesselsProcessed}</p>
              </div>
              <div>
                <h4>Containers Handled</h4>
                <p style={{ fontSize: 24, fontWeight: 'bold' }}>{results.containersHandled}</p>
              </div>
              <div>
                <h4>Total Moves</h4>
                <p style={{ fontSize: 24, fontWeight: 'bold' }}>{results.totalMoves}</p>
              </div>
              <div>
                <h4>Energy Consumption</h4>
                <p style={{ fontSize: 24, fontWeight: 'bold' }}>{results.totalEnergyConsumption}</p>
              </div>
              <div>
                <h4>Avg Turnaround Time</h4>
                <p style={{ fontSize: 24, fontWeight: 'bold' }}>{results.averageTurnaroundTime}</p>
              </div>
              <div>
                <h4>Total Simulation Time</h4>
                <p style={{ fontSize: 24, fontWeight: 'bold' }}>{results.totalSimulationTime}</p>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default Simulations;
