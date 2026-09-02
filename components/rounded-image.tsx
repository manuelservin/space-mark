type RoundedImageProps = {
  src: string
  alt: string
  className: string
}

const DEFAULT_PROPS: RoundedImageProps = {
  src: '',
  alt: '',
  className: '',
}

export const RoundedImage = (props: RoundedImageProps) => {
  //? merge default attrs with attrs.
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }

  return (
    <div className={`relative overflow-hidden rounded-[2rem] ${attrs.className}`}>
      <img
        src={attrs.src}
        alt={attrs.alt}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  )
}
