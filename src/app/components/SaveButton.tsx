"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cc_saved_dishes";

export default function SaveButton() {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
    setIsSaved(saved.includes(window.location.href));
  }, []);

  const handleSave = () => {
    const currentUrl = window.location.href;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];

    let nextSaved: string[];

    if (saved.includes(currentUrl)) {
      nextSaved = saved.filter((url) => url !== currentUrl);
      setIsSaved(false);
    } else {
      nextSaved = [...saved, currentUrl];
      setIsSaved(true);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSaved));
  };

  return (
    <button type="button" className="nav-button" onClick={handleSave}>
      <span className="icon">★</span> {isSaved ? "Saved" : "Save"}
    </button>
  );
}