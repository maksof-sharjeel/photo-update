import {
  Home,
  Images,
  MapIcon,
  MessageCircle
} from "lucide-react";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/manage-uploads", label: "Upload Photo", icon: MapIcon },
  { href: "/dashboard/add-comment", label: "Add Comments", icon: MessageCircle },
  { href: "/dashboard/gallery", label: "Gallery", icon: Images },
 ];

interface SidebarOpen {
  open: boolean;
}

const Sidebar = ({ open }: SidebarOpen) => {
  const pathName = usePathname();

  return (
    <aside
      className={`bg-white border-r pt-[90px] border-gray-200 w-64 text-gray-800 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
        false ? "translate-x-0" : "-translate-x-64"
      } lg:translate-x-0`}
    >
      <ul>
        {sidebarItems.map((item) => (
          <li key={item.href} className="flex items-center p-4">
            <item.icon className="w-5 h-5 mr-3" />
            <a
              href={item.href}
              className={`${
                pathName === item.href
                  ? "font-bold text-green-600"
                  : "hover:border-b-2 border-transparent hover:border-green-600 transition-all duration-200 ease-in-out"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
