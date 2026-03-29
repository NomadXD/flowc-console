import { createFileRoute } from '@tanstack/react-router'
import { apisService } from '@/lib/api/services/apis'
import { throwOnError } from '@/lib/api/throw-on-error'
import { APIDetail } from '@/features/apis/detail'

export const Route = createFileRoute('/_authenticated/apis/$apiId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const api = await apisService.get(params.apiId).then(throwOnError)
    return { api }
  },
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { api } = Route.useLoaderData()
  return <APIDetail api={api} />
}
