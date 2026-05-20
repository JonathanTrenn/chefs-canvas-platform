"use client";

export default function ShareButton() {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Copied!");
    } catch {
      alert("Unable to copy link.");
    }
  };

  return (
    <button type="button" className="nav-button" onClick={handleShare}>
      <span className="icon">↗</span> Share
    </button>
  );
}