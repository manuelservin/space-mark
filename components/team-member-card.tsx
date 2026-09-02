type TeamMemberCardProps = {
  name: string
  role: string
  src: string
  alt: string
}

const DEFAULT_PROPS: TeamMemberCardProps = {
  name: '',
  role: '',
  src: '',
  alt: '',
}

export const TeamMemberCard = (props: TeamMemberCardProps) => {
  //? merge default attrs with attrs.
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }

  return (
    <figure className="group mx-auto w-full max-w-[16rem]">
      <div className="relative aspect-square w-full overflow-hidden rounded-full border-[5px] border-card shadow-[0_12px_30px_rgba(88,57,41,0.18)]">
        <img
          src={attrs.src}
          alt={attrs.alt}
          className="absolute inset-0 size-full object-cover object-[center_18%] transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <figcaption className="mt-4 text-center">
        <p className="text-lg font-medium tracking-tight text-foreground">{attrs.name}</p>
        <p className="mt-1 text-sm text-foreground/70">{attrs.role}</p>
      </figcaption>
    </figure>
  )
}
