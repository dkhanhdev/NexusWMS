import type { PurchaseOrderStatus } from '../types/purchaseOrder'
import type { PickingStatus } from '../types/picking'
import type { PutAwayTaskStatus } from '../types/putAwayTask'
import type { SaleOrderStatus } from '../types/saleOrder'

// Bảng màu trạng thái chuẩn theo docs/issues/ANTD-RULES.md §3:
// Mới/Chờ duyệt/Nháp/Mở = orange · Đang xử lý/Đã phân công = blue · Hoàn thành/Đã duyệt/Đã giao = green · Đã hủy/Hỏng = red · Đã đóng = default

export const SALE_ORDER_STATUS_LABEL: Record<SaleOrderStatus, string> = {
  New: 'Mới',
  Allocated: 'Đã phân bổ',
  Picking: 'Đang lấy hàng',
  Packed: 'Đã đóng gói',
  Shipped: 'Đã giao',
}

export const SALE_ORDER_STATUS_COLOR: Record<SaleOrderStatus, string> = {
  New: 'orange',
  Allocated: 'blue',
  Picking: 'blue',
  Packed: 'green',
  Shipped: 'green',
}

export const SALE_ORDER_DETAIL_STATUS_LABEL: Record<string, string> = {
  Pending: 'Chờ phân bổ',
  Allocated: 'Đã phân bổ',
  Picked: 'Đã lấy',
}

export const SALE_ORDER_DETAIL_STATUS_COLOR: Record<string, string> = {
  Pending: 'orange',
  Allocated: 'blue',
  Picked: 'green',
}

export const PUT_AWAY_STATUS_LABEL: Record<PutAwayTaskStatus, string> = {
  Open: 'Mở',
  Assigned: 'Đã phân công',
  InProgress: 'Đang cất',
  Completed: 'Hoàn thành',
}

export const PUT_AWAY_STATUS_COLOR: Record<PutAwayTaskStatus, string> = {
  Open: 'orange',
  Assigned: 'blue',
  InProgress: 'blue',
  Completed: 'green',
}

export const PICKING_STATUS_LABEL: Record<PickingStatus, string> = {
  Open: 'Mở',
  Assigned: 'Đã phân công',
  InProgress: 'Đang lấy',
  Completed: 'Hoàn thành',
}

export const PICKING_STATUS_COLOR: Record<PickingStatus, string> = {
  Open: 'orange',
  Assigned: 'blue',
  InProgress: 'blue',
  Completed: 'green',
}

export const PURCHASE_ORDER_STATUS_LABEL: Record<PurchaseOrderStatus, string> = {
  Pending: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Received: 'Đã nhận hàng',
  Closed: 'Đã đóng',
}

export const PURCHASE_ORDER_STATUS_COLOR: Record<PurchaseOrderStatus, string> = {
  Pending: 'orange',
  Approved: 'green',
  Received: 'blue',
  Closed: 'default',
}

export const RMA_STATUS_LABEL: Record<string, string> = {
  Requested: 'Chờ duyệt',
  '0': 'Chờ duyệt',
  Approved: 'Đã duyệt',
  '1': 'Đã duyệt',
  Received: 'Đã nhận hàng',
  '2': 'Đã nhận hàng',
  Inspected: 'Đã kiểm tra',
  '3': 'Đã kiểm tra',
  Completed: 'Hoàn thành',
  '4': 'Hoàn thành',
}

export const RMA_STATUS_COLOR: Record<string, string> = {
  Requested: 'orange',
  '0': 'orange',
  Approved: 'blue',
  '1': 'blue',
  Received: 'cyan',
  '2': 'cyan',
  Inspected: 'purple',
  '3': 'purple',
  Completed: 'green',
  '4': 'green',
}

export const PRODUCT_CONDITION_LABEL: Record<string, string> = {
  Ok: 'Nguyên vẹn',
  '0': 'Nguyên vẹn',
  Damaged: 'Hư hỏng',
  '1': 'Hư hỏng',
  Missing: 'Thiếu hàng',
  '2': 'Thiếu hàng',
}

export const PRODUCT_CONDITION_COLOR: Record<string, string> = {
  Ok: 'green',
  '0': 'green',
  Damaged: 'red',
  '1': 'red',
  Missing: 'orange',
  '2': 'orange',
}

export const DISPOSITION_LABEL: Record<string, string> = {
  Restock: 'Nhập lại kho',
  '0': 'Nhập lại kho',
  Repair: 'Sửa chữa',
  '1': 'Sửa chữa',
  Dispose: 'Tiêu hủy',
  '2': 'Tiêu hủy',
}

export const DISPOSITION_COLOR: Record<string, string> = {
  Restock: 'green',
  '0': 'green',
  Repair: 'orange',
  '1': 'orange',
  Dispose: 'red',
  '2': 'red',
}
