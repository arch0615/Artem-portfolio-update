import type { Position } from '../types'

/**
 * Work history shown in the Experience timeline. The timeline lists positions newest first (by start
 * month), so the order here doesn't matter. To add a role, add an entry; use `end: 'present'` for a
 * current one.
 */
export const positions: Position[] = [
  {
    id: 'coinbag',
    company: 'Coinbag',
    role: 'Senior Full Stack Engineer',
    start: '2020-11',
    end: '2025-10',
    location: 'Hong Kong, Hong Kong',
    summary:
      'As Senior Full Stack Engineer at Coinbag, I developed secure, scalable cryptocurrency applications, integrating AI to optimize business processes and enhance user experience.',
    highlights: [
      'Built AI-powered features for asset management, fraud detection, and market forecasting, improving decision-making and platform security.',
      'Developed scalable microservices using Node.js, TypeScript, and GraphQL.',
      'Integrated AI capabilities to automate financial processes and improve operational efficiency.',
      'Mentored junior developers and contributed to technical architecture and engineering best practices.',
    ],
    technologies: [
      'Node.js',
      'TypeScript',
      'GraphQL',
      'AI Integration',
      'Microservices',
      'Cryptocurrency',
      'Fraud Detection',
    ],
  },
  {
    id: 'alvys',
    company: 'Alvys',
    role: 'Full Stack Developer',
    start: '2016-03',
    end: '2020-11',
    location: 'California, United States',
    summary:
      'At Alvys, I helped develop and optimize a cloud-based Transportation Management System (TMS), enhancing platform functionality, implementing AI-driven automation, and integrating external services to improve user experience and operational efficiency.',
    highlights: [
      'Built full-stack solutions using React, Node.js, and Python.',
      'Integrated AI capabilities and more than 100 external APIs to optimize logistics workflows.',
      'Collaborated with engineering teams to improve platform functionality and system integrations.',
      'Mentored junior developers and contributed to technical development practices.',
      'Used Kubernetes and Docker to support scalable and efficient platform deployment.',
    ],
    technologies: [
      'React',
      'Node.js',
      'Python',
      'REST APIs',
      'AI Integration',
      'Kubernetes',
      'Docker',
      'Cloud Applications',
    ],
  },
  {
    id: 'giant-swarm',
    company: 'Giant Swarm',
    role: 'Backend Developer',
    start: '2012-03',
    end: '2016-03',
    location: 'Cologne, Germany',
    summary:
      'At Giant Swarm, I specialized in backend development, building scalable cloud services with a focus on AI automation and system optimization, delivering high-performance solutions for Kubernetes-based applications.',
    highlights: [
      'Developed scalable backend systems using Go, Python, and Node.js.',
      'Implemented AI automation and RESTful APIs.',
      'Optimized databases and backend services for cloud performance.',
      'Collaborated with DevOps teams on Kubernetes, Docker, CI/CD, and system optimization.',
      'Integrated AI capabilities into backend workflows and mentored junior developers.',
    ],
    technologies: ['Go', 'Python', 'Node.js', 'REST APIs', 'Kubernetes', 'Docker', 'CI/CD', 'Cloud Infrastructure'],
  },
]
