import { type Gateway } from '@/data/mock/flowc-data'
import { Server, Globe, MapPin } from 'lucide-react'

export const gatewayStatusStyles = new Map<Gateway['status'], string>([
  ['online', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['offline', 'bg-neutral-300/40 border-neutral-300'],
  [
    'degraded',
    'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-300',
  ],
])

export const regions = [
  {
    label: 'US East (N. Virginia)',
    value: 'us-east-1',
    icon: MapPin,
  },
  {
    label: 'US West (Oregon)',
    value: 'us-west-2',
    icon: MapPin,
  },
  {
    label: 'EU Central (Frankfurt)',
    value: 'eu-central-1',
    icon: Globe,
  },
  {
    label: 'Asia Pacific (Mumbai)',
    value: 'ap-south-1',
    icon: Globe,
  },
  {
    label: 'Local Development',
    value: 'local',
    icon: Server,
  },
] as const

export const gatewayStatuses = [
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Degraded', value: 'degraded' },
] as const
