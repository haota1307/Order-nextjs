import accountApiRequest from '@/app/apiRequests/account'
import { UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: accountApiRequest.me,
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  })
}

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApiRequest.list,
  })
}

export const useGetAccount = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountApiRequest.getEmployee(id),
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      // Thành công sẽ fetch lại data ở table
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      })
    },
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updatEmployee(id, body),
    onSuccess: () => {
      // Thành công sẽ fetch lại data ở table
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      })
    },
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      // Thành công sẽ fetch lại data ở table
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      })
    },
  })
}
