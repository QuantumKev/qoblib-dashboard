import { Link } from 'react-router-dom'

type Props = {
  className?: string
  linkHome?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function QggLogo({ className = '', linkHome = true, size = 'md' }: Props) {
  const scale = size === 'sm' ? 'max-h-8' : size === 'lg' ? 'max-h-14' : 'max-h-10'
  const img = (
    <img
      src={`${import.meta.env.BASE_URL}qgg-logo.svg`}
      alt="Quantum Global Group — q∞GG"
      className={`${scale} w-auto ${className}`}
    />
  )

  if (linkHome) {
    return (
      <Link to="/" className="inline-block shrink-0" aria-label="Quantum Global Group home">
        {img}
      </Link>
    )
  }
  return img
}
