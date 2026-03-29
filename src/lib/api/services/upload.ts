import { apiClient } from '../client'

export const uploadService = {
  uploadBundle(file: Blob) {
    return apiClient.POST('/api/v1/upload', {
      body: { file: '' },
      bodySerializer: () => {
        const fd = new FormData()
        fd.append('file', file)
        return fd
      },
    })
  },
}
