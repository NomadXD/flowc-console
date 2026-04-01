import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle,
  Code,
  Eye,
  Layers,
  LayoutDashboard,
  Lock,
  Monitor,
  Network,
  Palette,
  Plus,
  Plug,
  Rocket,
  Server,
  Settings,
  Shield,
  ShieldCheck,
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
          title: 'Policy Engines',
          url: '/policy-engines',
          icon: ShieldCheck,
        },
        {
          title: 'Extensions',
          url: '/extensions',
          icon: Plug,
        },
        {
          title: 'Services',
          url: '/services',
          icon: Network,
        },
        {
          title: 'Certificates',
          url: '/certificates',
          icon: Lock,
        },
        {
          title: 'Secrets',
          url: '/secrets',
          icon: Shield,
        },
        {
          title: 'Observability',
          url: '/observability',
          icon: Eye,
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
          icon: ShieldCheck,
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
            {
              title: 'Gateway Profiles',
              url: '/settings/gateway-profiles',
              icon: Server,
            },
          ],
        },
      ],
    },
  ],
}
