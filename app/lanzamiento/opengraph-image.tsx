import { ImageResponse } from 'next/og'
import { LAUNCH_EVENT } from '@/lib/launch/config'

export const alt = 'Algo se está descongelando'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Vista previa para WhatsApp: un bloque de hielo con la fecha y nada más.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eef6ff 0%, #cfe3fa 55%, #a9c8f0 100%)',
          color: '#1d2a3a',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 120 }}>🧊</div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, marginTop: 20 }}>Algo se está descongelando.</div>
        <div style={{ fontSize: 36, marginTop: 24, opacity: 0.7 }}>{`${LAUNCH_EVENT.dateLabel} · Abrí la invitación`}</div>
      </div>
    ),
    size,
  )
}
