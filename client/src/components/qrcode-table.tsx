'use client'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'
import { getTableLink } from '@/lib/utils'

export default function QRCodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string
  tableNumber: number
  width?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    // Canvas thật
    const canvas = canvasRef.current!
    canvas.height = width + 70
    canvas.width = width
    const canvasContext = canvas.getContext('2d')!
    canvasContext.fillStyle = '#fff'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.font = '20px Arial'
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = '#000'
    canvasContext.fillText(`Bàn số ${tableNumber}`, canvas.width / 2, canvas.width + 25)
    canvasContext.fillText(`Quét mã QR để gọi món`, canvas.width / 2, canvas.width + 50)
    // Canvas ảo
    const virtalCanvas = document.createElement('canvas')

    QRCode.toCanvas(
      virtalCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      function (error) {
        if (error) console.log(error)
        canvasContext.drawImage(virtalCanvas, 0, 0, width, width)
      }
    )
  }, [token, tableNumber, width])
  return <canvas ref={canvasRef} />
}

/** Note:
 * Thư viện QRcode sẽ vẽ lên thẻ canvas
 * Ta sẽ tạo ra thẻ canvas ảo để thư viện vẽ lên thẻ canvas đó
 * và ta sẽ edit thẻ canvas thật
 * => chúng ta sẽ đưa thẻ canvas ảo chứa qrcode vào thẻ canvas thật
 */
