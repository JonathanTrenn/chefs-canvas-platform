"use client";

import { useEffect, useRef } from "react";

type Props = {
  wistiaVideoId?: string | null;
  className?: string;
};

export default function WistiaEmbed({ wistiaVideoId, className }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wistiaVideoId) return;

    // Remove fixed height from hero-video when video is present
    const heroVideo = wrapperRef.current?.closest(".hero-video");
    if (heroVideo) {
      (heroVideo as HTMLElement).style.height = "auto";
    }

    const ensureScript = (src: string, type?: string) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      if (type) s.type = type;
      document.head.appendChild(s);
    };

    ensureScript("https://fast.wistia.com/player.js");
    ensureScript(`https://fast.wistia.com/embed/${wistiaVideoId}.js`, "module");
  }, [wistiaVideoId]);

  if (!wistiaVideoId) return null;

  return (
    <div ref={wrapperRef} className={className} style={{ width: "100%", aspectRatio: "16/9" }}>
      <div
        dangerouslySetInnerHTML={{
          __html: `<wistia-player media-id="${wistiaVideoId}" aspect="1.7777777777777777" style="width:100%;height:100%;display:block;"></wistia-player>`
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}