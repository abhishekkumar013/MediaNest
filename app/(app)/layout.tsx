"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon, 
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  XIcon,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-base-100">
      {/* Sidebar for larger screens */}
      <aside className={`bg-base-200 w-64 fixed inset-y-0 left-0 transform ${isMobile ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 ease-in-out z-30 lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <ImageIcon className="w-10 h-10 text-primary" />
            <span className="ml-2 text-xl font-bold text-green-500">Abhishek</span>
          </div>
          {isMobile && (
            <button onClick={toggleSidebar} className="lg:hidden">
              <XIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        <nav className="mt-5">
          <ul className="space-y-2 px-4">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-white ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "hover:bg-base-300"
                  }`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {user && (
          <div className="absolute bottom-0 w-full p-4">
            <button
              onClick={handleSignOut}
              className="btn btn-outline btn-error w-full"
            >
              <LogOutIcon className="mr-2 h-5 w-5" />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        {/* Navbar */}
        <header className="bg-base-200 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                {isMobile && (
                  <button onClick={toggleSidebar} className="mr-2">
                    <MenuIcon className="w-6 h-6" />
                  </button>
                )}
                <Link href="/" onClick={handleLogoClick}>
                  <div className="text-2xl font-bold tracking-tight cursor-pointer text-white">
                    Abhishek 
                  </div>
                </Link>
              </div>
              {user && (
                <div className="flex items-center space-x-4 text-white">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={user.imageUrl}
                        alt={
                          user.username || user.emailAddresses[0].emailAddress
                        }
                      />
                    </div>
                  </div>
                  <span className="text-sm truncate max-w-[100px] sm:max-w-xs">
                    {user.username || user.emailAddresses[0].emailAddress}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}