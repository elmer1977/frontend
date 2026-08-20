import axios from "axios";
import { server } from "../server";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerPushSubscription = async (authType = "user") => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return;
    }

    const { data } = await axios.get(`${server}/${authType}/vapid-public-key`);
    const publicKey = data.publicKey;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await axios.post(
      `${server}/${authType}/subscribe`,
      { subscription },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Push registration failed", error);
  }
};
