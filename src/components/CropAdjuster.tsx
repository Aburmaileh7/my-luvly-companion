import { useEffect, useState } from "react";
import heroFrameAsset from "@/assets/hero-frame.webp.asset.json";
import heroOvalMaskAsset from "@/assets/hero-oval-mask.png.asset.json";
import groomAsset from "@/assets/groom.jpg.asset.json";

/**
 * Temporary visual crop adjuster for the groom photo inside the oval.
 * Activate with ?crop=1 in the URL. Drag the handle or use sliders;
 * the final Tailwind class string is shown to paste into HeroSection.tsx.
 */
export function CropAdjuster() {
  const [active, setActive] = useState(false);
  const [posX, setPosX] = useState(50); // %
  const [posY, setPosY] = useState(18); // %
  const [scaleX, setScaleX] = useState(1.3);
  const [scaleY, setScaleY] = useState(1.26);
  const [tx, setTx] = useState(0.5); // %
  const [ty, setTy] = useState(4.2); // %

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", onKey);
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("crop") === "1") setActive(true);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;

  const objectPos = `${posX}% ${posY}%`;
  // map posX (0-100) to keyword-ish for the object-[...] class
  const xKeyword = posX <= 25 ? "left" : posX >= 75 ? "right" : "center";
  const yPercent = posY;
  const classString =
    `pointer-events-none absolute inset-0 z-10 h-full w-full origin-center ` +
    `translate-x-[${tx}%] translate-y-[${ty}%] scale-x-[${scaleX}] scale-y-[${scaleY}] ` +
    `select-none object-cover object-[${xKeyword}_${yPercent}%]`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4" dir="rtl">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-xl bg-white p-4 shadow-2xl md:flex-row">
        {/* Live preview matching the egg */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative aspect-[9/16] w-full max-w-[300px]">
            <img
              src={heroFrameAsset.url}
              alt="frame"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            />
            <img
              src={groomAsset.url}
              alt="groom preview"
              draggable={false}
              className="absolute inset-0 h-full w-full origin-center object-cover"
              style={{
                objectPosition: objectPos,
                transform: `translate(${tx}%, ${ty}%) scale(${scaleX}, ${scaleY})`,
                WebkitMaskImage: `url(${heroOvalMaskAsset.url})`,
                maskImage: `url(${heroOvalMaskAsset.url})`,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex w-full flex-col gap-3 md:w-[280px]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink">ضبط قص الصورة</h3>
            <button
              onClick={() => setActive(false)}
              className="rounded bg-ink/10 px-2 py-1 text-xs hover:bg-ink/20"
            >
              إغلاق (Esc)
            </button>
          </div>

          <Slider label="نقطة التركيز أفقي" value={posX} min={0} max={100} step={1} onChange={setPosX} suffix="%" />
          <Slider label="نقطة التركيز عمودي" value={posY} min={0} max={100} step={1} onChange={setPosY} suffix="%" />
          <Slider label="تكبير أفقي" value={scaleX} min={1} max={2} step={0.01} onChange={setScaleX} />
          <Slider label="تكبير عمودي" value={scaleY} min={1} max={2} step={0.01} onChange={setScaleY} />
          <Slider label="إزاحة أفقي" value={tx} min={-10} max={10} step={0.1} onChange={setTx} suffix="%" />
          <Slider label="إزاحة عمودي" value={ty} min={-10} max={10} step={0.1} onChange={setTy} suffix="%" />

          <div className="rounded bg-ink/5 p-2 text-[11px] leading-relaxed text-ink/80">
            <p className="mb-1 font-bold">القيم للنسخ:</p>
            <p>objectPosition: <code>{objectPos}</code></p>
            <p>scale: <code>{scaleX} / {scaleY}</code></p>
            <p>translate: <code>{tx}% / {ty}%</code></p>
            <p className="mt-1 break-all text-[10px] text-ink/60">{classString}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-ink">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="font-mono">{value.toFixed(step < 1 ? 2 : 0)}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-sepia"
      />
    </label>
  );
}
