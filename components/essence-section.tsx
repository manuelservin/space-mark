import { RoundedImage } from '@/components/rounded-image'

const PILLARS = [
  {
    title: 'Misión',
    text: 'Transformar entornos en experiencias sensoriales únicas que conecten a las personas con los espacios.',
  },
  {
    title: 'Visión',
    text: 'Ser una marca top of mind, referente en diseño de espacios y marketing de experiencias.',
  },
  {
    title: 'Valores',
    text: 'Creatividad, confianza, innovación y compromiso: el ADN de la comunidad de Económicas Lomas.',
  },
]

export const EssenceSection = () => {
  return (
    <section id="esencia" className="border-b border-primary-foreground/15">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Esencia de marca</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Space + Mark.<br />
              <span className="text-accent">Que se sienta.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/75">
              Space aporta la precisión técnica y la funcionalidad estratégica. Mark inyecta la identidad estética y una huella única. Diseñamos vivencias transformando los espacios: no solo para que se vean bien, sino para que se sientan.
            </p>
          </div>
          <RoundedImage
            src="/proceso-materiales.jpeg"
            alt="Mesa de trabajo con muestras de materiales, textiles y referencias de interiorismo"
            className="aspect-[4/3] w-full"
          />
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <article key={pillar.title} className="bg-card p-8 text-card-foreground">
              <h3 className="text-2xl font-medium">{pillar.title}</h3>
              <p className="mt-3 leading-7 text-card-foreground/70">{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
