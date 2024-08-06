import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useDeleteAccountMutation } from '@/queries/useAccount'
import { AccountListResType } from '@/schemaValidations/account.schema'

type AccountItem = AccountListResType['data'][0]

export default function AlertDialogDeleteAccount({
  employeeDelete,
  setEmployeeDelete,
}: {
  employeeDelete: AccountItem | null
  setEmployeeDelete: (value: AccountItem | null) => void
}) {
  const { mutateAsync } = useDeleteAccountMutation()
  const deleteAccount = async () => {
    if (employeeDelete) {
      try {
        const result = await mutateAsync(employeeDelete.id)
        setEmployeeDelete(null)
        toast({
          title: 'Thành công',
          description: result.payload.message,
        })
      } catch (error) {
        handleErrorApi({
          error,
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>
              {employeeDelete?.name}
            </span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAccount}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
