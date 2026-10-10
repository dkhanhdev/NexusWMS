# Nexus WMS - Warehouse Management System

## Giới thiệu

**Nexus WMS** là hệ thống quản lý kho hàng hiện đại, thông minh và toàn diện. Hệ thống chuẩn hóa luồng vận hành logistics: từ quản lý nhà cung cấp, đơn mua hàng (Purchase Order), nhận hàng, cất hàng vào vị trí (Put-away), kiểm soát tồn kho đa kho & đa vị trí, đến đơn bán hàng, phân công lấy hàng (Picking), đóng gói xuất kho (Shipment) và quản lý hàng trả lại (RMA).

## Tính năng nổi bật

- **Phân quyền và bảo mật (RBAC & Multi-tenant)**: Hỗ trợ các vai trò `Admin`, `WarehouseManager`, `WarehouseStaff` cùng cơ chế cách ly tenant cho mô hình SaaS B2B.
- **Quản lý người dùng**: Quản lý hồ sơ, cập nhật avatar, khóa/mở khóa tài khoản, cấp lại mật khẩu và phân công kho quản lý.
- **Dữ liệu danh mục & kho bãi**: Quản lý nhà cung cấp, khách hàng, sản phẩm, hình ảnh sản phẩm đa tầng, kho hàng và cấu trúc vị trí (Aisle - Rack - Shelf - Bin).
- **Luồng Nhập hàng (Inbound)**:
  - Tạo, duyệt, đóng đơn mua hàng (Purchase Order).
  - Tiếp nhận hàng (Receiving), đối soát số lượng thực tế, đính kèm chứng từ hóa đơn và sinh tác vụ cất hàng.
  - Phân công nhân viên cất hàng (Put-away), tự động cập nhật sức chứa vị trí và số lượng tồn kho.
- **Kiểm soát Tồn kho (Inventory)**:
  - Báo cáo tồn kho theo thời gian thực theo từng kho, vị trí và SKU.
  - Điều chỉnh tồn kho (Stock Adjustment), điều chuyển kho (Stock Transfer).
  - Lịch sử biến động tồn kho (Stock Movement) và Audit log hệ thống chi tiết.
- **Luồng Xuất hàng & Logistics (Outbound)**:
  - Tiếp nhận đơn bán (Sale Order), sinh phiếu lấy hàng (Picking) tự động theo chiến lược FEFO/FIFO.
  - Xử lý đơn vận chuyển (Shipment), in vận đơn và nhãn mã vạch (Shipping Label).
  - Quy trình quản lý đổi/trả hàng (RMA - Return Merchandise Authorization).
- **Trợ lý kho AI**: Tích hợp mô hình AI Gemini phân tích và hỗ trợ ra quyết định tồn kho thông minh.

## Công nghệ sử dụng

| Phân hệ | Công nghệ |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, Ant Design, TanStack Query, Axios |
| **Backend** | .NET 8 (ASP.NET Core Web API), Entity Framework Core, ASP.NET Identity, JWT |
| **Kiến trúc** | Clean Architecture (Domain, Application, Infrastructure, API) |
| **Cơ sở dữ liệu** | Microsoft SQL Server |
| **Lưu trữ đa phương tiện** | Cloudinary |
| **Tài liệu API** | Swagger / OpenAPI |
| **Container & CI** | Docker, Docker Compose, GitHub Actions |

## Kiến trúc hệ thống

Backend được tổ chức chặt chẽ theo nguyên lý Clean Architecture. Luồng phụ thuộc đi từ ngoài vào trong; lớp Domain là trung tâm và hoàn toàn độc lập với framework, database hay dịch vụ bên ngoài.

```text
                        +---------------------------+
                        |      NexusWMS.Domain      |
                        |    Entity, Enum, Model    |
                        +-------------^-------------+
                                      |
                        +-------------+-------------+
                        |   NexusWMS.Application    |
                        |   Use Case, DTO, Service  |
                        |     Repository Interfaces |
                        +-------------^-------------+
                                      |
               +----------------------+----------------------+
               |                                             |
+--------------+--------------+               +--------------+--------------+
|   NexusWMS.Infrastructure   |               |        NexusWMS.API         |
| EF Core, DbContext, Repos,  |               | Controllers, Middleware,    |
| Identity, SQL Server, JWT,  |               | Swagger, DI, Auth Guards    |
| Cloudinary, AI Integration  |               +--------------+--------------+
+--------------+--------------+                              |
               |                                             |
               v                                             v
        SQL Server / Cloudinary                        React Frontend
```

### 1. NexusWMS.Domain
Lớp trung tâm định nghĩa các Entity nghiệp vụ (`Product`, `Warehouse`, `Location`, `Stock`, `PurchaseOrder`, `Receiving`, `Picking`, `Shipment`, `Rma`), các Enum trạng thái và quy tắc ràng buộc logic kho.

### 2. NexusWMS.Application
Chứa các Use Cases, DTOs, Mappings (AutoMapper), Validators (FluentValidation) và Service / Repository interfaces. Không phụ thuộc vào chi tiết cài đặt hạ tầng.

