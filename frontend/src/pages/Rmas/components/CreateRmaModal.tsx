import { useState } from 'react'
import {
  App,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Typography,
} from 'antd'
import type { TableColumnsType } from 'antd'
import type { SaleOrderDetailDto, SaleOrderDto } from '../../../types/saleOrder'
import { useSaleOrders } from '../../../hooks/useSaleOrders'
import { useCreateRma } from '../../../hooks/useRmas'
import { getErrorMessage } from '../../../lib/errorHandler'

interface CreateRmaModalProps {
  open: boolean
  onClose: () => void
}

interface ItemRow {
  productId: string
  productSku: string
  productName: string
  originalQty: number
  returnQty: number
  selected: boolean
}

export function CreateRmaModal({ open, onClose }: CreateRmaModalProps) {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const { data: saleOrders, isPending: loadingOrders } = useSaleOrders()
  const createMutation = useCreateRma()

  const [items, setItems] = useState<ItemRow[]>([])

  // Chỉ cho phép đổi trả các đơn đã Packed hoặc Shipped
  const eligibleOrders = (saleOrders ?? []).filter(
    (so) => so.status === 'Packed' || so.status === 'Shipped',
  )

  const handleOrderChange = (orderId: string) => {
    const order = eligibleOrders.find((so) => so.id === orderId)
    if (order) {
      setItems(
        order.saleOrderDetails.map((d: SaleOrderDetailDto) => ({
          productId: d.productId,
          productSku: d.productSku,
          productName: d.productName,
          originalQty: d.quantity,
          returnQty: d.quantity,
          selected: true,
        })),
      )
    } else {
      setItems([])
    }
  }

  const handleClose = () => {
    form.resetFields()
    setItems([])
    onClose()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const selectedItems = items.filter((i) => i.selected && i.returnQty > 0)

      if (selectedItems.length === 0) {
        message.warning('Vui lòng chọn ít nhất một sản phẩm cần đổi trả với số lượng lớn hơn 0.')
        return
      }

      await createMutation.mutateAsync({
        saleOrderId: values.saleOrderId,
        reason: values.reason,
        details: selectedItems.map((i) => ({
          productId: i.productId,
          quantity: i.returnQty,
        })),
      })

      message.success('Tạo phiếu đổi trả thành công.')
      handleClose()
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getErrorMessage(err, 'Tạo phiếu đổi trả thất bại.'))
    }
  }

  const columns: TableColumnsType<ItemRow> = [
    {
      title: 'Chọn',
      dataIndex: 'selected',
      width: 70,
      render: (_, record, index) => (
        <input
          type="checkbox"
          checked={record.selected}
          onChange={(e) => {
            const next = [...items]
            next[index].selected = e.target.checked
            setItems(next)
          }}
        />
      ),
    },
    {
      title: 'Mã SKU',
      dataIndex: 'productSku',
      width: 140,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'SL đã mua',
      dataIndex: 'originalQty',
      align: 'right',
      width: 110,
    },
    {
      title: 'SL đổi trả',
      dataIndex: 'returnQty',
      align: 'right',
      width: 130,
      render: (_, record, index) => (
        <InputNumber
          min={1}
          max={record.originalQty}
          value={record.returnQty}
          disabled={!record.selected}
          onChange={(val) => {
            const next = [...items]
            next[index].returnQty = Number(val) || 1
            setItems(next)
          }}
          style={{ width: '100%' }}
        />
      ),
    },
  ]

  return (
    <Modal
      title="Tạo phiếu đổi / trả hàng (RMA)"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Tạo phiếu"
      cancelText="Hủy"
      confirmLoading={createMutation.isPending}
      width={720}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="saleOrderId"
          label="Đơn bán hàng cần đổi trả"
          rules={[{ required: true, message: 'Vui lòng chọn đơn bán hàng' }]}
        >
          <Select
            placeholder="Chọn đơn bán hàng (đã đóng gói hoặc giao hàng)"
            loading={loadingOrders}
            showSearch
            optionFilterProp="label"
            onChange={handleOrderChange}
            options={eligibleOrders.map((so: SaleOrderDto) => ({
              value: so.id,
              label: `${so.orderNo} — ${so.customerName ?? 'Khách lẻ'} (${so.status === 'Shipped' ? 'Đã giao' : 'Đã đóng gói'})`,
            }))}
          />
        </Form.Item>

        <Form.Item name="reason" label="Lý do đổi trả">
          <Input.TextArea
            rows={2}
            placeholder="Nhập lý do khách trả hàng (sản phẩm lỗi, giao nhầm mẫu, khách đổi ý...)"
            maxLength={500}
            showCount
          />
        </Form.Item>

        {items.length > 0 && (
          <div>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              Chọn sản phẩm cần đổi trả:
            </Typography.Text>
            <Table
              size="small"
              rowKey="productId"
              columns={columns}
              dataSource={items}
              pagination={false}
            />
          </div>
        )}
      </Form>
    </Modal>
  )
}
