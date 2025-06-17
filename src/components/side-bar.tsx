"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FolderKanban, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },

    {
      name: "Organizations",
      path: "/projects",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    { name: "Account", path: "/account", icon: <User className="w-5 h-5" /> },
  ];

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <span className="text-lg font-bold text-primary font-poppins italic">
          data classification
        </span>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center h-12 px-4 rounded-lg font-poppins font-medium text-gray-700 dark:text-gray-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
                    isActive &&
                      "bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-green-400"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-5 bg-primary dark:bg-green-400 rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Sheet */}
      {isMobile ? (
        <div className="fixed top-0 left-0 z-40 w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <div className="relative h-full">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>

          <span className="ml-4 text-lg font-bold text-primary font-poppins italic">
            data classification
          </span>
        </div>
      ) : (
        /* Desktop Sidebar */
        <aside className="fixed h-full w-[250px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm">
          <NavContent />
        </aside>
      )}
    </>
  );
}
