"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Kakao AdFit ad units (public IDs, safe to ship to the client).
const PC = { unit: "DAN-bEy8DPRudeNKA8It", width: 728, height: 90 };
const MOBILE = { unit: "DAN-tCAFfmysxo0t8fKE", width: 320, height: 100 };

const AD_SCRIPT_SRC = "//t1.kakaocdn.net/kas/static/ba.min.js";

// Renders a single AdFit unit. AdFit's ba.min.js scans for `.kakao_ad_area`
// and renders ads only on (re)load, so for client-side navigation we recreate
// the <ins> and re-append the script on every pathname change.
function AdFitUnit({ unit, width, height }: { unit: string; width: number; height: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = "";

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", unit);
    ins.setAttribute("data-ad-width", String(width));
    ins.setAttribute("data-ad-height", String(height));

    const script = document.createElement("script");
    script.async = true;
    script.src = AD_SCRIPT_SRC;

    host.appendChild(ins);
    host.appendChild(script);

    return () => {
      host.innerHTML = "";
    };
  }, [unit, width, height, pathname]);

  return <div ref={hostRef} style={{ width, height }} />;
}

// Picks the unit that matches the viewport so only one ad request is made per
// page (AdFit banners are fixed size; there is no responsive unit).
export function AdFitBanner() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const cfg = isDesktop ? PC : MOBILE;

  return (
    <div className="flex w-full justify-center overflow-hidden" style={{ minHeight: 100 }}>
      {isDesktop === null ? null : <AdFitUnit key={isDesktop ? "pc" : "mobile"} {...cfg} />}
    </div>
  );
}
