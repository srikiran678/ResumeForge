import { ResumeData } from '@/data/types';

export const SAMPLE_PREVIEW_RESUME: ResumeData = {
  id: 'preview_sample',
  userId: 'sample_user',
  title: 'Full Stack Software Engineer',
  targetRole: 'Software Engineer',
  targetCompany: 'Google',
  basics: {
    name: 'Alex Chen',
    label: 'Software Engineer & Systems Builder',
    email: 'alex.chen@university.edu',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    url: 'https://alexchen.dev',
    summary: 'Curious full-stack software engineer with a strong foundation in distributed systems, modern web architecture, and algorithmic optimization. Proven record building reliable web platforms and automated data pipelines.',
    profiles: [
      { network: 'GitHub', username: 'alexchen', url: 'https://github.com/alexchen' },
      { network: 'LinkedIn', username: 'alex-chen', url: 'https://linkedin.com/in/alex-chen' }
    ]
  },
  education: [
    {
      id: 'edu_1',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      degree: 'B.S.',
      field: 'Computer Science',
      startDate: '2022',
      endDate: '2026',
      cgpa: '3.92',
      coursework: [
        'Data Structures',
        'Operating Systems',
        'Database Design',
        'Computer Architecture'
      ],
      qualification: 'B.S. Computer Science',
      board: 'University of California',
      year: '2022 - 2026',
      percentage: '3.92 GPA'
    }
  ],
  work: [
    {
      id: 'work_1',
      company: 'Stripe',
      position: 'Software Engineering Intern',
      location: 'San Francisco, CA',
      startDate: 'May 2025',
      endDate: 'Aug 2025',
      responsibilities: [
        'Architected idempotent retry queue in TypeScript and Redis, decreasing failed webhook delivery rates by 38%.',
        'Implemented distributed telemetry spans using OpenTelemetry, reducing P99 latency tracking from 140ms to 42ms.',
        'Authored comprehensive integration test suite with 94% code coverage across billing controllers.'
      ],
      technologies: ['TypeScript', 'Redis', 'OpenTelemetry', 'Node.js']
    },
    {
      id: 'work_2',
      company: 'TechFlow Systems',
      position: 'Software Engineering Intern',
      location: 'Berkeley, CA',
      startDate: 'Jan 2024',
      endDate: 'Apr 2025',
      responsibilities: [
        'Built automated benchmarking framework measuring microsecond allocations in Go and Rust.',
        'Co-authored technical design paper on lock-free bounded concurrent buffers.'
      ],
      technologies: ['Go', 'Rust', 'Linux']
    }
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'CloudMesh Distributed KV Engine',
      description: 'Distributed consensus key-value store with Raft protocol implementation.',
      technologies: ['Go', 'Raft', 'gRPC', 'Docker'],
      url: 'https://github.com/alexchen/cloudmesh',
      githubUrl: 'https://github.com/alexchen/cloudmesh',
      highlights: [
        'Engineered leader election and log replication logic passing Jepsen partition tests under high network latency.',
        'Benchmarked throughput at 48,000 writes/second across a 5-node cluster with zero data corruption.'
      ],
      date: '2025'
    },
    {
      id: 'proj_2',
      name: 'DevRadar Developer Analytics',
      description: 'Real-time telemetry and developer productivity dashboard.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      url: 'https://devradar.io',
      githubUrl: 'https://github.com/alexchen/devradar',
      highlights: [
        'Developed interactive analytics visualizers for commit velocity and PR review latency using D3 and Canvas.',
        'Adopted by 1,200+ university students and student open-source contributors.'
      ],
      date: '2024'
    }
  ],
  skills: [
    {
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'C/C++', 'SQL']
    },
    {
      category: 'Frameworks & Systems',
      items: ['React', 'Node.js', 'Next.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'Redis']
    },
    {
      category: 'DevOps & Tools',
      items: ['Docker', 'Kubernetes', 'AWS', 'Git', 'Linux', 'Vitest', 'CI/CD']
    }
  ],
  certificates: [
    {
      id: 'cert_1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2025',
      credentialUrl: 'https://aws.amazon.com'
    }
  ],
  achievements: [
    {
      id: 'ach_1',
      title: '1st Place – CalHacks (Top 1 of 650+ Teams)',
      organization: 'Major League Hacking',
      date: '2024',
      description: 'Awarded Grand Prize for building an accessible AI screen reader.'
    }
  ],
  hackathons: [
    {
      id: 'hack_1',
      name: 'CalHacks 11.0',
      organization: 'UC Berkeley',
      role: 'Lead Architect',
      date: 'Nov 2024',
      project: 'VisionBridge',
      technologies: ['Python', 'FastAPI', 'OpenAI', 'React'],
      achievement: '1st Place Winner',
      githubUrl: 'https://github.com/alexchen/visionbridge'
    }
  ],
  volunteering: [],
  declaration: {
    text: 'I hereby declare that all information stated above is accurate and true to the best of my knowledge.',
    place: 'San Francisco, CA',
    date: 'November 2026',
    signature: 'Alex Chen'
  },
  meta: {
    sectionOrder: ['summary', 'education', 'work', 'projects', 'skills', 'hackathons', 'achievements', 'certificates'],
    hiddenSections: [],
    fontFamily: 'Inter',
    fontSize: 'base',
    spacing: 'normal',
    lastModified: new Date().toISOString(),
    version: '1.0',
    template: 'classic'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
