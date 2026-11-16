export type MapPosition = { x: number; y: number };

export const STAMFORD_PLAY_STOPS = {
  hospital: { x: 14, y: 24, label: 'Stamford Hospital', color: '#6ee7b7', labelX: 85, labelY: 110 },
  staging: { x: 33, y: 30, label: 'Vehicle staging', color: '#f0d98a', labelX: 250, labelY: 151 },
  washington: { x: 49, y: 40, label: 'Washington Blvd', color: '#67e8f9', labelX: 267, labelY: 252 },
  station: { x: 60, y: 56, label: 'Stamford Station', color: '#93c5fd', labelX: 626, labelY: 338 },
  southEnd: { x: 68, y: 69, label: 'South End', color: '#fda4af', labelX: 725, labelY: 416 },
  harbor: { x: 56, y: 80, label: 'Harbor Point', color: '#d8b4fe', labelX: 354, labelY: 485 },
} satisfies Record<string, MapPosition & { label: string; color: string; labelX: number; labelY: number }>;

const stops = Object.values(STAMFORD_PLAY_STOPS);
const route = stops.map(({ x, y }) => `${x * 10},${y * 6}`).join(' ');

interface StamfordPlayMapProps {
  player?: MapPosition;
}

export function StamfordPlayMap({ player }: StamfordPlayMapProps) {
  const compact = player !== undefined;

  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <rect width="1000" height="600" fill="#101d2a" />
      <path d="M0 435L157 466L240 550L381 558L525 515L645 540L746 483L815 391L909 365L1000 379V600H0Z" fill="#123744" stroke="#286477" strokeWidth="4" />
      <path d="M600 355H707V397H600ZM704 441H764V477H704ZM528 429H610V453H528ZM367 325H449V367H367ZM125 181H249V229H125Z" fill="#1c3040" stroke="#30495b" strokeWidth="2" />
      <path d="M0 286H1000" stroke="#a6926a" strokeWidth="20" />
      <path d="M0 286H1000" stroke="#283343" strokeWidth="14" />
      <path d="M0 286H1000" stroke="#b1a28b" strokeWidth="2" strokeDasharray="12 9" />
      <path d="M0 312H1000" stroke="#9faec1" strokeOpacity=".65" strokeWidth="5" strokeDasharray="7 5" />
      <path d="M435 100V200L490 240V321L560 398V480M680 189V414L560 480M800 215V418L740 462M603 380H800" fill="none" stroke="#496176" strokeWidth="9" />
      <polyline points={route} fill="none" stroke="#141819" strokeWidth="14" strokeLinejoin="round" />
      <polyline points={route} fill="none" stroke="#f0d98a" strokeWidth="4" strokeLinejoin="round" strokeDasharray="9 6" />
      {!compact && (
        <g fill="#bac7d4" fontSize="22" fontWeight="600" paintOrder="stroke" stroke="#101d2a" strokeWidth="5" strokeLinejoin="round">
          <text x="58" y="277">I-95</text>
          <text x="825" y="304">Rail corridor</text>
          <text x="692" y="239">Atlantic St</text>
          <text x="813" y="376">Pacific St</text>
          <text x="88" y="493" fill="#8fc8d5">Stamford Harbor</text>
        </g>
      )}
      {stops.map(({ x, y, label, color, labelX, labelY }) => (
        <g key={label}>
          <circle cx={x * 10} cy={y * 6} r={compact ? 16 : 11} fill={color} stroke="#101d2a" strokeWidth="4" />
          {!compact && (
            <text x={labelX} y={labelY} fill={color} fontSize="27" fontWeight="700" paintOrder="stroke" stroke="#101d2a" strokeWidth="6" strokeLinejoin="round">
              {label}
            </text>
          )}
        </g>
      ))}
      {player && <circle cx={player.x * 10} cy={player.y * 6} r="19" fill="white" stroke="#0891b2" strokeWidth="7" />}
    </svg>
  );
}
