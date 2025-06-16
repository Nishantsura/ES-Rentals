"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export default function CrispChat() {
  if (usePathname()?.includes('/admin')) return null;

  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "6f50da6f-17e3-44db-9542-5921d7d4adde";
    
    window.$crisp.push(
      ["safe", true],
      ["do", "chat:position", ["right"]],
      ["do", "chat:margin-bottom", [100]],
      ["do", "chat:size", ["small"]], 
      ["do", "trigger:button:width", [45]], 
      ["do", "trigger:button:height", [45]] 
    );

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
}
