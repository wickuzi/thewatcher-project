"use client";
import { Avatar, AvatarFallback } from "./ui/avatar";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {cn} from "@/lib/utils";
import Image from "next/image";
import { Session } from "next-auth";
import { getInitials } from "@/lib/utils";

const Header = ({session}: {session: Session}) => {

    const pathname = usePathname();

    return (
      // 💡 ARREGLO 1: Cambié my-10 por my-6 para reducir el espacio vertical de la cabecera.
      <header className="flex justify-between items-center gap-5 lg:my-4"> 
        <Link href="/">
          <Image 
            src="/images/thewatcher_logo.png" 
            alt="Logo" 
            width={200} 
            height={200} 
            className="w-24 h-auto lg:w-32" 
          />
        </Link>

        <ul className="flex flex-row items-center gap-5">
          <li>
            <Link href="/catalog" className={cn("text-base cursor-pointer capitalize", pathname === "/catalog" ? "text-light-200" : "text-light-100")}>
              Catalogo
            </Link>
          </li>
         
          <li>
            <Link href="/profile" className="text-base cursor-pointer capitalize">
            <Avatar>
              <AvatarFallback className="text-dark-100">{getInitials(session?.user?.name||"IN")}</AvatarFallback>
            </Avatar>
            </Link>
          </li>
        </ul>
      </header>
    );
};

export default Header;