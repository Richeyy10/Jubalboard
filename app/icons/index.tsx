import {
  ChevronDown,
  Search,
  Play,
  Network,
  Image,
  Headphones,
  Shirt,
  PenLine,
  Monitor,
  CalendarDays,
  Video,
  Scissors,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Wallet,
  Bell,
  User,
  Settings,
  LogOut,
  ListFilter,
  Star,
  BadgeCheck,
  TriangleAlert,
  ClipboardList,
  X,
  MessageCircle,
  UserCheck,
  UserSearch,
  GitMerge,
  ClipboardCheck,
  Users,
} from "lucide-react";

// General UI
export const ChevronDownIcon = ChevronDown;
export { ChevronDown };
export const SearchIcon = (props: any) => <Search size={18} stroke="white" {...props} />;
export const BlackSearchIcon = (props: any) => <Search size={18} stroke="black" {...props} />;
export const PlayIcon = (props: any) => <Play size={20} fill="white" stroke="white" {...props} />;
export const NetworkIcon = (props: any) => <Network size={48} stroke="#E2554F" {...props} />;
export const GitMergeIcon = (props: any) => <GitMerge size={48} stroke="#E2554F" {...props} />
export const ClipboardCheckIcon = (props: any) => <ClipboardCheck size={48} stroke="#E2554F" {...props} />
export const UsersIcon = (props: any) => <Users size={48} stroke="#E2554F" {...props} />

// Category Icons
export const ImageIcon = (props: any) => <Image size={40} stroke="#E85D3A" {...props} />;
export const HeadphonesIcon = (props: any) => <Headphones size={40} stroke="#E85D3A" {...props} />;
export const FashionIcon = (props: any) => <Shirt size={40} stroke="#E85D3A" {...props} />;
export const WritingIcon = (props: any) => <PenLine size={40} stroke="#E85D3A" {...props} />;
export const TechIcon = (props: any) => <Monitor size={40} stroke="#E85D3A" {...props} />;
export const EventIcon = (props: any) => <CalendarDays size={40} stroke="#E85D3A" {...props} />;
export const VideoIcon = (props: any) => <Video size={40} stroke="#E85D3A" {...props} />;
export const CraftsIcon = (props: any) => <Scissors size={40} stroke="#E85D3A" {...props} />;
export const EducationIcon = (props: any) => <GraduationCap size={40} stroke="#E85D3A" {...props} />;
export const DressIcon = (props: any) => <Shirt size={40} stroke="#E85D3A" {...props} />;

// Contact Icons
export const MapPinIcon = (props: any) => <MapPin size={18} stroke="white" {...props} />;
export const PhoneIcon = (props: any) => <Phone size={18} stroke="white" {...props} />;
export const MailIcon = (props: any) => <Mail size={18} stroke="white" {...props} />;

// Social Icons
export const FacebookIcon = (props: any) => <Facebook size={20} {...props} />;
export const InstagramIcon = (props: any) => <Instagram size={20} {...props} />;
export const XIcon = (props: any) => <Twitter size={20} {...props} />;
export const YoutubeIcon = (props: any) => <Youtube size={20} {...props} />;

// Dashboard / Nav Icons
export const DashboardIcon = (props: any) => <LayoutDashboard size={18} {...props} />;
export const HireIcon = (props: any) => <UserSearch size={18} {...props} />;
export const DeskIcon = (props: any) => <Briefcase size={18} {...props} />;
export const MessagesIcon = (props: any) => <MessageSquare size={18} {...props} />;
export const WalletIcon = (props: any) => <Wallet size={18} {...props} />;
export const FavoritesIcon = (props: any) => <UserCheck size={18} {...props} />;
export const NotificationsIcon = (props: any) => <Bell size={18} {...props} />;
export const ProfileIcon = (props: any) => <User size={18} {...props} />;
export const SettingsIcon = (props: any) => <Settings size={18} {...props} />;
export const LogoutIcon = (props: any) => <LogOut size={18} {...props} />;
export const BellIcon = (props: any) => <Bell size={20} stroke="#374151" {...props} />;
export const GearIcon = (props: any) => <Settings size={20} stroke="#374151" {...props} />;
export const FilterIcon = (props: any) => <ListFilter size={16} stroke="#E85D3A" {...props} />;

// Misc
export const StarIcon = (props: any) => <Star size={13} fill="#F59E0B" stroke="#F59E0B" {...props} />;
export const VerifiedIcon = (props: any) => <BadgeCheck size={14} fill="#3B82F6" {...props} />;
export const AlertIcon = (props: any) => <TriangleAlert size={22} stroke="#E85D3A" {...props} />;
export const BriefcaseIcon = (props: any) => <Briefcase size={48} stroke="#e2554f" {...props} />;
export const ClipboardIcon = (props: any) => <ClipboardList size={48} stroke="#e2554f" {...props} />;
export const CloseIcon = (props: any) => <X size={16} stroke="black" {...props} />;
export const MessageCircleIcon = (props: any) => <MessageCircle size={18} stroke="#6B7280" {...props} />;

