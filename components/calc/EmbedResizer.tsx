"use client";

import { useEffect } from "react";

function postHeight() {
  if (typeof window === "undefined") return;
  const height = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "yournetworth-embed-height", height }, "*");
}

export function EmbedResizer() {
  useEffect(() => {
    postHeight();
    const handleResize = () => postHeight();
    window.addEventListener("resize", handleResize);
    const observer = new ResizeObserver(() => postHeight());
    observer.observe(document.body);
    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);
  return null;
}
