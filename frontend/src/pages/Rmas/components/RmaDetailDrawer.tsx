import { useState } from 'react'
import {
  App,
  Button,
  Descriptions,
  Drawer,
  Empty,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { TableColumnsType } from 'antd'
import {
  CheckCircleOutlined,
  DropboxOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import type { RmaDetailDto, RmaDto } from '../../../types/rma'
import {
  DISPOSITION_COLOR,
  DISPOSITION_LABEL,
  PRODUCT_CONDITION_COLOR,
  PRODUCT_CONDITION_LABEL,
  RMA_STATUS_COLOR,
  RMA_STATUS_LABEL,
} from '../../../lib/statusMaps'
import { formatDateTime } from '../../../lib/date'
import {
  useApproveRma,
  useCompleteRma,
  useReceiveRma,
} from '../../../hooks/useRmas'
import { InspectRmaModal } from './InspectRmaModal'
import { useAuthContext } from '../../../contexts/useAuthContext'
import { getErrorMessage } from '../../../lib/errorHandler'

interface RmaDetailDrawerProps {
  rma: RmaDto | null
  onClose: () => void
}

export function RmaDetailDrawer({ rma, onClose }: RmaDetailDrawerProps) {
  const { message } = App.useApp()
  const { user } = useAuthContext()
  const canManage = user?.role === 'Admin' || user?.role === 'WarehouseManager'
  const isStaff = user?.role === 'WarehouseStaff'

  const approveMutation = useApproveRma()
  const receiveMutation = useReceiveRma()
  const completeMutation = useCompleteRma()

  const [inspectOpen, setInspectOpen] = useState(false)

  const handleApprove = () => {
    if (!rma) return
    Modal.confirm({
      title: 'Duyệt yêu cầu đổi trả',
      content: `Xác nhận duyệt yêu cầu đổi trả "${rma.rmaCode}"?`,
      okText: 'Duyệt',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await approveMutation.mutateAsync(rma.id)
          message.success('Đã duyệt yêu cầu đổi trả.')
        } catch (err) {
          message.error(getErrorMessage(err, 'Duyệt yêu cầu thất bại.'))
        }
      },
    })
  }

  const handleReceive = () => {
    if (!rma) return
    Modal.confirm({
      title: 'Xác nhận nhận hàng trả',
      content: `Kho đã nhận được kiện hàng cho phiếu "${rma.rmaCode}"?`,
      okText: 'Xác nhận nhận hàng',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await receiveMutation.mutateAsync(rma.id)
          message.success('Đã chuyển trạng thái sang Đã nhận hàng.')
        } catch (err) {
          message.error(getErrorMessage(err, 'Cập nhật nhận hàng thất bại.'))
        }
      },
    })
  }

  const handleComplete = () => {
    if (!rma) return
    Modal.confirm({
      title: 'Hoàn tất phiếu đổi trả',
      content:
        'Hệ thống sẽ hoàn tất phiếu và tự động nhập lại số lượng tồn kho cho các sản phẩm nguyên vẹn (Restock). Tiếp tục?',
      okText: 'Hoàn tất & Nhập kho',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await completeMutation.mutateAsync(rma.id)
          message.success('Đã hoàn tất phiếu đổi trả và hoàn kho thành công.')
        } catch (err) {
          message.error(getErrorMessage(err, 'Hoàn tất phiếu thất bại.'))
        }
      },
    })
  }

  const columns: TableColumnsType<RmaDetailDto> = [
    {
      title: 'SKU',
      dataIndex: 'productSku',
      width: 140,
      render: (sku: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>
          {sku}
        </Tag>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      render: (name: string) => <span style={{ fontWeight: 600 }}>{name}</span>,
    },
    {
      title: 'SL trả',
      dataIndex: 'quantity',
      width: 90,
      align: 'right',
      render: (qty: number) => <span style={{ fontWeight: 600 }}>{qty}</span>,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'condition',
      width: 130,
      render: (c) => (
        <Tag color={PRODUCT_CONDITION_COLOR[String(c)] ?? 'default'}>
          {PRODUCT_CONDITION_LABEL[String(c)] ?? String(c)}
        </Tag>
      ),
    },
    {
      title: 'Hướng xử lý',
      dataIndex: 'disposition',
      width: 150,
      render: (d) => (
        <Tag color={DISPOSITION_COLOR[String(d)] ?? 'default'}>
          {DISPOSITION_LABEL[String(d)] ?? String(d)}
        </Tag>
      ),
    },
  ]

  const statusStr = rma ? String(rma.status) : ''

  return (
    <>
      <Drawer
        title={
          rma ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Chi tiết phiếu đổi trả</span>
              <Tag color="blue" style={{ fontFamily: 'monospace' }}>
                {rma.rmaCode}
              </Tag>
            </div>
          ) : (
            'Chi tiết phiếu đổi trả'
          )
        }
        open={!!rma}
        onClose={onClose}
        width={720}
        styles={{ body: { padding: '20px 24px' } }}
        extra={
          rma && (
            <Space>
              {(statusStr === 'Requested' || statusStr === '0') && canManage && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={approveMutation.isPending}
                  onClick={handleApprove}
                >
                  Duyệt yêu cầu
                </Button>
              )}
              {(statusStr === 'Approved' || statusStr === '1') && (canManage || isStaff) && (
                <Button
                  type="primary"
                  icon={<InboxOutlined />}
                  loading={receiveMutation.isPending}
                  onClick={handleReceive}
                >
                  Nhận hàng
                </Button>
              )}
              {(statusStr === 'Received' ||
                statusStr === '2' ||
                statusStr === 'Inspected' ||
                statusStr === '3') && (
                <Button
                  icon={<SafetyCertificateOutlined />}
                  onClick={() => setInspectOpen(true)}
                >
                  {statusStr === 'Received' || statusStr === '2'
                    ? 'Kiểm tra sản phẩm'
                    : 'Cập nhật kiểm tra'}
                </Button>
              )}
              {(statusStr === 'Inspected' || statusStr === '3') && canManage && (
                <Button
                  type="primary"
                  icon={<DropboxOutlined />}
                  style={{ backgroundColor: '#52c41a' }}
                  loading={completeMutation.isPending}
                  onClick={handleComplete}
                >
                  Hoàn tất & Nhập kho
                </Button>
              )}
            </Space>
          )
        }
      >
        {rma ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Descriptions
              bordered
              size="small"
              column={2}
              items={[
                {
                  key: 'rmaCode',
                  label: 'Mã phiếu',
                  children: (
                    <Tag color="blue" style={{ fontFamily: 'monospace' }}>
                      {rma.rmaCode}
                    </Tag>
                  ),
                },
                {
                  key: 'status',
                  label: 'Trạng thái',
                  children: (
                    <Tag color={RMA_STATUS_COLOR[statusStr] ?? 'default'}>
                      {RMA_STATUS_LABEL[statusStr] ?? statusStr}
                    </Tag>
                  ),
                },
                {
                  key: 'orderNo',
                  label: 'Đơn bán hàng',
                  children: (
                    <Tag color="purple" style={{ fontFamily: 'monospace' }}>
                      {rma.saleOrderNo ?? '—'}
                    </Tag>
                  ),
                },
                {
                  key: 'customerName',
                  label: 'Khách hàng',
                  children: rma.customerName ?? 'Khách lẻ',
                },
                {
                  key: 'warehouseName',
                  label: 'Kho hàng',
                  children: rma.warehouseName ?? 'Toàn hệ thống',
                },
                {
                  key: 'createdDate',
                  label: 'Ngày tạo',
                  children: formatDateTime(rma.createdDate),
                },
                {
                  key: 'reason',
                  label: 'Lý do đổi trả',
                  span: 2,
                  children: rma.reason || 'Không có lý do cụ thể',
                },
              ]}
            />

            <div>
              <Typography.Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>
                Danh sách sản phẩm đổi trả ({rma.details.length})
              </Typography.Text>
              <Table
                size="small"
                rowKey="id"
                columns={columns}
                dataSource={rma.details}
                pagination={false}
              />
            </div>
          </div>
        ) : (
          <Empty description="Không có dữ liệu phiếu đổi trả" />
        )}
      </Drawer>

      <InspectRmaModal
        rma={rma}
        open={inspectOpen}
        onClose={() => setInspectOpen(false)}
      />
    </>
  )
}
