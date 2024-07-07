'use client'

import { Badge } from '@/components/ui/badge'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import Image from 'next/image'
import { useMemo } from 'react'
import { X } from 'lucide-react'

export default function OrdersCart() {
  const { data } = useGuestGetOrderListQuery()
  const orders = useMemo(() => data?.payload.data ?? [], [data])

  const totalPrice = useMemo(() => {
    return orders.reduce((result, order) => {
      return result + order.dishSnapshot.price * order.quantity
    }, 0)
  }, [orders])
  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className='flex items-center justify-center p-2'>
          <div className='text-sm font-semibold'>{index + 1}</div>
          <div className='flex-shrink-0 relative shadow-md'>
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className='object-cover w-[80px] h-[80px] rounded-md mx-8'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
            <div className='text-lg flex items-center justify-center'>
              <p className='w-16'>{formatCurrency(order.dishSnapshot.price)}</p>
              <p className='mx-4'>
                <X size={16} />
              </p>
              <p className='px-2 rounded-full'>{order.quantity}</p>
            </div>
          </div>
          <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
            <Badge variant={'outline'}>{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      ))}
      <div className='sticky bottom-0 text-orange-500'>
        <div className='w-full flex items-center justify-center space-x-4 text-xl'>
          <span>Tổng cộng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  )
}
