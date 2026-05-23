"use client";

import { useEffect } from "react";

type Props = {
  wistiaVideoId?: string | null;
  className?: string;
};

export default function WistiaEmbed({ wistiaVideoId, className }: Props) {
  useEffect(() => {
    if (!wistiaVideoId) return;

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
    <div className={className} style={{ width: "100%", aspectRatio: "16/9" }}>
      <div
        dangerouslySetInnerHTML={{
          __html: `<wistia-player media-id="${wistiaVideoId}" aspect="1.7777777777777777" style="width:100%;height:100%;display:block;"></wistia-player>`
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}