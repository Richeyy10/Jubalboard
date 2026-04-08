"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, Briefcase, Send, MessageSquare,
  DollarSign, ArrowLeftRight, Users, GitMerge, Star,
  BookOpen, User, Bell, Settings, LogOut,
} from "lucide-react";
import { Client, Collab, Dashboard, Earnings, Feedback, Find, Gigs, Learning, Logs, Messages, Notifs, Pitches, Profile, Settingss, Support, Transactions } from "@/app/icons";

const navItems = [
  { label: "Dashboard", path: "/creative/dashboard", icon: Dashboard },
  { label: "Find Gigs", path: "/creative/find-gigs", icon: Find },
  { label: "My Gigs", path: "/creative/my-gigs", icon: Gigs },
  { label: "My Pitches", path: "/creative/my-pitches", icon: Pitches },
  { label: "Messages", path: "/creative/messages", icon: Messages },
  { label: "My Earnings", path: "/creative/my-earnings", icon: Earnings },
  { label: "Transactions", path: "/creative/transactions", icon: Transactions },
  { label: "Client Fam", path: "/creative/client-fam", icon: Client },
  { label: "Collab Hub", path: "/creative/collab-hub", icon: Collab },
  { label: "Feedbacks", path: "/creative/feedbacks", icon: Feedback },
  { label: "Learning Hub", path: "/creative/learning-hub", icon: Learning },
  { label: "My Profile", path: "/creative/my-profile", icon: Profile },
];

const bottomItems = [
  { label: "Notifications", path: "/creative/notifications", icon: Notifs },
  { label: "Support", path: "/creative/support", icon: Support },
  { label: "Settings", path: "/creative/settings", icon: Settingss },
  { label: "Log out", path: "/onboarding", icon: Logs },
];

interface SidebarProps {
  activeItem: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem }) => {
  const pathname = usePathname();
  return (
    <div className="w-[200px] lg:w-[300px] h-full h-screen bg-[#fafafa] border-r border-[#f0f0f0] pt-8 lg:pt-5 flex flex-col overflow-y-auto justify-center lg:justify-start lg:pt-10 lg:pl-10">
      <div>
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-5 py-[3px] text-md lg:text-2xl transition-all duration-150
                ${isActive
                  ? "text-[#E2554F] font-semibold"
                  : "text-gray-700 font-normal hover:text-[#e2554f]"
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div>
        {bottomItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-5 py-[3px] text-md lg:text-2xl transition-all duration-150
                ${isActive
                  ? "text-[#e2554f] font-semibold"
                  : "text-gray-700 font-normal hover:text-[#e2554f]"
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;