// Custom Logo — no lucide equivalent
export const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="15" stroke="#E85D3A" strokeWidth="2" />
    <circle cx="16" cy="10" r="4" fill="#E85D3A" />
    <circle cx="10" cy="22" r="3" fill="#2563EB" />
    <circle cx="22" cy="22" r="3" fill="#16A34A" />
    <line x1="16" y1="14" x2="10" y2="19" stroke="#6B7280" strokeWidth="1.5" />
    <line x1="16" y1="14" x2="22" y2="19" stroke="#6B7280" strokeWidth="1.5" />
  </svg>
);

export const CheckSquares = (props: any) => (
  <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M32 32H0V0H24.5333V3.2H3.2V28.8H29.8667V17.0667H33.0667V32H32ZM5.97333 15.44L8.38267 13.0307L15.612 20.26L33.852 2.02L36.2667 4.424L15.612 25.0787L5.97333 15.44Z" fill="white" />
  </svg>
);

export const PendingPitches = (props: any) => (
  <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
<path d="M33 0H13.5C11.85 0 10.5 1.35 10.5 3V16.5C10.5 17.2956 10.8161 18.0587 11.3787 18.6213C11.9413 19.1839 12.7044 19.5 13.5 19.5H33C34.665 19.5 36 18.165 36 16.5V3C36 2.20435 35.6839 1.44129 35.1213 0.87868C34.5587 0.31607 33.7957 0 33 0ZM33 16.5H13.5V5.505L23.25 10.5L33 5.505V16.5ZM23.25 7.965L13.5 3H33L23.25 7.965ZM7.5 16.5C7.5 16.755 7.545 16.995 7.575 17.25H1.5C0.672 17.25 0 16.575 0 15.75C0 14.925 0.672 14.25 1.5 14.25H7.5V16.5ZM4.5 2.25H7.575C7.545 2.505 7.5 2.745 7.5 3V5.25H4.5C3.675 5.25 3 4.575 3 3.75C3 2.925 3.675 2.25 4.5 2.25ZM1.5 9.75C1.5 8.925 2.175 8.25 3 8.25H7.5V11.25H3C2.175 11.25 1.5 10.575 1.5 9.75Z" fill="white"/>
</svg>
)

export const Money = (props:any) => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
<path d="M8.1 27C5.825 27 3.906 26.219 2.343 24.657C0.780001 23.095 -0.000999041 21.176 9.5908e-07 18.9C9.5908e-07 17.95 0.162501 17.025 0.487501 16.125C0.812501 15.225 1.275 14.4125 1.875 13.6875L7.2 7.275L4.65 2.175C4.4 1.675 4.419 1.1875 4.707 0.7125C4.995 0.2375 5.426 0 6 0H21C21.575 0 22.0065 0.2375 22.2945 0.7125C22.5825 1.1875 22.601 1.675 22.35 2.175L19.8 7.275L25.125 13.6875C25.725 14.4125 26.1875 15.225 26.5125 16.125C26.8375 17.025 27 17.95 27 18.9C27 21.175 26.2125 23.094 24.6375 24.657C23.0625 26.22 21.15 27.001 18.9 27H8.1ZM13.5 19.5C12.675 19.5 11.969 19.2065 11.382 18.6195C10.795 18.0325 10.501 17.326 10.5 16.5C10.499 15.674 10.793 14.968 11.382 14.382C11.971 13.796 12.677 13.502 13.5 13.5C14.323 13.498 15.0295 13.792 15.6195 14.382C16.2095 14.972 16.503 15.678 16.5 16.5C16.497 17.322 16.2035 18.0285 15.6195 18.6195C15.0355 19.2105 14.329 19.504 13.5 19.5ZM9.9375 6H17.0625L18.5625 3H8.4375L9.9375 6ZM8.1 24H18.9C20.325 24 21.5315 23.5065 22.5195 22.5195C23.5075 21.5325 24.001 20.326 24 18.9C24 18.3 23.8935 17.719 23.6805 17.157C23.4675 16.595 23.174 16.0885 22.8 15.6375L17.2875 9H9.75L4.2 15.6C3.825 16.05 3.5315 16.5625 3.3195 17.1375C3.1075 17.7125 3.001 18.3 3 18.9C3 20.325 3.494 21.5315 4.482 22.5195C5.47 23.5075 6.676 24.001 8.1 24Z" fill="#F9F9F9"/>
</svg>
)