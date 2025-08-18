
import {
  LayoutDashboard,
  GraduationCap,
  Heart,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Users,
  Banknote,
  PenSquare,
} from 'lucide-react';

export const studentMenuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Eligibility Quiz',
    href: '/eligibility-quiz',
    icon: GraduationCap,
  },
  {
    label: 'College Match',
    href: '/college-match',
    icon: Heart,
  },
  {
    label: 'Application',
    href: '/application',
    icon: FileText,
  },
  {
    label: 'Forum',
    href: '/forum',
    icon: MessageSquare,
  },
  {
    label: 'Appointments',
    href: '/appointments',
    icon: Calendar,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const adminMenuItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Applications',
    href: '/admin/applications',
    icon: FileText,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Payments',
    href: '/admin/payments',
    icon: Banknote,
  },
  {
    label: 'Content',
    href: '/admin/cms',
    icon: PenSquare,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];
