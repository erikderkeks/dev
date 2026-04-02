export type UsesCategory = {
  category: string
  items: { name: string; detail?: string }[]
}

export const uses: UsesCategory[] = [
  {
    category: 'Hardware',
    items: [
      { name: 'Custom Desktop PC', detail: 'Intel Ultra 9, RTX 5090, 64GB RAM' },
      { name: 'Testbench', detail: 'Raspberry PI 5 16GB RAM' },
      { name: 'Monitors', detail: '2× 27" 4k 360Hz + 1× 49" 4k 360Hz' },
      { name: 'Keyboard', detail: 'Wooting 60HE + Logitech MX Keys' },
    ],
  },
  {
    category: 'Editor & Terminal',
    items: [
      { name: 'VS Code', detail: 'primary editor' },
      { name: 'Visual Studio', detail: 'C# / .NET' },
      { name: 'Windows Terminal + PowerShell' },
      { name: 'WSL2 (Ubuntu)' },
    ],
  },
  {
    category: 'Dev Tools',
    items: [
      { name: 'Git + GitHub' },
      { name: 'Azure DevOps', detail: 'CI/CD & boards' },
      { name: 'Docker Desktop' },
      { name: 'Postman / Bruno' },
      { name: 'HeidiSQL', detail: 'DB GUI' },
    ],
  },
  {
    category: 'Stack',
    items: [
      { name: 'TypeScript / Node.js', detail: 'primary language' },
      { name: 'React / Next.js' },
      { name: 'Azure Functions + IoT Edge' },
      { name: 'MySQL / MSSQL' },
    ],
  },
  {
    category: 'Services',
    items: [
      { name: 'Azure', detail: 'cloud platform' },
      { name: 'Cloudflare', detail: 'DNS & proxy' },
      { name: 'GitHub Actions', detail: 'CI/CD' },
    ],
  },
]
