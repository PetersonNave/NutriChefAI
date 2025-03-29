import React, { ReactNode } from 'react';
import SideBar from '@/components/sideBar'; // Importando com a convenção PascalCase (opcional)
import  '@/styles/layout.css';
import { Card, CardContent } from "@/components/card";
import { ScrollArea } from "@/components/scroll-area";
import { useState } from "react";


type Props = {children: ReactNode;};

export default function Layout({ children }: Props) {

  const [input, setInput] = useState("");
  const [history, setHistory] = useState(["Receita 1",]);
  
  
  return ( 
    <div className="flex h-screen w-full">

      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r flex flex-col">
        <h2 className="text-lg font-bold mb-4">Histórico</h2>
        <ScrollArea className="space-y-2 flex-1">
          {history.map((chat, index) => (
            <Card key={index} className="cursor-pointer hover:bg-gray-300 transition">
              <CardContent className="p-3 text-sm font-medium">
                {chat}
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>

      <div className="flex flex-col flex-1">{children}</div>


    </div>
  );
}
