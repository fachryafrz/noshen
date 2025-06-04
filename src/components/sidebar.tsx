/* eslint-disable @next/next/no-img-element */
"use client";

import { SignOutButton, useClerk } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronsLeft,
  CirclePlus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const menu = [
  {
    icon: <Search className="size-5" />,
    title: "Search",
    onClick: () => {
      toast.info("Not implemented yet");
    },
  },
  {
    icon: <Settings className="size-5" />,
    title: "Settings",
    onClick: () => {
      toast.info("Not implemented yet");
    },
  },
  {
    icon: <CirclePlus className="size-5" />,
    title: "New page",
    onClick: () => {
      toast.info("Not implemented yet");
    },
  },
];

export default function Sidebar() {
  const { user } = useClerk();

  return (
    <aside className="bg-secondary/50 p-2 h-dvh group/sidebar overflow-y-auto relative flex flex-col w-60 z-50">
      {/* User */}
      <div className="flex">
        {/* User Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer grow justify-start"
            >
              <img src={user?.imageUrl} alt="" className="w-5 h-5 rounded" />
              {user?.username}
              <ChevronDown className="text-primary/50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              asChild
              variant="destructive"
              className="w-full cursor-pointer"
            >
              <SignOutButton>Log out</SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Collapse Toggle */}
        <Button
          variant={`ghost`}
          className="cursor-pointer opacity-0 transition-all group-hover/sidebar:opacity-100"
          size={"icon"}
          onClick={() => {
            toast.info("Not implemented yet");
          }}
        >
          <ChevronsLeft className="size-6 text-primary/50" />
        </Button>
      </div>

      <div className="space-y-2">
        {/* Menu */}
        <ul>
          {menu.map((item) => (
            <li key={item.title}>
              <Button
                variant={`ghost`}
                className="cursor-pointer w-full justify-start"
                onClick={item.onClick}
              >
                {item.icon}
                <span>{item.title}</span>
              </Button>
            </li>
          ))}
        </ul>

        {/* Documents */}
        <ul></ul>

        {/* Trash */}
        <Button
          variant={`ghost`}
          className="cursor-pointer w-full justify-start"
          onClick={() => {
            toast.info("Not implemented yet");
          }}
        >
          <Trash2 />
          Trash
        </Button>
      </div>

      {/* Resizable Handle */}
      <div className="opacity-50 hover:opacity-100 transition-all cursor-col-resize absolute h-full w-0.5 bg-primary/10 right-0 top-0 hover:w-1"></div>
    </aside>
  );
}
