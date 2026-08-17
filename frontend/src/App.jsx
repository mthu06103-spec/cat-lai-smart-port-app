import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import Dashboard from './pages/Dashboard';
import PortVisualization3D from './pages/PortVisualization3D';
import BerthOptimization from './pages/BerthOptimization';
import YardOptimization from './pages/YardOptimization';
import Analytics from './pages/Analytics';
import Simulations from './pages/Simulations';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="dark"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="logo" style={{ height: 64, padding: '20px', textAlign: 'center', color: 'white' }}>
            <h2>🏭 Cát Lái</h2>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">📊 Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/visualization">🌐 3D Visualization</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/berth-optimization">⚓ Berth Planning</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/yard-optimization">📦 Yard Planning</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/analytics">📈 Analytics</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/simulations">🔬 Simulations</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header style={{ background: '#fff', padding: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '0 20px', height: 64, display: 'flex', alignItems: 'center' }}>
              <h1 style={{ margin: 0 }}>🚢 Digital Twin - Tân Cảng Cát Lái</h1>
            </div>
          </Header>

          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route path="/" element={<Dashboard socket={socket} />} />
              <Route path="/visualization" element={<PortVisualization3D socket={socket} />} />
              <Route path="/berth-optimization" element={<BerthOptimization socket={socket} />} />
              <Route path="/yard-optimization" element={<YardOptimization socket={socket} />} />
              <Route path="/analytics" element={<Analytics socket={socket} />} />
              <Route path="/simulations" element={<Simulations socket={socket} />} />
            </Routes>
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            Digital Twin © 2024 | Tân Cảng Cát Lái Smart Port Solution
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
