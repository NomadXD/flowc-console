import { createFileRoute } from '@tanstack/react-router'
import { mockAPIAPI } from '@/data/mock/flowc-data'
import { APIDetail } from '@/features/apis/detail'

export const Route = createFileRoute('/_authenticated/apis/$apiId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const api = await mockAPIAPI.get(params.apiId)
    if (!api) {
      throw new Error('API not found')
    }
    return { api }
  },
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { api } = Route.useLoaderData()
  return <APIDetail api={api} />
}
