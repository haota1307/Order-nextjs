import { mediaApiRequest } from '@/app/apiRequests/media'
import { useMutation } from '@tanstack/react-query'

export const uploadMediaMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload,
  })
}
