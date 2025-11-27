"use client";
import { useEffect } from "react";

export default function MessengerButton() {
  useEffect(() => {
    const pageLink = "https://m.me/830983013435196";
    const btn = document.getElementById("fb-chat-btn");

    if (!btn) return;

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();

      if (window.innerWidth > 600) {
        const w = 420;
        const h = 700;
        const left = window.screen.width / 2 - w / 2;
        const top = window.screen.height / 2 - h / 2;

        window.open(
          pageLink,
          "fbmsg",
          `width=${w},height=${h},left=${left},top=${top},resizable=yes,toolbar=no,menubar=no,scrollbars=yes`
        );
      } else {
        window.open(pageLink, "_blank");
      }
    };

    btn.addEventListener("click", handleClick);
    return () => btn.removeEventListener("click", handleClick);
  }, []);

  return (
    <a
      id="fb-chat-btn"
      href="#"
      aria-label="Chat Facebook"
      className="fixed bottom-4 left-6 z-[9999] w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center transition-all duration-300"
    >
      {/* Icon Messenger SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
        fill="white"
        className="w-7 h-7"
      >
        <path d="M18 0C8.06 0 0 7.16 0 16c0 4.8 2.4 9.1 6.3 12l-1.3 7.6 7-3.8c1.9.5 3.9.8 6 .8 9.94 0 18-7.16 18-16S27.94 0 18 0zm2.9 21.6l-4.5-4.8-8.9 4.8 9.6-10.3 4.6 4.8 8.8-4.8-9.6 10.3z" />
      </svg>
    </a>
  );
}
