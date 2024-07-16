'use client'

import { Badge } from '@/components/ui/badge'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import socket from '@/lib/socket'
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from '@/schemaValidations/order.schema'
import { toast } from '@/components/ui/use-toast'
import { OrderStatus } from '@/constants/type'

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderListQuery()
  const orders = useMemo(() => data?.payload.data ?? [], [data])

  const { unPaid, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            unPaid: {
              price:
                result.unPaid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.unPaid.quantity + order.quantity,
            },
          }
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          }
        }
        return result
      },
      {
        unPaid: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    )
  }, [orders])

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      const {
        status,
        quantity,
        dishSnapshot: { name },
      } = data
      toast({
        title: 'Thông báo 🔊',
        description: `Món ăn ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái #${getVietnameseOrderStatus(
          status
        )}`,
      })
      refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]
      toast({
        title: 'Thông báo 🔊',
        description: `Khách hàng: ${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`,
      })
      refetch()
    }

    socket.on('update-order', onUpdateOrder)
    socket.on('payment', onPayment)
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('update-order', onUpdateOrder)
      socket.off('payment', onPayment)
    }
  }, [refetch])

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
              <p className='w-20'>{formatCurrency(order.dishSnapshot.price)}</p>
              <p className='mx-4'>
                <X size={16} />
              </p>
              <p className='px-2 rounded-full mr-2'>{order.quantity}</p>
            </div>
          </div>
          <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
            <Badge variant={'outline'}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      {paid.quantity !== 0 && (
        <div className='sticky bottom-0'>
          <div className='w-full flex items-center justify-center space-x-4 text-xl'>
            <span>Đơn đã thanh toán · {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}
      <div className='sticky bottom-0 text-orange-500'>
        <div className='w-full flex items-center justify-center space-x-4 text-xl'>
          <span>Đơn chưa thanh toán · {unPaid.quantity} món</span>
          <span>{formatCurrency(unPaid.price)}</span>
        </div>
      </div>
    </>
  )
}
