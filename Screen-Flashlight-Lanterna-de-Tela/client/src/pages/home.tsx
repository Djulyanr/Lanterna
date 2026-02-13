import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { COLORS } from "@/lib/constants";
import { Flashlight, Palette } from "lucide-react";

const MOSAIC_COLORS = [
  "#FF0000", "#FF4500", "#FF8C00", "#FFA500", "#FFD700", "#FFFF00",
  "#ADFF2F", "#7FFF00", "#00FF00", "#32CD32", "#00FA9A", "#00FFFF",
  "#00BFFF", "#1E90FF", "#0000FF", "#4B0082", "#8A2BE2", "#9400D3",
  "#9932CC", "#8B008B", "#FF00FF", "#FF1493", "#FF69B4", "#FFC0CB",
  "#FFFFFF", "#D3D3D3", "#808080", "#000000"
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [showMosaic, setShowMosaic] = useState(false);

  useEffect(() => {
    const lastColor = localStorage.getItem("lastColor");
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (lastColor && !hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
      const route = lastColor.startsWith('#') ? `/flashlight/${encodeURIComponent(lastColor)}` : `/flashlight/${lastColor}`;
      setLocation(route);
    } else {
      sessionStorage.setItem("hasVisited", "true");
    }
  }, [setLocation]);

  const handleColorClick = (colorValue: string, isHex: boolean = false) => {
    localStorage.setItem("lastColor", colorValue);
    const route = isHex ? `/flashlight/${encodeURIComponent(colorValue)}` : `/flashlight/${colorValue}`;
    setLocation(route);
  };

  if (showMosaic) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col">
        <div className="flex items-center justify-between mb-8 pt-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Palette className="w-6 h-6" /> Mosaico
          </h2>
          <button 
            onClick={() => setShowMosaic(false)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Voltar
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto w-full">
          {MOSAIC_COLORS.map((hex) => (
            <button
              key={hex}
              className="aspect-square rounded-md border shadow-sm hover:scale-110 active:scale-95 transition-transform"
              style={{ backgroundColor: hex }}
              onClick={() => handleColorClick(hex, true)}
              title={hex}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-8 pt-4 justify-center">
        <div className="bg-primary p-3 rounded-full shadow-lg">
          <Flashlight className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Lanterna
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto w-full flex-1 content-start">
        {COLORS.map((color) => (
          <Card
            key={color.id}
            className="cursor-pointer hover:scale-105 transition-transform duration-200 border-2 active:scale-95 shadow-md"
            onClick={() => handleColorClick(color.id)}
            style={{ backgroundColor: color.hex }}
          >
            <CardContent className="flex items-center justify-center h-24 sm:h-32 p-0">
              <span className={`text-xl font-bold ${color.textColor}`}>
                {color.name}
              </span>
            </CardContent>
          </Card>
        ))}

        <Card
          className="cursor-pointer hover:scale-105 transition-transform duration-200 border-2 active:scale-95 shadow-md relative overflow-hidden group"
          onClick={() => setShowMosaic(false)}
        >
          <div 
            className="absolute inset-0 opacity-50"
            style={{ 
              background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)' 
            }}
          />
          <CardContent 
            className="flex items-center justify-center h-24 sm:h-32 p-0 relative z-10"
            onClick={(e) => {
              e.stopPropagation();
              setShowMosaic(true);
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <Palette className="w-6 h-6 text-foreground" />
              <span className="text-xl font-bold text-foreground">
                Mosaico
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <p className="text-center text-muted-foreground text-sm mt-8 mb-4">
        Selecione uma cor ou explore o Mosaico
      </p>
    </div>
  );
}
