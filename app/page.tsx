import { BarChart3, Check, ChevronRight, Database, Orbit, Sparkles } from 'lucide-react'
import { getPublishedForms } from '@/app/actions/forms'
import { SiteHeader } from '@/components/site-header'

const features = [
  { icon: Database, title: 'Recolecta', text: 'Crea formularios claros que convierten respuestas en señales útiles.' },
  { icon: BarChart3, title: 'Comprende', text: 'Visualiza tendencias y patrones para tomar mejores decisiones.' },
  { icon: Orbit, title: 'Actúa', text: 'Comparte insights con tu equipo y mueve tus proyectos adelante.' },
]

const navLinks = [
  { href: '#encuestas', label: 'Encuestas' },
  { href: '#producto', label: 'Producto' },
  { href: '#metodo', label: 'Método' },
]

export default async function Home() {
  const surveys = await getPublishedForms()

  return (
    <main className="min-h-screen overflow-hidden bg-brand text-primary-foreground">
      <SiteHeader links={navLinks} />
      <section id="top" className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:pb-36 lg:pt-24">
        <div className="absolute right-[-10%] top-12 -z-0 size-80 rounded-full border border-accent/20" />
        <div className="relative z-10">
          <p className="mb-7 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-accent">
            <Sparkles size={15} /> Datos que abren caminos
          </p>
          <h1 className="max-w-4xl text-balance font-sans text-6xl font-semibold leading-[.95] tracking-[-0.07em] sm:text-8xl">
            Dale forma a lo que <span className="text-accent">todavía no ves.</span>
          </h1>
          <p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-primary-foreground/75">
            SpaceMark convierte las preguntas correctas en decisiones con dirección. Diseña, escucha y descubre las señales que hacen avanzar tu marca.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#encuestas" className="rounded-full bg-card px-6 py-3 text-sm font-medium text-card-foreground transition-transform hover:-translate-y-0.5">
              Ver encuestas <ChevronRight className="ml-1 inline" size={16} />
            </a>
            <a href="#producto" className="rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium">
              Conocer el método
            </a>
          </div>
        </div>
        <div className="relative z-10 flex min-h-[330px] items-center justify-center rounded-[2rem] border border-border bg-card p-8 text-card-foreground shadow-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
            <div className="mb-10 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[.2em] text-muted-foreground">space / mark</span>
              <span className="size-2 rounded-full bg-accent" />
            </div>
            <p className="text-3xl font-medium tracking-tight">
              ¿Qué mueve<br /><span className="text-accent">tu mundo?</span>
            </p>
            <div className="mt-10 space-y-3">
              <div className="h-2 w-3/4 rounded-full bg-muted" />
              <div className="h-2 w-1/2 rounded-full bg-muted" />
              <div className="h-10 rounded-xl border border-border" />
            </div>
          </div>
        </div>
      </section>

      <section id="encuestas" className="border-y border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-12 max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Análisis de mercado</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Encuestas abiertas</h2>
          </div>
          {surveys.length === 0 ? (
            <p className="max-w-xl text-lg leading-8 text-primary-foreground/75">
              Todavía no hay encuestas publicadas. Cuando un formulario se publique desde el admin, aparece acá.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {surveys.map((survey) => (
                <a key={survey.id} href={`/encuesta/${survey.id}`} className="rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl">
                  <h3 className="text-2xl font-medium">{survey.title}</h3>
                  <p className="mt-3 leading-7 text-card-foreground/70">{survey.description}</p>
                  <span className="mt-6 inline-flex items-center text-sm font-medium text-accent">
                    Responder <ChevronRight className="ml-1" size={16} />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="producto" className="border-b border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-12 max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Una plataforma para mirar mejor</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Menos ruido.<br />Más señal.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="bg-card p-8 text-card-foreground">
                <Icon className="mb-16 text-accent" size={22} />
                <h3 className="text-2xl font-medium">{title}</h3>
                <p className="mt-3 leading-7 text-card-foreground/70">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="metodo" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Tu curiosidad<br /><span className="text-accent">es el comienzo.</span>
          </h2>
          <div className="space-y-8 text-primary-foreground/75">
            <p className="text-lg leading-8">
              No necesitas tener todas las respuestas. Solo una buena pregunta. SpaceMark te ayuda a construir el espacio donde las respuestas aparecen.
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-primary-foreground">
              <Check className="text-accent" size={18} /> Formularios creados para personas
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-primary-foreground">
              <Check className="text-accent" size={18} /> Análisis que cuenta una historia
            </div>
          </div>
        </div>
      </section>

      <footer id="contacto" className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">SpaceMark</p>
            <p className="mt-3 text-2xl tracking-tight">Haz visible lo posible.</p>
          </div>
          <p className="text-sm text-primary-foreground/75">Una nueva forma de escuchar los datos.</p>
        </div>
      </footer>
    </main>
  )
}
