import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  approveRma,
  completeRma,
  createRma,
  deleteRma,
  getRmaById,
  getRmas,
  inspectRma,
  receiveRma,
} from '../services/rma'
import type { CreateRmaDto, InspectRmaDto } from '../types/rma'

export function useRmas(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ['rmas'],
    queryFn: getRmas,
    refetchInterval: options?.refetchInterval,
  })
}

export function useRma(id: string) {
  return useQuery({
    queryKey: ['rmas', id],
    queryFn: () => getRmaById(id),
    enabled: !!id,
  })
}

export function useCreateRma() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateRmaDto) => createRma(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmas'] })
      queryClient.invalidateQueries({ queryKey: ['saleOrders'] })
    },
  })
}

export function useApproveRma() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveRma(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmas'] })
    },
  })
}

export function useReceiveRma() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => receiveRma(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmas'] })
    },
  })
}

export function useInspectRma() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: InspectRmaDto }) => inspectRma(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmas'] })
    },
  })
}

export function useCompleteRma() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => completeRma(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmas'] })
      queryClient.invalidateQueries({ queryKey: ['stocks'] })
      queryClient.invalidateQueries({ queryKey: ['stockSummaryPage'] })
      queryClient.invalidateQueries({ queryKey: ['stockMovements'] })
    },
  })
}

export function useDeleteRma() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRma(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rmas'] })
    },
  })
}
