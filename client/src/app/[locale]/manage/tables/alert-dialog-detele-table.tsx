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
import { useDeleteTableMutation } from '@/queries/useTable'
import { TableListResType } from '@/schemaValidations/table.schema'

type TableItem = TableListResType['data'][0]

export default function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete,
}: {
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}) {
  const { mutateAsync } = useDeleteTableMutation()
  const deleteAccount = async () => {
    if (tableDelete) {
      try {
        const result = await mutateAsync(tableDelete.number)
        setTableDelete(null)
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
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>
              {tableDelete?.number}
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
