export type RmaStatus = 'Requested' | 'Approved' | 'Received' | 'Inspected' | 'Completed' | number
export type ProductCondition = 'Ok' | 'Damaged' | 'Missing' | number
export type Disposition = 'Restock' | 'Repair' | 'Dispose' | number

export interface RmaDetailDto {
  id: string
  rmaId: string
  productId: string
  productSku: string
  productName: string
  quantity: number
  condition: ProductCondition
  disposition: Disposition
}

export interface RmaDto {
  id: string
  rmaCode: string
  saleOrderId: string
  saleOrderNo?: string
  customerName?: string
  warehouseId?: string
  warehouseName?: string
  reason?: string
  status: RmaStatus
  createdDate: string
  updatedDate?: string
  details: RmaDetailDto[]
}

export interface CreateRmaDetailDto {
  productId: string
  quantity: number
  condition?: ProductCondition
  disposition?: Disposition
}

export interface CreateRmaDto {
  saleOrderId: string
  reason?: string
  details: CreateRmaDetailDto[]
}

export interface InspectRmaItemDto {
  detailId: string
  condition: ProductCondition
  disposition: Disposition
}

export interface InspectRmaDto {
  details: InspectRmaItemDto[]
}
