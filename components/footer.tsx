'use client'

import { T } from '@/components/t'

export function Footer() {
  return (
    <footer className="footer">
      <div style={{ textAlign: 'center', color: 'var(--muted2)' }}>
        © {new Date().getFullYear()} erikderkeks · <T id="footer.copy" />
      </div>
    </footer>
  )
}
