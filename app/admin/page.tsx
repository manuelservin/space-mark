import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getAdminData } from '@/app/actions/forms'
import { AdminWorkspace } from '@/components/admin-workspace'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const data = await getAdminData()
  return <AdminWorkspace initialData={data} userName={session.user.name} />
}
