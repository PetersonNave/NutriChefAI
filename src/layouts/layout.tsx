"use client";

import React, { ReactNode, useState } from 'react';
import '@/styles/layout.css';
import Sidebar from '@/components/sideBar';

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {

  const user = {
    name: "Pedro"
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-orange-50 to-white">
      
      <Sidebar />
    
      <main className="flex flex-col flex-1">
        {children}
      </main>
    </div>
  );
}