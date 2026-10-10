import { App, AutoComplete, Button, Form, Input, Modal, Select } from 'antd'
import type { SaleOrderDto } from '../../../types/saleOrder'
import type { ShipmentDto } from '../../../types/shipment'
import { useSaleOrders } from '../../../hooks/useSaleOrders'
import { useCreateShipment } from '../../../hooks/useShipments'
import { getErrorMessage } from '../../../lib/errorHandler'

interface CreateShipmentModalProps {
  open: boolean
  onClose: () => void
  existingShipments: ShipmentDto[]
}

const COMMON_CARRIERS = [
  { value: 'Giao Hàng Tiết Kiệm (GHTK)' },
  { value: 'Giao Hàng Nhanh (GHN)' },
  { value: 'Viettel Post' },
  { value: 'VNPost / Bưu Điện Việt Nam' },
  { value: 'Shopee Xpress (SPX)' },
  { value: 'J&T Express' },
  { value: 'Đội xe giao hàng nội bộ' },
]

export function CreateShipmentModal({
  open,
  onClose,
  existingShipments,
}: CreateShipmentModalProps) {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const { data: saleOrders, isPending: loadingOrders } = useSaleOrders()
  const createMutation = useCreateShipment()

  const existingOrderIds = new Set(existingShipments.map((s) => s.saleOrderId))

  // Đơn hàng đủ điều kiện: status là Packed và chưa có phiếu vận chuyển
  const eligibleOrders = (saleOrders ?? []).filter(
    (so: SaleOrderDto) => so.status === 'Packed' && !existingOrderIds.has(so.id),
  )

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleGenerateTracking = () => {
    const code = `VN${Math.floor(100000000 + Math.random() * 900000000)}`
    form.setFieldsValue({ trackingNo: code })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await createMutation.mutateAsync({
        saleOrderId: values.saleOrderId,
        carrier: values.carrier,
        trackingNo: values.trackingNo,
      })
      message.success('Tạo phiếu vận chuyển thành công.')
      handleClose()
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getErrorMessage(err, 'Tạo phiếu vận chuyển thất bại.'))
    }
  }

  return (
    <Modal
      title="Tạo phiếu vận chuyển mới"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Tạo phiếu"
      cancelText="Hủy"
      confirmLoading={createMutation.isPending}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="saleOrderId"
          label="Đơn bán hàng cần xuất giao"
          rules={[{ required: true, message: 'Vui lòng chọn đơn bán hàng' }]}
        >
          <Select
            placeholder="Chọn đơn hàng đã đóng gói (Packed)"
            loading={loadingOrders}
            showSearch
            optionFilterProp="label"
            options={eligibleOrders.map((so) => ({
              value: so.id,
              label: `${so.orderNo} — ${so.customerName ?? 'Khách lẻ'} (${so.saleOrderDetails.length} mặt hàng)`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="carrier"
          label="Đơn vị vận chuyển"
          rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập đơn vị vận chuyển' }]}
        >
          <AutoComplete
            placeholder="Chọn hoặc nhập tên hãng vận chuyển"
            options={COMMON_CARRIERS}
            filterOption={(inputValue, option) =>
              (option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) ?? -1) !== -1
            }
          />
        </Form.Item>

        <Form.Item label="Mã vận đơn (Tracking Number)">
          <div style={{ display: 'flex', gap: 8 }}>
            <Form.Item
              name="trackingNo"
              noStyle
              rules={[{ required: true, message: 'Vui lòng nhập hoặc sinh mã vận đơn' }]}
            >
              <Input placeholder="Ví dụ: VN849182390" style={{ flex: 1 }} />
            </Form.Item>
            <Button onClick={handleGenerateTracking}>Tự sinh mã</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
