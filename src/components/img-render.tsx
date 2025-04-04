import React, { useState } from "react";
import { Card } from "@/components/card";

interface IMGRenderProps {
  imageSrc: string;
}

export default function IMGRender({imageSrc}: IMGRenderProps) {
  return (
        <div className="relative">
          <img
            src={imageSrc}
            alt="Imagem selecionada"
            className="rounded-lg shadow-md cursor-pointer max-h-[300px] mx-auto"
          />
        </div>
   
  );
}