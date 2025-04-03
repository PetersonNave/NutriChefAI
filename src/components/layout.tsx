"use client";

import React, { ReactNode, useState } from 'react';
import '../Styles/layout.css';
import { Card, CardContent } from "@/components/card";
import { ScrollArea } from "@/components/scroll-area";
import Sidebar from './sideBar';

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(["Receita 1"]);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-orange-50 to-white">
      
      <Sidebar />

      <div className="flex flex-col flex-1">{children}</div>

    </div>
  );
}