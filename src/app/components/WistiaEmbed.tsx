"use client";

import { useEffect } from "react";

type Props = {
  wistiaVideoId?: string | null;
  className?: string;
};

export default function WistiaEmbed({ wistiaVideoId, className }: Props) {
  useEffect(() => {
    if (!wistiaVideoId) return;

    const ensureScript = (src: string, id?: string) => {
      if (id && document.getElementById(id)) return;
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      if (id) s.id = id;
      document.body.appendChild(s);
    };

    ensureScript("https://fast.wistia.com/assets/external/E-v1.js", "wistia-e-v1");
    ensureScript(
      `https://fast.wistia.com/embed/medias/${wistiaVideoId}.jsonp`,
      `wistia-jsonp-${wistiaVideoId}`
    );
  }, [wistiaVideoId]);

  if (!wistiaVideoId) return null;

  return (
    <div className={className}>
      <div
        className={`wistia_embed wistia_async_${wistiaVideoId}`}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}