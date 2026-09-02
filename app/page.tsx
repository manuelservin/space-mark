import { BarChart3, ChevronRight, Database, Orbit, Sparkles } from 'lucide-react'
import { getPublishedForms } from '@/app/actions/forms'
import { ContactSection } from '@/components/contact-section'
import { EssenceSection } from '@/components/essence-section'
import { ExperienceSection } from '@/components/experience-section'
import { RoundedImage } from '@/components/rounded-image'
import { SiteHeader } from '@/components/site-header'
import { TeamSection } from '@/components/team-section'

const features = [
  { icon: Database, title: 'Recolecta', text: 'Las encuestas captan cómo las personas habitan, sienten y se mueven. Esa escucha es la materia prima de cada experiencia.' },
  { icon: BarChart3, title: 'Comprende', text: 'Leemos patrones, emociones y necesidades. Convertimos respuestas en señales para diseñar con dirección.' },
  { icon: Orbit, title: 'Actúa', text: 'Con esa información generamos experiencias en el espacio: académicas, comerciales y sensoriales.' },
]

const navLinks = [
  { href: '#encuestas', label: 'Encuestas' },
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
]

export default async function Home() {
  const surveys = await getPublishedForms()

  return (
    <main className="min-h-screen overflow-x-clip bg-brand text-primary-foreground">
      <SiteHeader links={navLinks} />
      <section id="top" className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:pb-36 lg:pt-24">
        <div className="absolute right-[-10%] top-12 -z-0 size-80 rounded-full border border-accent/20" />
        <div className="relative z-10">
          <p className="mb-7 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-accent">
            <Sparkles size={15} /> Estudio de diseño y experiencias
          </p>
          <h1 className="max-w-4xl text-balance font-sans text-6xl font-semibold leading-[.95] tracking-[-0.07em] sm:text-8xl">
            Dale forma a lo que <span className="text-accent">todavía no ves.</span>
          </h1>
          <p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-primary-foreground/75">
            Escuchamos primero. Con lo que recolectamos en las encuestas diseñamos entornos que no solo se ven bien: se sienten.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#encuestas" className="rounded-full bg-card px-6 py-3 text-sm font-medium text-card-foreground transition-transform hover:-translate-y-0.5">
              Ver encuestas <ChevronRight className="ml-1 inline" size={16} />
            </a>
            <a href="#experiencia" className="rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium">
              Conocer SpaceBox
            </a>
          </div>
        </div>
        <RoundedImage
          src="/espacio-silla.jpeg"
          alt="Silla terracota entre plantas, con un libro abierto sobre el asiento"
          className="relative z-10 min-h-[330px] w-full lg:min-h-[420px]"
        />
      </section>

      <section id="encuestas" className="border-y border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">La base de cada experiencia</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Encuestas abiertas</h2>
            <p className="mt-4 text-lg leading-8 text-primary-foreground/75">
              De acá salen las señales para lo que viene. Cada respuesta nos ayuda a imaginar, más adelante, experiencias a medida.
            </p>
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

      <section id="camino" className="border-b border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-12 max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">De la escucha al espacio</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Recolectar.<br />Comprender. Actuar.
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

      <ExperienceSection />
      <EssenceSection />
      <TeamSection />
      <ContactSection />
    </main>
  )
}
