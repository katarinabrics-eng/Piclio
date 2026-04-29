interface LogoProps {
  dark?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ dark = false, size = 'md' }: LogoProps) {
  const fontSize = size === 'sm' ? 15 : size === 'lg' ? 28 : 20
  const color = dark ? 'white' : '#1a1225'
  const subColor = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'

  return (
    <div>
      <div style={{ fontSize, fontWeight: 700, letterSpacing: '0.15em', color }}>PICLIO</div>
      <div style={{ fontSize: fontSize * 0.52, color: subColor, letterSpacing: '0.05em', marginTop: 1 }}>
        by Lucifera Studio
      </div>
    </div>
  )
}
