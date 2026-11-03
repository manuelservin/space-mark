import type { Metadata, Viewport } from 'next'
import { LaunchInvite } from '@/components/launch/launch-invite'
import { LAUNCH_EVENT } from '@/lib/launch/config'

export const metadata: Metadata = {
  title: 'Algo se está descongelando',
  description: `${LAUNCH_EVENT.dateLabel} · ${LAUNCH_EVENT.timeLabel}. Abrí la invitación… si podés.`,
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Algo se está descongelando 🧊',
    description: `${LAUNCH_EVENT.dateLabel}. Abrí la invitación… si podés.`,
  },
}

export const viewport: Viewport = {
  themeColor: '#cfe3fa',
}

export default function LaunchPage() {
  return <LaunchInvite />
}
