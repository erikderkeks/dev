'use client'

import { useLang } from '@/contexts/lang-context'
import { i18n, type I18nKey } from '@/data/i18n'

/** Inline translation component — used inside server-component JSX. */
export function T({ id }: { id: I18nKey }) {
    const { lang } = useLang()
    return <>{i18n[id][lang]}</>
}
