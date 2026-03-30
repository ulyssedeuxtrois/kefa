"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function PushPrompt() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "subscribed" | "denied" | "unsupported">("idle");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") setStatus("subscribed");
    else if (Notification.permission === "denied") setStatus("denied");
    const d = localStorage.getItem("push-dismissed");
    if (d) setDismissed(true);
  }, []);

  async function subscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sub.toJSON(), userId: user?.id || null }),
    });
    setStatus("subscribed");
  }

  async function handleClick() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await subscribe();
      } else {
        setStatus("denied");
      }
    } catch {
      setStatus("denied");
    }
  }

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("push-dismissed", "1");
  }

  if (dismissed || status === "unsupported" || status === "subscribed" || status === "denied") {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-50 flex items-start gap-3">
      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
        <Bell className="w-4 h-4 text-primary-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900">Nouveaux events à Nice</p>
        <p className="text-xs text-gray-500 mt-0.5">Active les alertes pour ne rien rater.</p>
        <button
          onClick={handleClick}
          className="mt-2 btn-primary text-xs py-1.5 px-3"
        >
          Activer les alertes
        </button>
      </div>
      <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(Array.from(rawData).map((c) => c.charCodeAt(0)));
}
