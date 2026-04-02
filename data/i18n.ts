export const i18n = {
    // Nav
    'nav.projects':  { de: 'Projekte',  en: 'Projects' },
    'nav.github':    { de: 'GitHub',    en: 'GitHub'   },
    'nav.contact':   { de: 'Kontakt',   en: 'Contact'  },
    'nav.cv':        { de: 'Lebenslauf', en: 'CV'      },

    // Hero
    'hero.available':   { de: 'Verfügbar',       en: 'Available'     },
    'hero.unavailable': { de: 'Nicht verfügbar', en: 'Not available' },
    'hero.focus.title': { de: 'Fokus',           en: 'Focus'         },
    'hero.focus.text1': { de: 'Systeme bauen, die erhalten werden wollen.', en: 'Building systems worth maintaining.' },
    'hero.focus.text2': { de: 'Von Hobby-Projekten bis zur Produktion.',    en: 'From hobby projects to production grade.' },
    'hero.sig.title':   { de: 'Devise',          en: 'Signature'     },
    'hero.sig.text':    { de: '„Klein liefern. Unaufhörlich verfeinern."', en: '"Ship small. Refine relentlessly."' },

    // GitHub live sections
    'signals.title':      { de: 'Signale',              en: 'Signals'                     },
    'signals.sub':        { de: 'Minimal, maximal klar', en: 'Minimal stats, maximum clarity' },
    'signals.refreshing': { de: 'wird aktualisiert…',   en: 'refreshing…'                 },
    'signals.updated':    { de: 'aktualisiert',         en: 'updated'                     },
    'projects.title':     { de: 'Public Work',          en: 'Public Work'             },
    'projects.sub':       { de: 'Auswahl von GitHub',   en: 'Selected from GitHub'    },

    // Page sections
    'activity.title':  { de: 'Aktivität',          en: 'Activity'                    },
    'activity.sub':    { de: 'GitHub + Azure DevOps', en: 'GitHub + Azure DevOps'   },
    'langs.title':     { de: 'Programmiersprachen', en: 'Languages'                  },
    'langs.sub':       { de: 'GitHub & Azure DevOps', en: 'GitHub & Azure DevOps'   },
    'wrapped.title':   { de: 'Jahresrückblick',    en: 'Wrapped'                     },
    'wrapped.sub':     { de: 'Statistiken auf einen Blick', en: 'Year in stats'     },
    'now.title':       { de: 'Projekte',          en: 'Projects'                    },
    'now.sub':         { de: 'Was ich gerade baue', en: "What I'm building"          },
    'notes.title':     { de: 'Notizen',            en: 'Notes'                       },
    'notes.sub':       { de: 'Kurze technische Gedanken', en: 'Short technical thoughts' },
    'timeline.title':  { de: 'Werdegang',          en: 'Timeline'                    },
    'timeline.sub':    { de: 'Erfahrung & Meilensteine', en: 'Experience & milestones' },
    'uses.title':      { de: 'Tools',              en: 'Uses'                        },
    'uses.sub':        { de: 'Hardware & Werkzeuge', en: 'Hardware & tools'          },
    'stack.title':     { de: 'Stack',              en: 'Stack'                       },
    'stack.sub':       { de: 'Mein bevorzugtes Toolset', en: 'Tools I like to ship with' },
    'contact.title':   { de: 'Kontakt',            en: 'Contact'                     },
    'contact.sub':     { de: 'Erreichbarkeit',     en: 'Reach out'                   },

    // Contact card
    'contact.open':    { de: 'Offen für interessante Projekte.', en: 'Open to interesting projects.' },
    'contact.copy':    { de: 'Kopiert!',           en: 'Copied!'                     },
    'contact.email':   { de: 'E-Mail kopieren',    en: 'Copy email'                  },

    // Wrapped card stat labels
    'wrapped.commits':      { de: 'Commits',          en: 'Commits'           },
    'wrapped.topLang':      { de: 'Top-Sprache',      en: 'Top language'      },
    'wrapped.busiestMonth': { de: 'Aktivster Monat',  en: 'Busiest month'     },
    'wrapped.streak':       { de: 'Längste Serie',    en: 'Longest streak'    },
    'wrapped.busiestDay':   { de: 'Aktivster Tag',    en: 'Busiest weekday'   },
    'wrapped.days':         { de: 'Tage',             en: 'days'              },
    'wrapped.noData':       { de: '—',                en: '—'                 },

    // Footer
    'footer.copy': { de: 'Offen für interessante Projekte.', en: 'Open to interesting projects.' },

    // WakaTime
    'wakatime.title': { de: 'Coding-Zeit',   en: 'Coding Time'        },
    'wakatime.sub':   { de: 'Letzte 7 Tage via WakaTime', en: 'Last 7 days via WakaTime' },
} as const

export type I18nKey = keyof typeof i18n
