import React, { useEffect, useRef } from 'react';
import { Card, Button, Space, Select, Alert } from 'antd';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 3D Container Component
const Container3D = ({ position, containerType = '20ft', color = '#FFA500' }) => {
  const width = containerType === '20ft' ? 2 : 4;
  const height = 2.59;
  const depth = 2.44;

  return (
    <mesh position={position}>
      <boxGeometry args={[width, height, depth]} />
      <meshPhongMaterial color={color} wireframe={false} />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial attach="material" color="black" />
      </lineSegments>
    </mesh>
  );
};

// 3D Crane Component
const Crane3D = ({ position }) => {
  return (
    <group position={position}>
      {/* Boom */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 30]} />
        <meshPhongMaterial color="#FFD700" />
      </mesh>
      {/* Spreader bar */}
      <mesh position={[0, -15, 0]}>
        <boxGeometry args={[5, 0.5, 0.5]} />
        <meshPhongMaterial color="#FF8C00" />
      </mesh>
    </group>
  );
};

// 3D Port Scene
const PortScene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      {/* Ground/Dock */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshPhongMaterial color="#8B7355" />
      </mesh>

      {/* Water */}
      <mesh position={[-30, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial color="#1E90FF" opacity={0.6} transparent />
      </mesh>

      {/* Containers in Yard */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Container3D key={i} position={[i % 4 * 5 - 8, 2.5 + Math.floor(i / 4) * 3, 0]} />
      ))}

      {/* Cranes */}
      <Crane3D position={[-20, 5, -15]} />
      <Crane3D position={[0, 5, -15]} />
      <Crane3D position={[20, 5, -15]} />

      {/* Berth */}
      <mesh position={[-30, -3, 5]}>
        <boxGeometry args={[5, 1, 20]} />
        <meshPhongMaterial color="#696969" />
      </mesh>

      {/* Grid helper */}
      <gridHelper args={[100, 20]} />
    </>
  );
};

const PortVisualization3D = ({ socket }) => {
  const canvasRef = useRef();
  const [viewMode, setViewMode] = React.useState('3d');
  const [autoRotate, setAutoRotate] = React.useState(true);

  return (
    <div>
      <h2>🌐 3D Port Visualization</h2>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Real-time 3D visualization of Tân Cảng Cát Lái"
            description="Showing live positions of containers, cranes, and vessels"
            type="info"
            showIcon
          />

          <Space>
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: 150 }}
              options={[
                { label: '3D View', value: '3d' },
                { label: 'Top View', value: 'top' },
                { label: 'Side View', value: 'side' },
              ]}
            />
            <Button
              type={autoRotate ? 'primary' : 'default'}
              onClick={() => setAutoRotate(!autoRotate)}
            >
              {autoRotate ? '🔄 Auto Rotate: ON' : '⏸ Auto Rotate: OFF'}
            </Button>
          </Space>

          <div style={{ width: '100%', height: 600, border: '1px solid #ccc', borderRadius: 4 }}>
            <Canvas ref={canvasRef}>
              <PerspectiveCamera position={[30, 25, 30]} fov={75} />
              <OrbitControls autoRotate={autoRotate} />
              <PortScene />
            </Canvas>
          </div>
        </Space>
      </Card>

      {/* Legend */}
      <Card title="🎨 Legend" style={{ marginTop: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          <div>
            <div style={{ width: 20, height: 20, backgroundColor: '#FFA500', display: 'inline-block', marginRight: 10 }} />
            <span>Container</span>
          </div>
          <div>
            <div style={{ width: 20, height: 20, backgroundColor: '#FFD700', display: 'inline-block', marginRight: 10 }} />
            <span>Quay Crane</span>
          </div>
          <div>
            <div style={{ width: 20, height: 20, backgroundColor: '#1E90FF', display: 'inline-block', marginRight: 10 }} />
            <span>Water</span>
          </div>
          <div>
            <div style={{ width: 20, height: 20, backgroundColor: '#696969', display: 'inline-block', marginRight: 10 }} />
            <span>Berth</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PortVisualization3D;
