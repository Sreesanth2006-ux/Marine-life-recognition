import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, User, Send, CheckCircle, Github, Linkedin, Fish } from 'lucide-react'
import toast from 'react-hot-toast'

const CONTACTS = [
  { icon: Mail,     label: 'Email',    value: 'contact@marine-ai.app',       href: 'mailto:contact@marine-ai.app' },
  { icon: Github,   label: 'GitHub',   value: 'github.com/marine-ai',         href: 'https://github.com' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/marine-ai',    href: 'https://linkedin.com' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, subject, message } = form
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all fields.'); return
    }
    setLoading(true)
    // Simulate sending (no real endpoint)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
    toast.success("Message sent! We'll get back to you soon. 🌊")
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-900 via-[#011f4b] to-ocean-800">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-ocean-600/20 border border-ocean-500/30 rounded-full px-4 py-1.5 mb-6">
            <MessageSquare className="w-4 h-4 text-ocean-300" />
            <span className="text-ocean-300 text-sm font-medium">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-ocean-300 text-lg max-w-xl mx-auto">
            Have a question, feedback, or collaboration idea? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="section pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact cards */}
          <div className="lg:col-span-2 space-y-4">
            {CONTACTS.map(({ icon: Icon, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 glass-card border border-ocean-700/30 hover:border-ocean-500/50 transition-all group block"
              >
                <div className="w-12 h-12 bg-ocean-600/20 rounded-xl flex items-center justify-center group-hover:bg-ocean-600/40 transition-colors">
                  <Icon className="w-6 h-6 text-ocean-400" />
                </div>
                <div>
                  <p className="text-ocean-400 text-xs">{label}</p>
                  <p className="text-white font-medium text-sm">{value}</p>
                </div>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="glass-card border border-ocean-700/30"
            >
              <Fish className="w-8 h-8 text-ocean-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Marine Life Recognition</h3>
              <p className="text-ocean-400 text-sm leading-relaxed">
                A capstone AI project built with passion for ocean conservation and marine biology education.
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-3 glass-card border border-ocean-600/30"
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-ocean-300 mb-6">Thank you for reaching out. We'll get back to you shortly.</p>
                <button onClick={() => setSuccess(false)} className="btn-ocean">Send Another</button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-ocean-300 text-sm font-medium mb-1.5">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-400" />
                        <input id="contact-name" type="text" value={form.name} onChange={set('name')}
                          className="input-ocean pl-10" placeholder="Jane Smith" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-ocean-300 text-sm font-medium mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-400" />
                        <input id="contact-email" type="email" value={form.email} onChange={set('email')}
                          className="input-ocean pl-10" placeholder="jane@example.com" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-ocean-300 text-sm font-medium mb-1.5">
                      Subject
                    </label>
                    <input id="contact-subject" type="text" value={form.subject} onChange={set('subject')}
                      className="input-ocean" placeholder="Question about the model…" />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-ocean-300 text-sm font-medium mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      className="input-ocean resize-none"
                      placeholder="Tell us what's on your mind…"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-ocean w-full py-3 disabled:opacity-60">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                      : <><Send className="w-4 h-4" />Send Message</>}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
