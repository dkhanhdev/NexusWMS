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
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
  PlusOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { RmaDto } from '../../types/rma'
import { useDeleteRma, useRmas } from '../../hooks/useRmas'
import { useAuthContext } from '../../contexts/useAuthContext'
import { RMA_STATUS_COLOR, RMA_STATUS_LABEL } from '../../lib/statusMaps'
import { formatDateTime } from '../../lib/date'
import { getErrorMessage } from '../../lib/errorHandler'
import { CreateRmaModal } from './components/CreateRmaModal'
import { RmaDetailDrawer } from './components/RmaDetailDrawer'

function Rmas() {
  const { message } = App.useApp()
  const { user } = useAuthContext()
  const canManage = user?.role === 'Admin' || user?.role === 'WarehouseManager'

  const { data: rmas, isPending } = useRmas()
  const deleteMutation = useDeleteRma()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedRma, setSelectedRma] = useState<RmaDto | null>(null)

  const items = rmas ?? []

  // KPI stats
  const totalCount = items.length
  const requestedCount = items.filter((r) => String(r.status) === 'Requested' || String(r.status) === '0').length
  const receivedCount = items.filter((r) => String(r.status) === 'Received' || String(r.status) === '2').length
  const completedCount = items.filter((r) => String(r.status) === 'Completed' || String(r.status) === '4').length

  const filtered = items
    .sort((a, b) => dayjs(b.createdDate).valueOf() - dayjs(a.createdDate).valueOf())
    .filter((r) => {
      const keyword = search.trim().toLowerCase()
      const matchesKeyword =
        !keyword ||
        r.rmaCode.toLowerCase().includes(keyword) ||
        (r.saleOrderNo ?? '').toLowerCase().includes(keyword) ||
        (r.customerName ?? '').toLowerCase().includes(keyword)

      const statusStr = String(r.status)
      const matchesStatus =
        !statusFilter ||
        statusStr === statusFilter ||
        (statusFilter === 'Requested' && statusStr === '0') ||
        (statusFilter === 'Approved' && statusStr === '1') ||
        (statusFilter === 'Received' && statusStr === '2') ||
        (statusFilter === 'Inspected' && statusStr === '3') ||
        (statusFilter === 'Completed' && statusStr === '4')

      return matchesKeyword && matchesStatus
    })

  const handleDelete = (row: RmaDto) => {
    Modal.confirm({
      title: 'Xóa phiếu đổi trả',
      content: `Bạn chắc chắn muốn xóa phiếu đổi trả "${row.rmaCode}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(row.id)
          message.success('Đã xóa phiếu đổi trả.')
        } catch (err) {
          message.error(getErrorMessage(err, 'Xóa phiếu đổi trả thất bại.'))
        }
      },
    })
  }

  const columns: TableColumnsType<RmaDto> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'rmaCode',
      key: 'rmaCode',
      width: 150,
      render: (code: string, row) => (
        <Typography.Link
          style={{ fontFamily: 'monospace', fontWeight: 600 }}
          onClick={() => setSelectedRma(row)}
        >
          {code}
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
      title: 'Kho xử lý',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      render: (wh?: string) => (wh ? <Tag color="geekblue">{wh}</Tag> : <Tag>Toàn hệ thống</Tag>),
    },
    {
      title: 'Số mặt hàng',
      key: 'itemCount',
      width: 110,
      align: 'right',
      render: (_, row) => row.details?.length ?? 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => {
        const s = String(status)
        return <Tag color={RMA_STATUS_COLOR[s] ?? 'default'}>{RMA_STATUS_LABEL[s] ?? s}</Tag>
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      render: (d: string) => formatDateTime(d),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, row) => {
        const s = String(row.status)
        return (
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => setSelectedRma(row)}
              />
            </Tooltip>
            {(s === 'Requested' || s === '0') && user?.role === 'Admin' && (
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(row)}
                />
              </Tooltip>
            )}
          </div>
        )
      },
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
            <RollbackOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            Quản lý Đổi / Trả hàng (RMA)
          </Typography.Title>
          <Typography.Text type="secondary">
            Xử lý hàng khách hoàn trả, kiểm định chất lượng và hoàn kho tự động
          </Typography.Text>
        </div>

        {canManage && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Tạo phiếu đổi trả
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card size="small" variant="borderless" style={{ background: '#f5f5f5' }}>
            <Statistic
              title="Tổng phiếu RMA"
              value={totalCount}
              prefix={<RollbackOutlined style={{ color: '#1677ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" variant="borderless" style={{ background: '#fff7e6' }}>
            <Statistic
              title="Chờ duyệt"
              value={requestedCount}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" variant="borderless" style={{ background: '#e6f7ff' }}>
            <Statistic
              title="Đã nhận hàng"
              value={receivedCount}
              valueStyle={{ color: '#1890ff' }}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" variant="borderless" style={{ background: '#f6ffed' }}>
            <Statistic
              title="Đã hoàn thành"
              value={completedCount}
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
            placeholder="Tìm theo mã phiếu, mã đơn bán, khách hàng..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 320 }}
            allowClear
          />

          <Select
            placeholder="Trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 170 }}
            allowClear
            options={[
              { value: 'Requested', label: 'Chờ duyệt' },
              { value: 'Approved', label: 'Đã duyệt' },
              { value: 'Received', label: 'Đã nhận hàng' },
              { value: 'Inspected', label: 'Đã kiểm tra' },
              { value: 'Completed', label: 'Hoàn thành' },
            ]}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={isPending}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: <Empty description="Chưa có phiếu đổi trả hàng nào" /> }}
          onRow={(record) => ({
            onClick: () => setSelectedRma(record),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      <CreateRmaModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <RmaDetailDrawer
        rma={selectedRma}
        onClose={() => setSelectedRma(null)}
      />
    </div>
  )
}

export default Rmas
