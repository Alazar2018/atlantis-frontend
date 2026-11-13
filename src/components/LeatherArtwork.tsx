export const leatherColors = [
  { name: "Carmine", value: "carmine", hex: "#941A20" },
  { name: "Noir", value: "noir", hex: "#161616" },
  { name: "Oxblood", value: "oxblood", hex: "#4E1218" },
  { name: "Wine", value: "wine", hex: "#6B2A32" },
  { name: "Blush", value: "blush", hex: "#C98986" },
] as const;

export type LeatherColor = (typeof leatherColors)[number]["value"];
export type PieceKind = "shoe" | "bag" | "belt" | "glove" | "jacket" | "apron";
export type ArtworkView = "profile" | "front" | "detail";

export const artworkViews: { id: ArtworkView; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "front", label: "Front" },
  { id: "detail", label: "Detail" },
];

export function pieceKind(name: string, category: string): PieceKind {
  const text = `${name} ${category}`.toLowerCase();
  if (/(jacket|rider)/.test(text)) return "jacket";
  if (text.includes("apron")) return "apron";
  if (/(bag|satchel|tote|carry|wallet)/.test(text)) return "bag";
  if (text.includes("belt")) return "belt";
  if (text.includes("glove")) return "glove";
  return "shoe";
}

function mix(hex: string, target: string, amount: number) {
  const channel = (value: string, index: number) => parseInt(value.slice(index, index + 2), 16);
  const from = [1, 3, 5].map((index) => channel(hex, index));
  const to = [1, 3, 5].map((index) => channel(target, index));
  return `#${from
    .map((value, index) => Math.round(value + (to[index] - value) * amount).toString(16).padStart(2, "0"))
    .join("")}`;
}

function tones(hex: string) {
  return {
    hide: hex,
    deep: mix(hex, "#160607", 0.42),
    stitch: mix(hex, "#F8F4F1", 0.55),
    sole: mix(hex, "#000000", 0.72),
    metal: "#F7F5F3",
  };
}

export default function LeatherArtwork({
  kind,
  view,
  color,
  title,
  uid,
}: {
  kind: PieceKind;
  view: ArtworkView;
  color: string;
  title: string;
  uid: string;
}) {
  const tone = tones(color);
  const sheen = `${uid}-sheen`;

  return (
    <svg id={uid} viewBox="0 0 720 560" role="img" aria-label={`${title}, ${view}`} className="h-full w-full">
      <style>{`#${uid} path, #${uid} rect, #${uid} circle { transition: fill 420ms ease, stroke 420ms ease; }`}</style>
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="720" height="560" fill="#F8F4F1" />
      <ellipse cx="360" cy="486" rx="230" ry="16" fill="#161616" opacity="0.08" />
      <g>
        {kind === "shoe" && view === "profile" && <ShoeProfile tone={tone} sheen={sheen} />}
        {kind === "shoe" && view === "front" && <ShoeFront tone={tone} sheen={sheen} />}
        {kind === "shoe" && view === "detail" && <ShoeDetail tone={tone} sheen={sheen} />}
        {kind === "bag" && view === "profile" && <BagProfile tone={tone} sheen={sheen} />}
        {kind === "bag" && view === "front" && <BagFront tone={tone} sheen={sheen} />}
        {kind === "bag" && view === "detail" && <BagDetail tone={tone} sheen={sheen} />}
        {kind === "belt" && <Belt tone={tone} sheen={sheen} view={view} />}
        {kind === "glove" && <Glove tone={tone} sheen={sheen} view={view} />}
        {kind === "jacket" && <Jacket tone={tone} sheen={sheen} />}
        {kind === "apron" && <Apron tone={tone} sheen={sheen} />}
      </g>
    </svg>
  );
}

type Tone = ReturnType<typeof tones>;

function ShoeProfile({ tone, sheen }: { tone: Tone; sheen: string }) {
  return (
    <>
      <path fill={tone.sole} d="M118 378h430c8 0 14 6 14 14v18c0 10-8 16-16 16H132c-12 0-20-8-18-18 2-12 4-30 4-30z" />
      <path fill={tone.sole} d="M498 360h118c8 0 14 8 12 16l-8 42c-2 10-12 16-22 16H492c-10 0-16-8-14-16l6-42c2-10 8-16 16-16z" />
      <path fill={tone.hide} d="M136 372c18-28 48-62 108-86 62-24 130-30 196-16 62 14 110 42 140 78 10 12 8 22-6 24-62 6-140 0-214-12-70-10-150-4-210 12-14 4-16-2-14 0z" />
      <path fill={tone.deep} d="M470 268c40 8 78 32 104 66 8 12-2 22-16 24-28 2-48-6-60-14-4-28-10-54-28-76z" />
      <path fill="none" stroke={tone.stitch} strokeWidth="2.4" d="M188 330c28-34 58-52 96-58" />
      <path fill="none" stroke={tone.stitch} strokeWidth="2.2" strokeDasharray="4 6" d="M150 352c140 14 280 8 400-16" />
      <circle cx="286" cy="292" r="3.5" fill={tone.metal} />
      <circle cx="314" cy="284" r="3.5" fill={tone.metal} />
      <circle cx="342" cy="280" r="3.5" fill={tone.metal} />
      <path fill={`url(#${sheen})`} d="M136 372c18-28 48-62 108-86 62-24 130-30 196-16 62 14 110 42 140 78 10 12 8 22-6 24-62 6-140 0-214-12-70-10-150-4-210 12-14 4-16-2-14 0z" />
    </>
  );
}

