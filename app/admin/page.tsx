import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getAdminData } from '@/app/actions/forms'
import { AdminWorkspace } from '@/components/admin-workspace'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const data = await getAdminData()
  return <AdminWorkspace initialData={data} userName={session.user.name} />
}
