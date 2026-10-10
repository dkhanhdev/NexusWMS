import { useState } from 'react'
import {
  App,
  Modal,
  Select,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { TableColumnsType } from 'antd'
import type {
  Disposition,
  InspectRmaItemDto,
  ProductCondition,
  RmaDetailDto,
  RmaDto,
} from '../../../types/rma'
import { useInspectRma } from '../../../hooks/useRmas'
import { getErrorMessage } from '../../../lib/errorHandler'

interface InspectRmaModalProps {
  rma: RmaDto | null
  open: boolean
  onClose: () => void
}

interface InspectRowState {
  detailId: string
  productSku: string
  productName: string
  quantity: number
  condition: ProductCondition
  disposition: Disposition
}

function InspectContent({ rma, open, onClose }: { rma: RmaDto; open: boolean; onClose: () => void }) {
  const { message } = App.useApp()
  const inspectMutation = useInspectRma()

  const [items, setItems] = useState<InspectRowState[]>(() =>
    rma.details.map((d: RmaDetailDto) => ({
      detailId: d.id,
      productSku: d.productSku,
      productName: d.productName,
      quantity: d.quantity,
      condition: d.condition ?? 'Ok',
      disposition: d.disposition ?? 'Restock',
    })),
  )

  const handleSubmit = async () => {
    try {
      const payload: InspectRmaItemDto[] = items.map((i) => ({
        detailId: i.detailId,
        condition: i.condition,
        disposition: i.disposition,
      }))

      await inspectMutation.mutateAsync({
        id: rma.id,
        dto: { details: payload },
      })

      message.success('Đã lưu kết quả kiểm tra sản phẩm.')
      onClose()
    } catch (err) {
      message.error(getErrorMessage(err, 'Lưu kiểm tra sản phẩm thất bại.'))
    }
  }

  const columns: TableColumnsType<InspectRowState> = [
    {
      title: 'SKU / Tên sản phẩm',
      key: 'product',
      render: (_, r) => (
        <div>
          <Tag color="blue" style={{ fontFamily: 'monospace' }}>
            {r.productSku}
          </Tag>
          <div style={{ fontWeight: 500 }}>{r.productName}</div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            SL: {r.quantity}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Tình trạng hàng (Condition)',
      dataIndex: 'condition',
      width: 220,
      render: (_, record, index) => (
        <Select
          value={String(record.condition)}
          style={{ width: '100%' }}
          onChange={(val) => {
            const next = [...items]
            next[index].condition = val as ProductCondition
            if (val === 'Damaged' && next[index].disposition === 'Restock') {
              next[index].disposition = 'Repair'
            } else if (val === 'Ok') {
              next[index].disposition = 'Restock'
            }
            setItems(next)
          }}
          options={[
            { value: 'Ok', label: '🟢 Nguyên vẹn (Ok)' },
            { value: 'Damaged', label: '🔴 Hư hỏng (Damaged)' },
            { value: 'Missing', label: '🟡 Thiếu hàng (Missing)' },
          ]}
        />
      ),
    },
    {
      title: 'Hướng xử lý (Disposition)',
      dataIndex: 'disposition',
      width: 230,
      render: (_, record, index) => (
        <Select
          value={String(record.disposition)}
          style={{ width: '100%' }}
          onChange={(val) => {
            const next = [...items]
            next[index].disposition = val as Disposition
            setItems(next)
          }}
          options={[
            {
              value: 'Restock',
              label: '📦 Nhập lại kho (Restock)',
              disabled: record.condition === 'Damaged' || record.condition === 'Missing',
            },
            { value: 'Repair', label: '🔧 Đem sửa chữa (Repair)' },
            { value: 'Dispose', label: '🗑️ Tiêu hủy (Dispose)' },
          ]}
        />
      ),
    },
  ]

  return (
    <Modal
      title={
        <div>
          <span>Kiểm tra & Phân loại chất lượng hàng đổi trả</span>
          <Tag color="blue" style={{ marginLeft: 8, fontFamily: 'monospace' }}>
            {rma.rmaCode}
          </Tag>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu kết quả kiểm tra"
      cancelText="Đóng"
      confirmLoading={inspectMutation.isPending}
      width={780}
      destroyOnClose
    >
      <div style={{ margin: '16px 0' }}>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
          Đánh giá tình trạng thực tế của từng sản phẩm nhận về và chọn hướng xử lý phù hợp (Hàng
          nguyên vẹn sẽ được tự động nhập lại kho khi hoàn tất phiếu).
        </Typography.Paragraph>

        <Table
          size="small"
          rowKey="detailId"
          columns={columns}
          dataSource={items}
          pagination={false}
        />
      </div>
    </Modal>
  )
}

export function InspectRmaModal({ rma, open, onClose }: InspectRmaModalProps) {
  if (!open || !rma) return null
  return <InspectContent key={rma.id} rma={rma} open={open} onClose={onClose} />
}
