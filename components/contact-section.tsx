import { RoundedImage } from '@/components/rounded-image'

export const ContactSection = () => {
  return (
    <section id="contacto" className="border-t border-primary-foreground/15">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Dejemos huella</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            ¿Estás listo para transformar la manera en que habitamos?
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-primary-foreground/75">
            Escuchamos con las encuestas. Después diseñamos la experiencia. Si querés empezar una conversación, escribinos.
          </p>
          <a
            href="mailto:space.mark.26@gmail.com"
            className="mt-8 inline-flex rounded-full bg-card px-6 py-3 text-sm font-medium text-card-foreground transition-transform hover:-translate-y-0.5"
          >
            space.mark.26@gmail.com
          </a>
        </div>
        <RoundedImage
          src="/materiales-ideas.jpeg"
          alt="Selección de materiales de diseño sobre estantes"
          className="aspect-[4/5] w-full"
        />
      </div>
      <footer>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-primary-foreground/15 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Space Mark</p>
          <p className="text-sm text-primary-foreground/75">Estudio de diseño y experiencias.</p>
        </div>
      </footer>
    </section>
  )
}
