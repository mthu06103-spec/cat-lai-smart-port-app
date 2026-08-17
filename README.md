# 🏭 Digital Twin - Tân Cảng Cát Lái Smart Port App

**Ứng dụng Web-App Bản soa số (Digital Twin) tích hợp AI cho mô phỏng và tối ưu hóa hoạt động khai thác tại Tân Cảng Cát Lái**

![Status](https://img.shields.io/badge/Status-Development-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

---

## 📋 Mục tiêu Dự án

Xây dựng nền tảng Bản soa số tích hợp AI để:
- ✅ **Mô phỏng kịch bản "What-if"** (Berth Planning & Yard Optimization)
- ✅ **Trực quan hóa 3D động** vị trí container, cẩu bằng Three.js
- ✅ **Giám sát KPI thời gian thực** (Turnaround Time, Productivity, Power Consumption)
- ✅ **Dự báo mỏi kết cấu cầu** (LiDAR + IoT sensors, độ chính xác <5%)
- ✅ **Dự đoán xói mòn móng cảng** (AI Hydrodynamics, 92% accuracy)
- ✅ **Kết nối API tích hợp** TOPX, ePort, và telemetry 5G real-time

---

## 🏗️ Kiến trúc Hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend Layer (React + Three.js)                           │
│  - Dashboard KPI | 3D Port Visualization | Simulation Panel  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend Layer (Node.js/Express + WebSocket)                 │
│  - REST API | DES Simulation Engine | Real-time Events       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Services Layer                                              │
│  - Berth Optimization | Yard Optimization                    │
│  - Structural Analytics | Hydrodynamic Prediction            │
│  - TOPX/ePort Integration | 5G Telemetry Handler             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Database Layer (MongoDB)                                     │
│  - Containers | Berths | Vessels | Equipment | Analytics     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc Thư mục

```
cat-lai-smart-port-app/
├── frontend/                    # React UI Application
├── backend/                     # Node.js API Server
├── database/                    # MongoDB Schemas & Models
├── docker-compose.yml           # Docker Compose Configuration
├── README.md                    # This file
└── .gitignore
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js 18+
- MongoDB 5.0+
- Docker & Docker Compose
- npm hoặc yarn

### Bước 1: Clone Repository
```bash
git clone https://github.com/mthu06103-spec/cat-lai-smart-port-app.git
cd cat-lai-smart-port-app
```

### Bước 2: Cấu hình Environment
```bash
# Backend
cd backend
cp .env.example .env
# Cập nhật các giá trị cần thiết

# Frontend
cd ../frontend
cp .env.example .env
```

### Bước 3: Cài đặt Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Bước 4: Chạy với Docker Compose
```bash
cd ..
docker-compose up -d
```

### Bước 5: Truy cập Ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017/cat-lai-port

---

## 📊 Các Tính năng Chính

### A. Mô phỏng Kịch bản "What-if"

#### 1. **Berth Allocation Optimization**
- Tự động phân bổ cầu tàu khi tàu cập cảng lệch múi giờ
- Tính toán số lượng cẩu bờ tối ưu
- Giảm 51% thời gian dịch vụ tàu

#### 2. **Container Yard Optimization**
- Mô phỏng xếp chồng container bằng stackAI
- Giảm thiểu số lần đảo chuyển (shifters)
- Tăng 15-20% năng suất bốc xếp

### B. Trực quan hóa 3D & Dashboard KPI

**3D Port Visualization:**
- Hiển thị bãi container 360° từ góc nhìn thực tế
- Vị trí tàu, cẩu bờ, RTG, xe đầu kéo real-time
- Hệ thống cảnh báo va chạm

**KPI Dashboard:**
- Turnaround Time (TTT)
- Crane Productivity (moves/hour)
- Power Consumption (kWh)
- Container Positioning Accuracy
- Safety Incidents

### C. Phân tích & Dự báo Chuyên sâu

#### Structural Fatigue Prediction
- Tích hợp LiDAR 3D (độ chính xác 2mm) + IoT strain gauge (100 Hz)
- Dự báo mỏi cầu với sai số < 5%
- Cảnh báo trước 40% thời gian ngừng hoạt động

#### Hydrodynamic Erosion Forecasting
- Dữ liệu sóng, dòng chảy từ smart buoys
- Cập nhật mỗi 15 phút
- Độ chính xác dự báo xói mòn: 92%

### D. Kết nối API & Real-time Telemetry

- **TOPX Integration**: Đồng bộ lệnh nâng hạ, vị trí container
- **ePort Integration**: Lệnh giao hàng điện tử (>15,000 lệnh/ngày)
- **5G Telemetry**: Độ trễ <10ms, độ chính xác ±5cm (OPC-UA)
- **WebSocket**: Cập nhật telemetry real-time

---

## 🔧 API Endpoints

### Berth Operations
```
POST   /api/berth/optimize         # Optimize berth allocation
GET    /api/berth/schedule         # Get berth schedule
GET    /api/berth/:berthId/status  # Get berth status
```

### Yard Operations
```
POST   /api/yard/optimize          # Optimize container stacking
GET    /api/yard/blocks            # Get yard block info
PUT    /api/yard/container/:id     # Update container position
```

### Analytics
```
GET    /api/analytics/kpi          # Get KPI metrics
GET    /api/analytics/fatigue      # Get structural fatigue data
GET    /api/analytics/erosion      # Get erosion forecast
```

### Real-time
```
WS     /ws/telemetry              # WebSocket telemetry stream
WS     /ws/notifications          # WebSocket alerts & notifications
```

---

## 📈 Kết quả Dự kiến

| Chỉ số | Cải thiện | Nguồn tham chiếu |
|-------|---------|------------------|
| Thời gian tàu nằm bến | -51% | El-Dekheilla (2023) |
| Năng suất bốc xếp | +15-20% | Hamburg Port Study |
| Thời gian ngừng hoạt động | -40% | LiDAR monitoring |
| Phát thải CO₂ | -28% | Hyper-optimization |
| Tai nạn lao động | -30% | Real-time visualization |
| Xói mòn móng - độ chính xác | 92% | AI Hydrodynamics |

---

## 🛠️ Công nghệ Sử dụng

### Frontend
- React 18
- Three.js / Babylon.js (3D visualization)
- Redux (State management)
- Axios (HTTP client)
- Socket.IO (Real-time)
- Tailwind CSS (Styling)

### Backend
- Node.js / Express.js
- Socket.IO (WebSocket)
- MongoDB + Mongoose
- FlexSim CT SDK (DES engine)
- TensorFlow.js (AI inference)
- Bull (Job queue)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- PM2 (Process management)

---

## 📚 Tài liệu

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [System Architecture](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [DES Simulation Guide](./docs/DES_GUIDE.md)

---

## 👥 Đội ngũ

- **Tác giả**: mthu06103-spec
- **Dự án**: Đề cương Digital Twin & AI cho Tân Cảng Cát Lái
- **Năm**: 2024-2025

---

## 📝 Ghi chú & Hướng phát triển

### Phase 1 (Hiện tại)
- ✅ Cấu trúc project & setup
- ✅ Frontend UI components
- ✅ Backend API framework
- ⏳ DES simulation engine

### Phase 2 (Sắp tới)
- 🔜 Tích hợp TOPX/ePort API thực tế
- 🔜 LiDAR + IoT sensor integration
- 🔜 ML models cho structural fatigue
- 🔜 Hydrodynamic simulation

### Phase 3 (Lâu dài)
- 📅 5G telemetry real-time
- 📅 Advanced optimization algorithms
- 📅 Mobile app (iOS/Android)
- 📅 Multi-port integration

---

## 📄 License

MIT License - xem [LICENSE](LICENSE) file

---

## 📞 Liên hệ & Support

- 📧 Email: contact@cat-lai-port.vn
- 🐛 Issues: https://github.com/mthu06103-spec/cat-lai-smart-port-app/issues
- 💬 Discussions: https://github.com/mthu06103-spec/cat-lai-smart-port-app/discussions

---

**Xây dựng cảng biển thông minh bền vững cho Việt Nam! 🚢💡**
