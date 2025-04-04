import React, { useState } from "react";
import { Card } from "@/components/card";
import IMGRender from "./img-render";

interface IMGselectorProps {
  imagesURLs: string[];
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>
}

export default function IMGselector({ imagesURLs, selectedImage, setSelectedImage }: IMGselectorProps) {
  if (!Array.isArray(imagesURLs) || imagesURLs.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      {!selectedImage ? (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            Escolha qual imagem utilizar como referência para receita
          </h2>

          <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100 py-2">
            {imagesURLs.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Opção ${index + 1}`}
                className="h-36 rounded-lg shadow-md cursor-pointer object-cover transition-all duration-300 hover:opacity-75 flex-shrink-0"
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </Card>
      ) : (
        <div className="relative" onClick={() => setSelectedImage(null)}>
          <IMGRender imageSrc={selectedImage}/>
        </div>
       
      )}
    </div>
  );
}