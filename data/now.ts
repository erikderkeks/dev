export type NowEntry = {
  area: string
  text: string
  link?: string
}

/** Edit this to reflect what you're currently working on. */
export const nowEntries: NowEntry[] = [
  {
    area: 'Building',
    text: 'Chroniq, a self-hosted time tracking and journaling app. Built with Angular, Capacitor, Node.js, Apple VAS, Azure Functions and Azure SQL.',
    // link: 'https://github.com/erikderkeks/chroniq',
  },
  {
    area: 'Building',
    text: 'Gastro Management Portal, a web portal for managing restaurant operations. Built with Angular, Azure Functions, Azure SQL, and Azure AD with SwissBill support and Email Exports.',
    // link: 'https://...',
  },
  {
    area: 'Building',
    text: 'TIM Home Assistant, a custom Smart Home Integration with KI system to automate and optimize home operations. Built with React, Docker, OpenAI, Ollama, SwitchBot, Govee, Alexa, Shelly, Azure DevOps API, GitHub API, and Home Assistant.',
    // link: 'https://...',
  },
  {
    area: 'Maintaining',
    text: 'ScreenDeck, a CMS system for Digital Signage screens. Built with Angular, Azure Functions, Docker Kubernetes, Node.js, and Azure SQL. Used in 2+ restaurants across Switzerland.',
    link: 'https://www.screendeck.ch',
  },
  {
    area: 'Building',
    text: 'BiteBook, a recipe and meal planning app on IOS and Android. Built with Angular, ExpressJS, Azure SQL, and Auth0.',
    // link: 'https://...',
  },
  {
    area: 'Learning',
    text: 'Deeper IoT edge patterns — Azure IoT Hub device twins and message routing at scale.',
  },
]

/** true = available for freelance/projects, false = not available */
export const isAvailable = true
