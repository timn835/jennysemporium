"use client";

import { User } from "@/payloadTypes";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const UserAccountNav = ({ user }: { user: User }) => {
  const [open, setIsOpen] = useState<boolean>(false);
  const { signOut } = useAuth();
  return (
    <DropdownMenu onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button
          variant="ghost"
          size="sm"
          className={cn("relative hover:bg-teal-100", { "bg-teal-100": open })}
        >
          My account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-black">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/sell">Seller Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
