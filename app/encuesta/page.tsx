export const dynamic = 'force-dynamic'

import { ChevronRight } from 'lucide-react'
import { getPublishedForms } from '@/app/actions/forms'

export default async function SurveysPage() {
  const surveys = await getPublishedForms()

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:py-20">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="font-mono text-sm font-bold tracking-[.2em]">SPACEMARK</a>
        <p className="mt-20 font-mono text-xs uppercase tracking-[.2em] text-accent">Análisis de mercado</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">Encuestas abiertas</h1>
        {surveys.length === 0 ? (
          <p className="mt-6 leading-7 text-muted-foreground">No hay una encuesta publicada todavía.</p>
        ) : (
          <div className="mt-12 space-y-4">
            {surveys.map((survey) => (
              <a key={survey.id} href={`/encuesta/${survey.id}`} className="block rounded-2xl border border-border bg-card p-6 shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl">
                <h2 className="text-2xl font-medium">{survey.title}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{survey.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-accent">
                  Responder <ChevronRight className="ml-1" size={16} />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
