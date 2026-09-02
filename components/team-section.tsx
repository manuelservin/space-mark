import { TeamMemberCard } from '@/components/team-member-card'

type TeamMember = {
  name: string
  role: string
  src: string
}

const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Karina', role: 'Aromas', src: '/Karina.jpeg' },
  { name: 'Manuel', role: 'Responsable de obra', src: '/Manuel.jpeg' },
  { name: 'Martín', role: 'Director creativo', src: '/Martín.jpeg' },
  { name: 'Nahuel', role: 'Finanzas', src: '/Nahuel.jpeg' },
  { name: 'Natalia', role: 'Comunicación', src: '/Natalia.jpeg' },
  { name: 'Natalia', role: 'Interiorismo', src: '/Natalia2.jpeg' },
  { name: 'Noelia', role: 'Iluminación', src: '/Noelia.jpeg' },
]

export const TeamSection = () => {
  return (
    <section id="nosotros" className="relative overflow-hidden">
      {/* Fondo a rayas de la marca */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/fondo.jpeg')] bg-repeat bg-[length:340px]"
      />
      {/* Velo crema para leer el título sin perder el patrón */}
      <div aria-hidden="true" className="absolute inset-0 bg-background/55" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <h2 className="text-center text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
          ¿Quiénes somos?
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-foreground/80">
          En Space Mark diseñamos entornos y experiencias que trascienden con la fuerza del marketing. Nacidos en el corazón de Económicas Lomas, creamos vivencias que transforman cómo las personas conectan con su entorno.
        </p>
        <ul className="mx-auto mt-16 flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-12">
          {TEAM_MEMBERS.map((member) => (
            <li key={member.src} className="w-[calc(50%-0.75rem)] min-w-0 sm:w-[calc(33.333%-1rem)] lg:w-[13.5rem]">
              <TeamMemberCard
                name={member.name}
                role={member.role}
                src={member.src}
                alt={`Retrato de ${member.name}, ${member.role}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
