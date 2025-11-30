import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

export default function Privacy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Privacy policy for cubedup. Learn how we handle your data and protect your privacy."
        path="/privacy"
      />

      <header className="header-gradient text-center py-8">
        <h1 className="page-header-title">Privacy Policy</h1>
        <p className="page-header-subtitle">
          How we handle your data
        </p>
      </header>

      <main className="main-content-narrow">
        <div className="card p-8">
          <p className="text-sm text-slate-500 mb-6">Last updated: 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Information Collection</h2>
            <p className="body-text text-slate-600">
              This site uses Cloudflare Web Analytics to collect anonymous, aggregated usage data.
              This helps us understand how visitors use the site so we can improve it. No personal
              information is collected or stored.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Cookies</h2>
            <p className="body-text text-slate-600">
              This site does not use cookies for tracking or advertising. Cloudflare Web Analytics
              is privacy-focused and does not use cookies or collect personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Third-Party Services</h2>
            <p className="body-text text-slate-600">
              <strong>Cloudflare Web Analytics:</strong> We use Cloudflare's privacy-first analytics
              service which does not track individual users, does not use cookies, and does not
              collect personal information. It only provides aggregate statistics about page views
              and visitor counts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Data Storage</h2>
            <p className="body-text text-slate-600">
              This is a static website hosted on GitHub Pages. We do not operate servers that store
              user data. Any preferences you set (such as selected colors) are stored locally in
              your browser and never transmitted to us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Contact</h2>
            <p className="body-text text-slate-600">
              For questions about this privacy policy or the site, please open an issue on our
              GitHub repository.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <Link to="/" className="text-indigo-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
