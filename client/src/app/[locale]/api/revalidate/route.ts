import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag!)
  return Response.json({ revalidated: true, now: Date.now() })
}

/** ISR
 * Sẽ build lại file static khi được yêu cầu build
 * flow hoạt động:
 * * Khi Admin thêm 1 món ăn
 * * -> gửi yêu cầu build lại file
 * * -> khi có ai đó truy cập vào trang có chứa request get món ăn
 * * -> file sẽ được build lại
 */
