import { useRef } from 'react'
import { Button, Modal, Tag, Typography } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import type { ShipmentDto } from '../../../types/shipment'
import type { SaleOrderDto } from '../../../types/saleOrder'
import { useSaleOrders } from '../../../hooks/useSaleOrders'
import { formatDateTime } from '../../../lib/date'

interface ShippingLabelModalProps {
  shipment: ShipmentDto | null
  open: boolean
  onClose: () => void
}

// Hàm sinh SVG Barcode giả lập Code128 theo chuỗi ký tự
function generateBarcodeSvg(text: string) {
  const bars: { width: number; space: number }[] = []
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    bars.push({ width: (code % 3) + 1.5, space: ((code * 2) % 3) + 1.2 })
  }
  let currentX = 10
  const rects = bars.map((b) => {
    const x = currentX
    currentX += b.width + b.space
    return `<rect x="${x}" y="5" width="${b.width * 1.8}" height="45" fill="#000" />`
  })

  const totalWidth = Math.max(currentX + 15, 220)
  return `
    <svg width="${totalWidth}" height="65" viewBox="0 0 ${totalWidth} 65" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fff" />
      ${rects.join('')}
      <text x="${totalWidth / 2}" y="60" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#000">${text}</text>
    </svg>
  `
}

export function ShippingLabelModal({
  shipment,
  open,
  onClose,
}: ShippingLabelModalProps) {
  const { data: saleOrders } = useSaleOrders()
  const printRef = useRef<HTMLDivElement>(null)

  const relatedOrder: SaleOrderDto | undefined = (saleOrders ?? []).find(
    (so) => so.id === shipment?.saleOrderId,
  )

  const handlePrint = () => {
    if (!printRef.current) return
    const content = printRef.current.innerHTML

    const printWindow = window.open('', '_blank', 'width=850,height=700')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>In vận đơn - ${shipment?.trackingNo ?? 'Waybill'}</title>
          <style>
            @page {
              size: A5 portrait;
              margin: 10mm;
            }
            body {
              font-family: Arial, sans-serif;
              color: #111;
              margin: 0;
              padding: 0;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .label-container {
              border: 2px solid #000;
              padding: 14px;
              max-width: 550px;
              margin: 0 auto;
            }
            .header-bar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .carrier-box {
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
              border: 2px solid #000;
              padding: 4px 10px;
              border-radius: 4px;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .section-title {
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
              color: #444;
              margin-bottom: 4px;
            }
            .party-name {
              font-size: 14px;
              font-weight: bold;
            }
            .party-info {
              font-size: 12px;
              color: #222;
              line-height: 1.4;
            }
            .barcode-area {
              text-align: center;
              padding: 10px 0;
              border-bottom: 2px solid #000;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              margin-top: 6px;
            }
            th, td {
              border: 1px solid #999;
              padding: 6px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .signature-area {
              display: flex;
              justify-content: space-between;
              margin-top: 24px;
              padding-top: 10px;
              text-align: center;
              font-size: 11px;
            }
            .sig-box {
              width: 45%;
              padding-top: 50px;
              border-top: 1px dotted #888;
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            ${content}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const items = relatedOrder?.saleOrderDetails ?? []

  const trackingBarcode = shipment?.trackingNo
    ? generateBarcodeSvg(shipment.trackingNo)
    : ''

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PrinterOutlined style={{ color: '#1677ff' }} />
          <span>Vận đơn & Phiếu đóng gói giao hàng</span>
          {shipment?.trackingNo && (
            <Tag color="blue" style={{ fontFamily: 'monospace' }}>
              {shipment.trackingNo}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={680}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          In vận đơn
        </Button>,
      ]}
      destroyOnClose
    >
      <div
        ref={printRef}
        style={{
          border: '1.5px solid #d9d9d9',
          padding: 16,
          borderRadius: 8,
          background: '#fff',
          marginTop: 12,
        }}
      >
        {/* Header phiếu */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #222',
            paddingBottom: 10,
            marginBottom: 12,
          }}
        >
          <div>
            <Typography.Title level={4} style={{ margin: 0, textTransform: 'uppercase' }}>
              NEXUS EXPRESS LOGISTICS
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Phiếu giao hàng & Vận đơn xuất kho
            </Typography.Text>
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              border: '2px solid #1677ff',
              color: '#1677ff',
              padding: '4px 12px',
              borderRadius: 4,
            }}
          >
            {shipment?.carrier || 'TIÊU CHUẨN'}
          </div>
        </div>

        {/* Mã vạch Vận đơn */}
        {trackingBarcode && (
          <div
            style={{
              textAlign: 'center',
              padding: '6px 0',
              borderBottom: '1px dashed #bbb',
              marginBottom: 12,
            }}
            dangerouslySetInnerHTML={{ __html: trackingBarcode }}
          />
        )}

        {/* Thông tin người gửi & người nhận */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            borderBottom: '1px solid #eee',
            paddingBottom: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              TỪ (NGƯỜI GỬI):
            </Typography.Text>
            <div style={{ fontWeight: 'bold', fontSize: 14 }}>
              Hệ thống Kho: {shipment?.warehouseName ?? 'Tổng kho Nexus WMS'}
            </div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
              Khu Công Nghiệp Logistics, TP. Hồ Chí Minh
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>Hotline: 1900 6868</div>
          </div>

          <div>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              ĐẾN (NGƯỜI NHẬN):
            </Typography.Text>
            <div style={{ fontWeight: 'bold', fontSize: 14, color: '#1677ff' }}>
              {shipment?.customerName ?? 'Khách hàng'}
            </div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
              Mã đơn hàng:{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {shipment?.saleOrderNo}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>
              Ngày tạo:{' '}
              {shipment?.createdDate ? formatDateTime(shipment.createdDate) : '—'}
            </div>
          </div>
        </div>

        {/* Chi tiết mặt hàng (Packing Slip) */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Typography.Text strong style={{ fontSize: 13 }}>
              Danh sách hàng hóa ({items.length} mặt hàng)
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              Chỉ dẫn: Cho xem hàng, không thử
            </Typography.Text>
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={{ border: '1px solid #d9d9d9', padding: 6, width: 40, textAlign: 'center' }}>
                  STT
                </th>
                <th style={{ border: '1px solid #d9d9d9', padding: 6, width: 120 }}>Mã SKU</th>
                <th style={{ border: '1px solid #d9d9d9', padding: 6 }}>Tên sản phẩm</th>
                <th style={{ border: '1px solid #d9d9d9', padding: 6, width: 80, textAlign: 'right' }}>
                  Số lượng
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #d9d9d9', padding: 6, textAlign: 'center' }}>
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      border: '1px solid #d9d9d9',
                      padding: 6,
                      fontFamily: 'monospace',
                    }}
                  >
                    {item.productSku}
                  </td>
                  <td style={{ border: '1px solid #d9d9d9', padding: 6 }}>{item.productName}</td>
                  <td
                    style={{
                      border: '1px solid #d9d9d9',
                      padding: 6,
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chữ ký xác nhận */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 30,
            paddingTop: 10,
            fontSize: 12,
          }}
        >
          <div style={{ textAlign: 'center', width: '45%' }}>
            <div style={{ fontWeight: 600 }}>Chữ ký người nhận</div>
            <div style={{ fontSize: 11, color: '#888' }}>(Ký và ghi rõ họ tên)</div>
            <div style={{ height: 40 }} />
          </div>

          <div style={{ textAlign: 'center', width: '45%' }}>
            <div style={{ fontWeight: 600 }}>Đại diện giao hàng</div>
            <div style={{ fontSize: 11, color: '#888' }}>(Ký và ghi rõ họ tên)</div>
            <div style={{ height: 40 }} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
