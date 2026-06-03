"use client";

type Props = {
  wistiaVideoId?: string | null;
  className?: string;
};

export default function WistiaEmbed({ wistiaVideoId, className }: Props) {
  if (!wistiaVideoId) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <iframe
        src={`https://fast.wistia.net/embed/iframe/${wistiaVideoId}?autoPlay=false&fitStrategy=cover`}
        title="Wistia video player"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}