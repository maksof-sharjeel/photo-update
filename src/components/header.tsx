import {
  Bell,
  Menu
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc-server/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../assets/Images/logo.png";
import { UseMediaQuery } from "./hooks/useMediaQuery";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface HeaderProp {
  onMenuClick: () => void;
  totalEarnings: number;
}
const Header = () => {
  const router = useRouter();
  const notification: any = [];
  function handleNotificationClick(item: any) { }
  const isMobile = UseMediaQuery("(max-width: 768px)");
  const { mutateAsync: logoutUser, isLoading } =
    api.userAuth.logout.useMutation();
  return (
    <header className="w-full bg-white flex border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 w-full">
        <div className="flex items-center justify-between px-4">
          <Button variant="ghost" size={"icon"}>
            <Menu color="#15803D" className="h-8 w-8" />
          </Button>
          <Link href="/dashboard" className="flex items-center ml-3">
            <Image src={logo} alt="" width={60} />
            {!isMobile ? (
              <span className="font-bold text-[23px] text-[#15803D]">
                User Management System
              </span>
            ) : <span className="text-2xl font-semibold	 text-[#15803D]" >WMS</span>}
          </Link>
        </div>

        <div className="flex items-center">
          <div className="ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                    />
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  Waqar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-medium">
                  <Link href={"/user-profile"}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-medium">
                  <Link href={"/auth/setting"}>Setting</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-medium">
                  <Button onClick={async () => {

                    const token = localStorage.getItem('sessionToken');
                    if (token) {
                      await logoutUser({
                        sessionToken: token
                      })
                      router.push('/auth/login')
                    }
                  }}>
                    Sign out
                  </Button>

                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
