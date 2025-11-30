import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="page-footer">
      <p>&copy; 2025 cubedup</p>
      <Link
        to="/privacy"
        className="text-sm text-slate-500 hover:text-indigo-600 transition-colors mt-1 inline-block"
      >
        Privacy Policy
      </Link>
    </footer>
  )
}
