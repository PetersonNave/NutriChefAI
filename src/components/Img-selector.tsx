import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IMGselectorProps {
  imagesURLs: string[];
}

export default function IMGselector({ imagesURLs }: IMGselectorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!Array.isArray(imagesURLs) || imagesURLs.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      {!selectedImage ? (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Escolha qual imagem utilizar como referência para receita</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {imagesURLs.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Opção ${index + 1}`}
                className="cursor-pointer rounded-lg shadow-md hover:opacity-75 transition-all duration-300"
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </Card>
      ) : (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Imagem selecionada"
            className="rounded-lg shadow-md cursor-pointer"
            onClick={() => setSelectedImage(null)}
          />
        </div>
      )}
    </div>
  );
}
