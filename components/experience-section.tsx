import { RoundedImage } from '@/components/rounded-image'


export const ExperienceSection = () => {
  return (
    <section id="experiencia" className="border-b border-primary-foreground/15">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Experiencia Space</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Diseñamos el escenario donde las marcas y las personas se encuentran.
        </h2>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <article className="flex flex-col">
            <RoundedImage
              src="/proceso-sofa.jpeg"
              alt="Espacio de trabajo sobre un sofá, con luz natural"
              className="aspect-[4/3] w-full"
            />
            <h3 className="mt-6 text-2xl font-medium">Espacio académico</h3>
            <p className="mt-3 leading-7 text-primary-foreground/75">
              Una experiencia inmersiva como directores de marketing: los conceptos teóricos se llevan a la práctica profesional, con la impronta de nuestro branding.
            </p>
          </article>

          <article className="flex flex-col">
            <RoundedImage
              src="/espacio-trabajo.jpeg"
              alt="Mesa de trabajo con laptop, revistas y materiales de diseño"
              className="aspect-[4/3] w-full"
            />
            <h3 className="mt-6 text-2xl font-medium">SpaceBox</h3>
            <p className="mt-3 leading-7 text-primary-foreground/75">
              Diagnóstico + masterplan de espacios, o Smart Design Express. Un solo paquete para pasar de la lectura del lugar a un plan concreto.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
