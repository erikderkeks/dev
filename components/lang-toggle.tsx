'use client'

import { useLang, type Lang } from '@/contexts/lang-context'

const OPTIONS: { value: Lang; label: string; native: string }[] = [
    { value: 'de', label: 'DE', native: 'Deutsch' },
    { value: 'en', label: 'EN', native: 'English' },
]

export function LangToggle() {
    const { lang, setLang } = useLang()

    return (
        <div className="langToggleWrap">
            <button
                className="pill langToggleBtn"
                aria-label="Select language"
                aria-haspopup="listbox"
            >
                {lang.toUpperCase()}
                <span className="langToggleChevron" aria-hidden="true">▾</span>
            </button>

            <div className="langDropdown" role="listbox" aria-label="Language">
                {OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        role="option"
                        aria-selected={lang === opt.value}
                        className={`langOption${lang === opt.value ? ' active' : ''}`}
                        onClick={() => setLang(opt.value)}
                    >
                        <span className="langOptionCode">{opt.label}</span>
                        <span className="langOptionNative">{opt.native}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
