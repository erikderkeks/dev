export type TimelineEntry = {
  year: string
  title: string
  org?: string
  detail?: string
  type: 'work' | 'project' | 'education'
}

export const timeline: TimelineEntry[] = [
  {
    year: '2024 – now',
    title: 'Freelance Software Developer',
    org: 'Gastro Management Group',
    detail: 'Azure, IoT Edge, TypeScript, Angular, Azure, SQL, IOS/Android (apps in development).',
    type: 'project',
  },
  {
    year: '2023 – now',
    title: 'Software Developer',
    org: 'SISAG AG',
    detail: 'EFZ Applikationsentwickler. Azure IoT Edge, TypeScript, Angular, Azure, SQL.',
    type: 'education',
  },
  {
    year: '2023 – now',
    title: 'Freelance FiveM Developer',
    detail: 'Custom game server scripts, ESX framework, Lua + TypeScript.',
    type: 'project',
  },
  {
    year: '2021',
    title: 'First serious projects',
    detail: 'Started building FiveM resources and self-hosted services. First encounter with TypeScript.',
    type: 'project',
  },
  {
    year: '2019',
    title: 'Started coding',
    detail: 'HTML, CSS, small PHP sites. The beginning.',
    type: 'education',
  },
]
