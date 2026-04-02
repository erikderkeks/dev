export type Note = {
  date: string   // YYYY-MM-DD
  title: string
  body: string
  code?: { lang: string; content: string }
  tags?: string[]
}

/** Add notes top-to-bottom (newest first). */
export const notes: Note[] = [
  {
    date: '2026-03-28',
    title: 'Why I stopped using ORMs for small services',
    body: 'Raw SQL with typed results is faster to write, easier to debug, and produces less surprising queries. The abstraction cost is only worth it past a certain team size.',
    tags: ['backend', 'dx'],
  },
  {
    date: '2026-03-12',
    title: 'FiveM resource architecture patterns',
    body: 'Separating resource logic into event-driven micro-resources keeps the codebase modular. Each resource owns its state; cross-resource communication goes through a typed event bus.',
    code: {
      lang: 'lua',
      content: `-- event bus pattern
AddEventHandler('myResource:onAction', function(data)
  TriggerEvent('core:dispatch', { source = 'myResource', data = data })
end)`,
    },
    tags: ['fivem', 'architecture'],
  },
  {
    date: '2026-02-20',
    title: 'On building systems, not features',
    body: 'A feature solves one problem once. A system solves a class of problems repeatedly. The extra upfront cost almost always pays back within weeks.',
    tags: ['thinking'],
  },
]