### 3. NexusWMS.Infrastructure
Triển khai kỹ thuật cho các interface ở Application: `WmsDbContext`, EF Core Migrations, SQL Server Repositories, Identity, JWT Token Provider, Cloudinary Image Service và AI Provider.

### 4. NexusWMS.API
Điểm đón nhận HTTP Request, áp dụng xác thực JWT, phân quyền RBAC, định tuyến Middleware, Swagger API documentation và CORS.

### 5. Frontend
Giao diện người dùng xây dựng bằng React 19 + TypeScript + Ant Design, kết nối API backend qua Axios Client và cache trạng thái với TanStack Query.

## Cấu trúc thư mục

```text
Nexus-WMS/
├── frontend/                                # React 19 + Vite Frontend
│   ├── src/components/                      # UI Components dùng chung (Logo, Layout, v.v.)
│   ├── src/pages/                           # Màn hình chức năng (Dashboard, Inbound, Outbound, RMA, v.v.)
│   ├── src/services/                        # Axios API Client services
│   ├── src/hooks/                           # React Query hooks
│   └── src/router/                          # Định tuyến và phân quyền RBAC
│
├── backend/
│   ├── Dockerfile                           # Dockerfile build & publish backend API
│   └── NexusWMS/                            # Giải pháp Backend .NET 8
│       ├── NexusWMS.sln                     # Visual Studio Solution
│       ├── src/NexusWMS.API/                # RESTful API Controllers & Startup
│       ├── src/NexusWMS.Application/        # Services, Interfaces, DTOs & Validation
│       ├── src/NexusWMS.Domain/             # Entities, Enums, Models
│       ├── src/NexusWMS.Infrastructure/     # DbContext, Migrations, Repositories
│       └── tests/NexusWMS.UnitTests/        # Bộ kiểm thử đơn vị xUnit
│
├── docs/                                    # Tài liệu kiểm thử & scenarios
├── docker-compose.yml                       # Khởi chạy toàn bộ hệ thống bằng Docker
└── start-dev.ps1                            # Script PowerShell khởi chạy dev một chạm
```

## Yêu cầu môi trường

- **Node.js**: 20 trở lên
- **.NET SDK**: 8.0 trở lên
- **SQL Server** hoặc **SQL Server LocalDB** (hoặc chạy qua Docker)
- **Cloudinary account** (tùy chọn - để upload ảnh)

## Cài đặt và khởi chạy dự án

### Cách 1: Khởi động tự động bằng Script (Khuyên dùng cho Dev)

Chạy script tự động mở 2 cửa sổ chạy song song backend và frontend:

```powershell
.\start-dev.ps1
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5246](http://localhost:5246)
- **Swagger UI**: [http://localhost:5246/swagger](http://localhost:5246/swagger)

---

### Cách 2: Khởi động thủ công

#### 1. Khởi động Backend:
```powershell
# Sao chép cấu hình môi trường mẫu nếu chưa có
Copy-Item backend/NexusWMS/src/NexusWMS.API/appsettings.Development.example.json backend/NexusWMS/src/NexusWMS.API/appsettings.Development.json

cd backend/NexusWMS
dotnet restore NexusWMS.sln
dotnet run --project src/NexusWMS.API
```

#### 2. Khởi động Frontend:
```powershell
cd frontend
npm install
npm run dev
```

---

### Cách 3: Khởi động bằng Docker Compose

```powershell
# Chuẩn bị file cấu hình môi trường
Copy-Item .env.example .env

# Chạy Docker Compose
docker compose up -d
```

Frontend chạy tại cổng `http://localhost:8081`, tự động proxy `/api` về backend container.

## Kiểm tra mã nguồn & Tests

```powershell
# Frontend lint & tests
cd frontend
npm run lint
npm run test
npm run build

# Backend build & unit tests
cd ../backend/NexusWMS
dotnet build NexusWMS.sln
dotnet test NexusWMS.sln
```

## Nhóm API chính

| Phân hệ | Endpoint | Mô tả |
| --- | --- | --- |
| **Xác thực** | `/api/Auth` | Đăng nhập, đăng ký, refresh token, đổi mật khẩu |
| **Người dùng** | `/api/Users` | Quản lý người dùng, phân quyền, phân công kho |
| **Hàng hóa** | `/api/Products`, `/api/Categories` | Quản lý danh mục, sản phẩm, quy cách đóng gói |
| **Kho bãi** | `/api/Warehouses`, `/api/Locations` | Quản lý nhà kho, layout vị trí (Rack, Shelf, Bin) |
| **Nhập kho** | `/api/PurchaseOrders`, `/api/Receivings`, `/api/PutAwayTasks` | Đơn mua, nhận hàng, nhiệm vụ cất hàng |
| **Tồn kho** | `/api/Stocks`, `/api/StockAdjustments`, `/api/StockMovements` | Quản lý số lượng tồn, kiểm kê, biến động tồn |
| **Xuất kho** | `/api/SaleOrders`, `/api/Pickings`, `/api/Shipments` | Đơn bán, lấy hàng theo lô/hạn dùng, vận chuyển |
| **Trả hàng** | `/api/Rmas` | Đơn yêu cầu đổi trả, kiểm định và nhập lại kho |
| **Nhật ký** | `/api/AuditLogs` | Lịch sử thao tác nghiệp vụ và bảo mật |
