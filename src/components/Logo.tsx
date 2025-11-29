import logoSvg from '../assets/logo.svg'

type Props = {
  className?: string
}

export default function Logo({ className = 'size-8' }: Props) {
  return <img src={logoSvg} alt="CFOP Guide" className={`rounded-sm ${className}`} />
}
