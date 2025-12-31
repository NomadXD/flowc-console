import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle,
  Code,
  Globe,
  Layers,
  LayoutDashboard,
  Monitor,
  Palette,
  Plus,
  Radio,
  Rocket,
  Server,
  Settings,
  Shield,
  UserCog,
  Wrench,
  Zap,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin User',
    email: 'admin@flowc.dev',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'FlowC Gateway',
      logo: Zap,
      plan: 'v2.0.0',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'API Management',
      items: [
        {
          title: 'APIs',
          url: '/apis',
          icon: Layers,
        },
        {
          title: 'Create API',
          url: '/apis/new',
          icon: Plus,
        },
        {
          title: 'Deployments',
          url: '/deployments',
          icon: Rocket,
        },
      ],
    },
    {
      title: 'Infrastructure',
      items: [
        {
          title: 'Gateways',
          url: '/gateways',
          icon: Server,
        },
        {
          title: 'Listeners',
          url: '/listeners',
          icon: Radio,
        },
        {
          title: 'Environments',
          url: '/environments',
          icon: Globe,
        },
      ],
    },
    {
      title: 'Tools',
      items: [
        {
          title: 'Validate Config',
          url: '/validate',
          icon: CheckCircle,
        },
      ],
    },
    {
      title: 'Policies & Rules',
      items: [
        {
          title: 'Mediation Policies',
          url: '/policies',
          icon: Shield,
        },
      ],
    },
    {
      title: 'Admin',
      items: [
        {
          title: 'Config Inspector',
          url: '/admin/config',
          icon: Code,
        },
        {
          title: 'Metrics & Stats',
          url: '/admin/metrics',
          icon: BarChart3,
        },
        {
          title: 'Health Monitor',
          url: '/admin/health',
          icon: Activity,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
      ],
    },
  ],
}
