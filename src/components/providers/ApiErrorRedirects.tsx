"use client";

import { useEffect } from "react";

const destinations = {
  "maintenance:unauthorized": "/login",
  "maintenance:forbidden": "/acesso-negado",
  "maintenance:not-found": "/nao-encontrado",
  "maintenance:internal-error": "/erro",
  "maintenance:upstream-unavailable": "/indisponivel",
} as const;

export function ApiErrorRedirects({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    function redirect(event: Event) {
      const destination = destinations[event.type as keyof typeof destinations];
      if (!destination || window.location.pathname === destination) return;

      const redirectUrl = new URL(destination, window.location.origin);
      const currentPath = `${window.location.pathname}${window.location.search}`;

      redirectUrl.searchParams.set("returnTo", currentPath);

      window.location.assign(`${redirectUrl.pathname}${redirectUrl.search}`);
    }

    const eventNames = Object.keys(destinations) as Array<keyof typeof destinations>;
    eventNames.forEach((eventName) => window.addEventListener(eventName, redirect));

    return () => {
      eventNames.forEach((eventName) => window.removeEventListener(eventName, redirect));
    };
  }, []);

  return children;
}
