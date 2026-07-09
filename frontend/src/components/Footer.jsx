import { Link } from 'react-router-dom'
import { Fish, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#080B10] border-t border-white/[0.06] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/35 flex items-center justify-center">
                <Fish className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">Marine<span className="text-sky-400">AI</span></span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              AI-powered marine organism classification using CNN deep learning and Gemini-generated educational content.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              {[
                ['/home',    'Home'],
                ['/predict', 'Predict'],
                ['/history', 'History'],
                ['/about',   'About'],
                ['/contact', 'Contact'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Built With</h3>
            <div className="flex flex-wrap gap-2 text-[10px]">
              {['React', 'FastAPI', 'TensorFlow', 'Gemini AI', 'Tailwind CSS', 'SQLite'].map((t) => (
                <span key={t} className="bg-white/[0.03] border border-white/[0.06] rounded px-2 py-0.5 text-gray-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500">
          <p>© {new Date().getFullYear()} Marine Life Recognition & Intelligent Marine Assistant. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:contact@marine-ai.app" className="hover:text-white transition-colors"><Mail className="w-4.5 h-4.5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Github className="w-4.5 h-4.5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4.5 h-4.5" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
