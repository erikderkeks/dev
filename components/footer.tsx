import { Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="glass" style={{ padding: 18 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="kicker">Contact</div>
            <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.72)' }}>
              erik.oberbillig@sisag.ch
            </div>
            <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.46)' }}>
              Monochrome liquid glass · calm, sharp, minimal
            </div>
          </div>

          <div className="row">
            <a className="pill" href="https://github.com/erikderkeks" target="_blank" rel="noreferrer">
              <Github className="icon" />
              <span>GitHub</span>
            </a>
            <a className="pill" href="mailto:erik.oberbillig@sisag.ch">
              <Mail className="icon" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        © {new Date().getFullYear()} Erik Oberbillig
      </div>
    </footer>
  )
}
