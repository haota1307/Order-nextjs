import http from '@/lib/http'
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from '@/schemaValidations/table.schema'

const tableApiRequest = {
  list: () => http.get<TableListResType>('/table'),
  add: (body: CreateTableBodyType) => http.post<TableResType>('/table', body),
  getTable: (id: number) => http.get<TableResType>(`table/${id}`),
  updateTable: (id: number, body: UpdateTableBodyType) =>
    http.put<TableResType>(`/table/${id}`, body),
  deleteTable: (id: number) => http.delete<TableResType>(`/table/${id}`),
}
export default tableApiRequest
