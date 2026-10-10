import { useState } from 'react'
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Modal,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import type { TableColumnsType } from 'antd'
import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ShipmentDto } from '../../types/shipment'
import { useMarkShipped, useShipments } from '../../hooks/useShipments'
import { useAuthContext } from '../../contexts/useAuthContext'
import { formatDateTime } from '../../lib/date'
import { getErrorMessage } from '../../lib/errorHandler'
import { CreateShipmentModal } from './components/CreateShipmentModal'
import { ShippingLabelModal } from './components/ShippingLabelModal'

function Shipments() {
  const { message } = App.useApp()
  const { user } = useAuthContext()
  const canManage = user?.role === 'Admin' || user?.role === 'WarehouseManager'

  const { data: shipments, isPending } = useShipments()
  const markShippedMutation = useMarkShipped()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Delivering' | 'Delivered'>('All')
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDto | null>(null)

  const items = shipments ?? []

  // KPI Statistics
  const totalCount = items.length
  const deliveredCount = items.filter((s) => !!s.shippedDate).length
  const deliveringCount = items.filter((s) => !s.shippedDate).length

  const filtered = items
    .sort((a, b) => dayjs(b.createdDate).valueOf() - dayjs(a.createdDate).valueOf())
    .filter((s) => {
      const keyword = search.trim().toLowerCase()
      const matchesKeyword =
        !keyword ||
        (s.trackingNo ?? '').toLowerCase().includes(keyword) ||
        (s.saleOrderNo ?? '').toLowerCase().includes(keyword) ||
        (s.customerName ?? '').toLowerCase().includes(keyword) ||
        (s.carrier ?? '').toLowerCase().includes(keyword)

      const isDelivered = !!s.shippedDate
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Delivered' && isDelivered) ||
        (statusFilter === 'Delivering' && !isDelivered)

      return matchesKeyword && matchesStatus
    })

  const handleMarkShipped = (row: ShipmentDto) => {
    Modal.confirm({
      title: 'Xác nhận giao hàng',
      content: `Xác nhận kiện hàng "${row.trackingNo ?? row.saleOrderNo}" đã được giao thành công cho khách hàng?`,
      okText: 'Đã giao',
      cancelText: 'Hủy',
      okButtonProps: { style: { backgroundColor: '#52c41a' } },
      onOk: async () => {
        try {
          await markShippedMutation.mutateAsync(row.id)
          message.success('Đã cập nhật trạng thái đơn sang Đã giao.')
        } catch (err) {
          message.error(getErrorMessage(err, 'Cập nhật giao hàng thất bại.'))
        }
      },
    })
  }

  const columns: TableColumnsType<ShipmentDto> = [
    {
      title: 'Mã vận đơn (Tracking)',
      dataIndex: 'trackingNo',
      key: 'trackingNo',
      width: 170,
      render: (tracking: string, row) => (
        <Typography.Link
          style={{ fontFamily: 'monospace', fontWeight: 600 }}
          onClick={() => setSelectedShipment(row)}
        >
          {tracking || '—'}
        </Typography.Link>
      ),
    },
    {
      title: 'Đơn bán hàng',
      dataIndex: 'saleOrderNo',
      key: 'saleOrderNo',
      width: 140,
      render: (orderNo?: string) =>
        orderNo ? (
          <Tag color="purple" style={{ fontFamily: 'monospace' }}>
            {orderNo}
          </Tag>
        ) : (
          '—'
        ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name?: string) => name ?? 'Khách lẻ',
    },
    {
      title: 'Kho xuất hàng',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      render: (wh?: string) => (wh ? <Tag color="geekblue">{wh}</Tag> : <Tag>Toàn hệ thống</Tag>),
    },
    {
      title: 'Đơn vị vận chuyển',
      dataIndex: 'carrier',
      key: 'carrier',
      width: 180,
      render: (c?: string) => (
        <Tag color="blue" icon={<CarOutlined />}>
          {c || 'Nội bộ'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 140,
      render: (_, row) =>
        row.shippedDate ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Đã giao hàng
          </Tag>
        ) : (
          <Tag color="orange" icon={<ClockCircleOutlined />}>
            Đang vận chuyển
          </Tag>
        ),
    },
    {
      title: 'Ngày tạo phiếu',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      render: (d: string) => formatDateTime(d),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 130,
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <Tooltip title="In vận đơn & Phiếu đóng gói">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              onClick={() => setSelectedShipment(row)}
            />
          </Tooltip>
          {!row.shippedDate && canManage && (
            <Tooltip title="Đánh dấu đã giao thành công">
              <Button
                type="text"
                style={{ color: '#52c41a' }}
                icon={<SendOutlined />}
                loading={markShippedMutation.isPending}
                onClick={() => handleMarkShipped(row)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tiêu đề & Nút thêm */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            <CarOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            Quản lý Vận chuyển & Giao hàng (Shipments Hub)
          </Typography.Title>
          <Typography.Text type="secondary">
            Theo dõi mã vận đơn, in phiếu xuất kho, in tem nhãn giao vận và trạng thái vận chuyển
          </Typography.Text>
        </div>

        {canManage && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Tạo phiếu vận chuyển
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small" variant="borderless" style={{ background: '#f5f5f5' }}>
            <Statistic
              title="Tổng phiếu vận chuyển"
              value={totalCount}
              prefix={<CarOutlined style={{ color: '#1677ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card size="small" variant="borderless" style={{ background: '#fff7e6' }}>
            <Statistic
              title="Đang vận chuyển"
              value={deliveringCount}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card size="small" variant="borderless" style={{ background: '#f6ffed' }}>
            <Statistic
              title="Đã giao thành công"
              value={deliveredCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc & Bảng danh sách */}
      <Card variant="borderless">
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Input
            placeholder="Tìm theo mã vận đơn, mã đơn bán, khách hàng, hãng xe..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 340 }}
            allowClear
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 170 }}
            options={[
              { value: 'All', label: 'Tất cả trạng thái' },
              { value: 'Delivering', label: 'Đang vận chuyển' },
              { value: 'Delivered', label: 'Đã giao thành công' },
            ]}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={isPending}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: <Empty description="Chưa có phiếu vận chuyển nào" /> }}
          onRow={(record) => ({
            onClick: () => setSelectedShipment(record),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      <CreateShipmentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        existingShipments={items}
      />

      <ShippingLabelModal
        shipment={selectedShipment}
        open={!!selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />
    </div>
  )
}

export default Shipments