function ShoeFront({ tone, sheen }: { tone: Tone; sheen: string }) {
  return (
    <>
      <ellipse cx="360" cy="430" rx="168" ry="22" fill={tone.sole} />
      <path fill={tone.hide} d="M250 168c-8 20-28 70-34 140-6 62 16 108 70 128 40 14 78 18 74 18s34-4 74-18c54-20 76-66 70-128-6-70-26-120-34-140-28-36-92-58-110-58s-82 22-110 58z" />
      <path fill={tone.deep} d="M292 168c18-28 48-40 68-40s50 12 68 40c-20 10-48 16-68 16s-48-6-68-16z" />
      <path fill="none" stroke={tone.stitch} strokeWidth="2.5" d="M360 210v210" />
      <circle cx="360" cy="246" r="6" fill={tone.metal} />
      <circle cx="360" cy="292" r="6" fill={tone.metal} />
      <circle cx="360" cy="338" r="6" fill={tone.metal} />
      <path fill={`url(#${sheen})`} d="M250 168c-8 20-28 70-34 140-6 62 16 108 70 128 40 14 78 18 74 18s34-4 74-18c54-20 76-66 70-128-6-70-26-120-34-140-28-36-92-58-110-58s-82 22-110 58z" />
    </>
  );
}

function ShoeDetail({ tone, sheen }: { tone: Tone; sheen: string }) {
  return (
    <>
      <path fill={tone.hide} d="M90 210c40-70 140-100 270-100s230 30 270 100c20 36 20 90 0 140-40 70-140 100-270 100S130 420 90 350c-20-50-20-104 0-140z" />
      <path fill={tone.deep} d="M90 210c40-70 140-100 270-100 40 48 60 110 60 180 0 54-12 110-36 160-130 0-230-30-270-100-20-50-20-104-24-140z" />
      <path fill="none" stroke={tone.stitch} strokeWidth="2.5" strokeDasharray="3 8" d="M180 230c120 30 280 30 400 0M180 290c130 28 270 28 400 0M180 350c120 24 260 24 380 0" />
      <path fill={tone.metal} d="M470 292h78c6 0 10 6 10 12v24c0 6-4 12-10 12h-78c-6 0-10-6-10-12v-24c0-6 4-12 10-12z" />
      <circle cx="508" cy="316" r="7" fill={tone.deep} />
      <path fill={`url(#${sheen})`} d="M90 210c40-70 140-100 270-100s230 30 270 100c20 36 20 90 0 140-40 70-140 100-270 100S130 420 90 350c-20-50-20-104 0-140z" />
    </>
  );
}

function BagProfile({ tone, sheen }: { tone: Tone; sheen: string }) {
  return (
    <>
      <path
        d="M250 150c20-40 60-62 110-62s90 22 110 62"
        fill="none"
        stroke={tone.deep}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path fill={tone.hide} d="M150 180h420c22 0 36 16 36 38v230c0 28-18 46-46 46H160c-28 0-46-18-46-46V218c0-22 14-38 36-38z" />
      <path fill={tone.deep} d="M150 180h420c22 0 36 16 36 38v54H114v-54c0-22 14-38 36-38z" />
      <path fill="none" stroke={tone.stitch} strokeWidth="3" strokeDasharray="6 8" d="M150 290h420M170 360h380" />
      <rect x="330" y="300" width="60" height="36" rx="4" fill={tone.metal} />
      <path fill={`url(#${sheen})`} d="M150 180h420c22 0 36 16 36 38v230c0 28-18 46-46 46H160c-28 0-46-18-46-46V218c0-22 14-38 36-38z" />
    </>
  );
}

function BagFront({ tone, sheen }: { tone: Tone; sheen: string }) {
  return (
    <>
      <path fill={tone.hide} d="M170 140h380c18 0 30 14 30 32v270c0 24-16 40-40 40H180c-24 0-40-16-40-40V172c0-18 12-32 30-32z" />
      <path fill={tone.deep} d="M210 140c10-48 46-78 150-78s140 30 150 78H210z" />
      <path fill="none" stroke={tone.stitch} strokeWidth="3" d="M230 230h260M230 300h260" />
      <circle cx="360" cy="360" r="16" fill={tone.metal} />
      <path fill={`url(#${sheen})`} d="M170 140h380c18 0 30 14 30 32v270c0 24-16 40-40 40H180c-24 0-40-16-40-40V172c0-18 12-32 30-32z" />
    </>
  );
}

