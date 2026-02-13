import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { COLORS } from "@/lib/constants";
import { ArrowLeft, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function FlashlightPage() {
  const [, params] = useRoute("/flashlight/:color");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const colorId = params?.color || "white";
  
  // Handle both preset IDs and hex codes
  let colorHex = "#FFFFFF";
  let textColor = "text-black";

  if (colorId.startsWith("#") || colorId.startsWith("%23")) {
    colorHex = decodeURIComponent(colorId);
    // Basic luminance check to decide text color
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    textColor = luminance > 0.5 ? "text-black" : "text-white";
  } else {
    const colorData = COLORS.find((c) => c.id === colorId) || COLORS[0];
    colorHex = colorData.hex;
    textColor = colorData.textColor;
  }

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    };

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } else {
          toast({
            title: "Aviso",
            description: "Seu navegador não suporta manter a tela ligada automaticamente.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error(`${err}`);
      }
    };

    enterFullscreen();
    requestWakeLock();

    const handleVisibilityChange = async () => {
      if (wakeLockRef.current !== null && document.visibilityState === "visible") {
        await requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    resetControlsTimeout();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.error(err));
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [toast]);

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleScreenClick = () => {
    resetControlsTimeout();
  };

  const handleBack = () => {
    setLocation("/");
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-between p-4 transition-colors duration-300 relative overflow-hidden"
      style={{ backgroundColor: colorHex }}
      onClick={handleScreenClick}
    >
      <div
        className={`absolute inset-x-0 top-0 p-4 flex justify-between items-start transition-opacity duration-500 z-50 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-xs font-medium flex items-center gap-2">
           <Sun className="w-4 h-4" />
           Aumente o brilho da tela
        </div>
      </div>

      <div
         className={`absolute inset-x-0 bottom-0 p-8 flex justify-center transition-opacity duration-500 z-50 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full h-16 w-16 bg-white/20 hover:bg-white/40 backdrop-blur-md border-2 border-white/30 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleBack();
          }}
        >
          <ArrowLeft className={`w-8 h-8 ${textColor === 'text-white' ? 'text-white' : 'text-black'}`} />
        </Button>
      </div>
    </div>
  );
}
