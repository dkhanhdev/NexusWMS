import api from '../lib/axios'
import type { CreateRmaDto, InspectRmaDto, RmaDto } from '../types/rma'

export const getRmas = (): Promise<RmaDto[]> => api.get('/Rmas')

export const getRmaById = (id: string): Promise<RmaDto> => api.get(`/Rmas/${id}`)

export const createRma = (dto: CreateRmaDto): Promise<RmaDto> => api.post('/Rmas', dto)

export const approveRma = (id: string): Promise<RmaDto> => api.post(`/Rmas/${id}/approve`)

export const receiveRma = (id: string): Promise<RmaDto> => api.post(`/Rmas/${id}/receive`)

export const inspectRma = (id: string, dto: InspectRmaDto): Promise<RmaDto> =>
  api.post(`/Rmas/${id}/inspect`, dto)

export const completeRma = (id: string): Promise<RmaDto> => api.post(`/Rmas/${id}/complete`)

export const deleteRma = (id: string): Promise<void> => api.delete(`/Rmas/${id}`)