function BagDetail({ tone, sheen }: { tone: Tone; sheen: string }) {
  return (
    <>
      <path fill={tone.hide} d="M110 160h500v240H110z" />
      <path fill={tone.deep} d="M110 160h150v240H110z" />
      <path fill="none" stroke={tone.stitch} strokeWidth="4" strokeDasharray="3 10" d="M180 200h420M180 250h420M180 300h420M180 350h420" />
      <path fill={tone.metal} d="M430 250h90c8 0 14 8 14 16v28c0 8-6 16-14 16h-90c-8 0-14-8-14-16v-28c0-8 6-16 14-16z" />
      <path fill={`url(#${sheen})`} d="M110 160h500v240H110z" />
    </>
  );
}

function Belt({ tone, sheen, view }: { tone: Tone; sheen: string; view: ArtworkView }) {
  const buckle = view === "detail";
  return (
    <>
      <path fill={tone.hide} d={buckle ? "M120 230h480v90H120z" : "M90 250c80-70 180-90 300-70 90 16 160 10 230-30l18 48c-80 48-160 58-250 42-110-20-200 6-280 70l-18-60z"} />
      <path fill={tone.deep} d={buckle ? "M120 230h70v90h-70z" : "M90 250c40-36 90-58 150-66l-10 78c-50 8-96 28-140-12z"} />
      <rect x={buckle ? 150 : 250} y={buckle ? 248 : 236} width="74" height="54" rx="4" fill={tone.metal} />
      <path fill={`url(#${sheen})`} d={buckle ? "M120 230h480v90H120z" : "M90 250c80-70 180-90 300-70 90 16 160 10 230-30l18 48c-80 48-160 58-250 42-110-20-200 6-280 70l-18-60z"} />
    </>
  );
}

function Glove({ tone, sheen, view }: { tone: Tone; sheen: string; view: ArtworkView }) {
  const cuff = view === "detail";
  return (
    <>
      <path
        fill={tone.hide}
        d={
          cuff
            ? "M180 140h360v280H180z"
            : "M230 390V250c0-28 16-46 40-46 18 0 30 10 36 26 6-22 20-36 40-36 20 0 34 16 38 40 6-16 18-26 36-26 22 0 36 18 36 46v136H230z"
        }
      />
      <path fill={tone.deep} d={cuff ? "M180 140h360v70H180z" : "M230 330h226v60H230z"} />
      <path fill="none" stroke={tone.stitch} strokeWidth="3" strokeDasharray="5 7" d={cuff ? "M210 230h300M210 280h300" : "M250 360h180"} />
      <path fill={`url(#${sheen})`} d={cuff ? "M180 140h360v280H180z" : "M230 390V250c0-28 16-46 40-46 18 0 30 10 36 26 6-22 20-36 40-36 20 0 34 16 38 40 6-16 18-26 36-26 22 0 36 18 36 46v136H230z"} />
    </>
  );
}

function Jacket({ tone, sheen }: { tone: Tone; sheen: string }) {
  return (
    <>
      <path fill={tone.hide} d="M250 150c20-28 50-40 110-40s90 12 110 40l70 46-48 36-28-16v214H256V216l-28 16-48-36z" />
      <path fill={tone.deep} d="M330 128c10 24 20 70 20 120v182h-20V150c0-8 0-16 0-22zM390 128c-10 24-20 70-20 120v182h20V150c0-8 0-16 0-22z" />
      <path fill="none" stroke={tone.stitch} strokeWidth="2.4" d="M256 216c40 20 70 24 104 24s64-4 104-24" />
      <path fill={tone.metal} d="M352 250h16v120h-16z" />
      <circle cx="360" cy="268" r="4" fill={tone.metal} />
      <path fill={`url(#${sheen})`} d="M250 150c20-28 50-40 110-40s90 12 110 40l70 46-48 36-28-16v214H256V216l-28 16-48-36z" />
    </>
  );
}

function Apron({ tone, sheen }: { tone: Tone; sheen: string }) {
  return (
    <>
      <path fill={tone.hide} d="M300 118h120l18 78H282z" />
      <path fill={tone.hide} d="M214 214h292l28 230H186z" />
      <path fill={tone.deep} d="M250 250h220v16H250z" />
      <path fill="none" stroke={tone.stitch} strokeWidth="3" d="M360 118v52" />
      <path fill="none" stroke={tone.hide} strokeWidth="10" strokeLinecap="round" d="M214 230H150M506 230h64" />
      <path fill={tone.deep} d="M250 300h90v70h-90zM380 300h90v70h-90z" />
      <path fill={`url(#${sheen})`} d="M214 214h292l28 230H186z" />
    </>
  );
}
