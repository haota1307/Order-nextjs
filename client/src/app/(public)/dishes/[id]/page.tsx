import dishApiRequest from '@/apiRequests/dish'
import { formatCurrency, wrapServerApi } from '@/lib/utils'
import Image from 'next/image'

export default async function DishPage({
  params: { id },
}: {
  params: {
    id: string
  }
}) {
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))

  const dish = data?.payload?.data
  if (!dish)
    return (
      <div>
        <h1 className='text-2xl lg:text-3xl font-semibold'>
          Món ăn không tồn tại
        </h1>
      </div>
    )
  return (
    <div className='flex flex-wrap items-start'>
      <div className='w-full md:w-1/2 p-2'>
        <h1 className='text-2xl lg:text-3xl font-semibold'>{dish.name}</h1>
        <div className='font-semibold'>Giá: {formatCurrency(dish.price)}</div>
        <Image
          src={dish.image}
          width={500}
          height={500}
          quality={100}
          alt={dish.name}
          className='object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md my-4'
        />
      </div>
      <div className='w-full md:w-1/2 p-2'>
        <h2 className='text-xl font-semibold'>Mô tả món ăn</h2>
        <p>{dish.description}</p>
      </div>
    </div>
  )
}
