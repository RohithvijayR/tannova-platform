export interface ZoneData {
  id: string;
  name: string;
  lss: number; // Load Stress Score 0-100
  atcLoss: number; // AT&C Loss %
  status: 'GREEN' | 'AMBER' | 'RED';
  activeAnomalies: number;
}

export interface MetricPoint {
  time: string;
  p10: number;
  p50: number;
  p90: number;
  actual?: number;
}

export interface Anomaly {
  meterId: string;
  feederId: string;
  zoneId: string;
  type: 'MAGNET' | 'BYPASS' | 'PHASE_TAP' | 'CT_TAMPER' | 'STATISTICAL';
  score: number;
  persistence: number; // days
  detectedAt: string;
  status: 'CRITICAL' | 'HIGH' | 'MONITOR';
  description: string;
  kannadaBrief: string;
}

export const ZONES: ZoneData[] = [
  { id: 'Z1', name: 'WHITEFIELD', lss: 84, atcLoss: 14.2, status: 'RED', activeAnomalies: 42 },
  { id: 'Z2', name: 'ELECTRONIC CITY', lss: 72, atcLoss: 8.5, status: 'AMBER', activeAnomalies: 28 },
  { id: 'Z3', name: 'INDIRANAGAR', lss: 45, atcLoss: 5.2, status: 'GREEN', activeAnomalies: 12 },
  { id: 'Z4', name: 'HAL STAGE II', lss: 91, atcLoss: 18.7, status: 'RED', activeAnomalies: 56 },
  { id: 'Z5', name: 'JAYANAGAR', lss: 38, atcLoss: 4.8, status: 'GREEN', activeAnomalies: 8 },
];

export const MOCKED_FORECAST: MetricPoint[] = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  p50: 400 + Math.sin(i / 3) * 100 + Math.random() * 20,
  p10: 350 + Math.sin(i / 3) * 100 + Math.random() * 10,
  p90: 450 + Math.sin(i / 3) * 100 + Math.random() * 30,
  actual: i < 12 ? 400 + Math.sin(i / 3) * 100 + (Math.random() - 0.5) * 40 : undefined,
}));

export const ANOMALIES: Anomaly[] = [
  {
    meterId: 'BES-7721-XA',
    feederId: 'F-WHF-04',
    zoneId: 'Z1',
    type: 'MAGNET',
    score: 94,
    persistence: 6,
    detectedAt: '2026-05-05 14:15',
    status: 'CRITICAL',
    description: 'Symmetric load dip ( -32% ) detected during peak billing window ( 18:00 - 22:00 ).',
    kannadaBrief: 'ಪೀಕ್ ಸಮಯದಲ್ಲಿ ಸಮ್ಮಿತೀಯ ಲೋಡ್ ಕುಸಿತ ಕಂಡುಬಂದಿದೆ. ಆಯಸ್ಕಾಂತದ ಬಳಕೆಯ ಸಂಶಯವಿದೆ.',
  },
  {
    meterId: 'BES-1042-BY',
    feederId: 'F-HAL-09',
    zoneId: 'Z4',
    type: 'PHASE_TAP',
    score: 88,
    persistence: 12,
    detectedAt: '2026-05-04 09:30',
    status: 'CRITICAL',
    description: 'Asymmetric step-reduction to 33% baseline. Potential phase-bypass or CT tampering.',
    kannadaBrief: 'ಹಂತ-ಟ್ಯಾಪಿಂಗ್ ಸಾಧ್ಯತೆ. ಲೋಡ್ ಹಠಾತ್ 33% ಗೆ ಕುಸಿದಿದೆ.',
  },
  {
    meterId: 'BES-9901-TR',
    feederId: 'F-ECY-02',
    zoneId: 'Z2',
    type: 'BYPASS',
    score: 76,
    persistence: 3,
    detectedAt: '2026-05-06 02:00',
    status: 'HIGH',
    description: 'Near-zero consumption with active occupancy status. Aggregate feeder mismatch confirmed.',
    kannadaBrief: 'ಸಕ್ರಿಯ ವಸತಿಯಲ್ಲಿ ಶೂನ್ಯ ಬಳಕೆ ಕಂಡುಬಂದಿದೆ. ಫೀಡರ್ ಅಸಮತೋಲನ ದೃಢಪಟ್ಟಿದೆ.',
  },
];
