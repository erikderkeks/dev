'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, ExternalLink, Copy, Check } from 'lucide-react'
import { useLang } from '@/contexts/lang-context'
import { useToast } from '@/contexts/toast-context'
import { i18n } from '@/data/i18n'
import { contact } from '@/data/contact'

function LinkedinIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    )
}

type ContactItemProps = {
    icon: React.ReactNode
    label: string
    value: string
    href?: string
    copyValue?: string
}

function ContactItem({ icon, label, value, href, copyValue }: ContactItemProps) {
    const { lang } = useLang()
    const { showToast } = useToast()
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!copyValue) return
        try {
            await navigator.clipboard.writeText(copyValue)
            setCopied(true)
            showToast(`${i18n['contact.copy'][lang]} — ${copyValue}`, 'success')
            setTimeout(() => setCopied(false), 2000)
        } catch { /* noop */ }
    }

    return (
        <div className="contactItem glass">
            <div className="contactItemIcon">{icon}</div>
            <div className="contactItemBody">
                <div className="contactItemLabel">{label}</div>
                <div className="contactItemValue">{value}</div>
            </div>
            <div className="contactItemActions">
                {copyValue && (
                    <button
                        className="pill contactCopyBtn"
                        onClick={handleCopy}
                        aria-label={i18n['contact.copy'][lang]}
                        title={i18n['contact.copy'][lang]}
                    >
                        {copied ? <Check className="icon" style={{ width: 14, height: 14 }} /> : <Copy className="icon" style={{ width: 14, height: 14 }} />}
                    </button>
                )}
                {href && (
                    <a
                        className="pill contactLinkBtn"
                        href={href}
                        target={href.startsWith('mailto') ? undefined : '_blank'}
                        rel={href.startsWith('mailto') ? undefined : 'noreferrer'}
                        aria-label={`Open ${label}`}
                    >
                        <ExternalLink className="icon" style={{ width: 14, height: 14 }} />
                    </a>
                )}
            </div>
        </div>
    )
}

export function ContactCard() {
    const { lang } = useLang()

    return (
        <motion.div
            className="contactCard"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
        >
            <p className="contactTagline">{i18n['contact.open'][lang]}</p>
            <div className="contactGrid">
                <ContactItem
                    icon={<Mail style={{ width: 20, height: 20, opacity: 0.7 }} />}
                    label="Email"
                    value={contact.email}
                    href={`mailto:${contact.email}`}
                    copyValue={contact.email}
                />
                <ContactItem
                    icon={<Github style={{ width: 20, height: 20, opacity: 0.7 }} />}
                    label="GitHub"
                    value="@erikderkeks"
                    href={contact.github}
                />
                {contact.linkedin && (
                    <ContactItem
                        icon={<LinkedinIcon />}
                        label="LinkedIn"
                        value={contact.linkedin.replace('https://linkedin.com/in/', '')}
                        href={contact.linkedin}
                        copyValue={contact.linkedin}
                    />
                )}
                {contact.xing && (
                    <ContactItem
                        icon={<ExternalLink style={{ width: 20, height: 20, opacity: 0.7 }} />}
                        label="Xing"
                        value={contact.xing.replace('https://xing.com/profile/', '')}
                        href={contact.xing}
                        copyValue={contact.xing}
                    />
                )}
            </div>
        </motion.div>
    )
}
