/**
 * TANNOVA API Service
 */

export interface DashboardSummary {
  total_meters: number;
  critical_count: number;
  high_count: number;
  daily_revenue_loss_inr: number;
  feeder_mismatch_kwh_day: number;
  last_updated: string;
}

export interface ZoneStats {
  id: string;
  name: string;
  lss: number;
  status: 'RED' | 'AMBER' | 'GREEN';
  peak_kwh: number;
  mismatch_pct: number;
  n_critical: number;
  n_high: number;
  recovery_pot: string;
  lat: number;
  lon: number;
}

export interface AlertDetail {
  ticket_id: string;
  meter_id: string;
  feeder_id: string;
  consumer_type: string;
  tier: string;
  score: number;
  attack_type: string;
  max_dip: number;
  base_daily_kwh: number;
  days_active: number;
  daily_loss_inr: number;
  total_loss_inr: number;
  shap?: Record<string, number>;
  inspection_brief?: {
    title: string;
    description: string;
    on_site: string[];
    evidence: string[];
  };
  peer_context?: {
    peer_count: number;
    peer_avg_kwh: number;
    deviation_pct: number;
  };
  consumption_timeline?: { time: string; actual: number; baseline: number }[];
  kannada_brief?: string;
}

export interface ForecastData {
  historical: { time: number; val: number }[];
  forecast: { time: number; p50: number; p10: number; p90: number }[];
  lss_class: string;
}

export interface MismatchTrend {
  trend: {
    date: string;
    meter_sum: number;
    feeder_input: number;
    mismatch_kwh: number;
    mismatch_pct: number;
    is_spike: boolean;
  }[];
  total_revenue_loss_est: number;
}

class TannovaAPI {
  private async fetch<T>(path: string, fallbackData: T): Promise<T> {
    try {
      const resp = await fetch(path);
      if (!resp.ok) throw new Error(`API Error: ${resp.statusText}`);
      return await resp.json();
    } catch (e) {
      console.warn(`[TANNOVA] Backend not reachable for ${path}. Using fallback simulation data.`);
      return fallbackData;
    }
  }

  getDashboardSummary = () => this.fetch<DashboardSummary>('/api/dashboard/summary', {
    total_meters: 14092,
    critical_count: 42,
    high_count: 156,
    daily_revenue_loss_inr: 428000,
    feeder_mismatch_kwh_day: 12.4,
    last_updated: new Date().toISOString()
  });

  getZones = () => this.fetch<ZoneStats[]>('/api/dashboard/zones', [
    { id: 'z1', name: 'WHITEFIELD_IND_01', lss: 8.4, status: 'RED', peak_kwh: 450, mismatch_pct: 18.2, n_critical: 12, n_high: 40, recovery_pot: '₹1.2L', lat: 12.96, lon: 77.76 },
    { id: 'z2', name: 'KORAMANGALA_COM_03', lss: 6.2, status: 'AMBER', peak_kwh: 320, mismatch_pct: 12.5, n_critical: 5, n_high: 22, recovery_pot: '₹85K', lat: 12.93, lon: 77.62 },
    { id: 'z3', name: 'HEBBAL_RES_02', lss: 3.1, status: 'GREEN', peak_kwh: 210, mismatch_pct: 4.1, n_critical: 0, n_high: 4, recovery_pot: '₹12K', lat: 13.03, lon: 77.59 }
  ]);

  getAlerts = (tier?: string, limit?: number) => {
    let url = `/api/alerts?limit=${limit || 50}`;
    if (tier) url += `&tier=${tier}`;
    return this.fetch<AlertDetail[]>(url, [
      { ticket_id: 'TKT-001', meter_id: 'MTR-8A9F2', feeder_id: 'F-WHD-01', consumer_type: 'INDUSTRIAL', tier: 'CRITICAL', score: 0.94, attack_type: 'magnet_attack', max_dip: 85, base_daily_kwh: 450, days_active: 12, daily_loss_inr: 4500, total_loss_inr: 54000 },
      { ticket_id: 'TKT-002', meter_id: 'MTR-3C4D1', feeder_id: 'F-KOR-03', consumer_type: 'COMMERCIAL', tier: 'CRITICAL', score: 0.88, attack_type: 'meter_bypass', max_dip: 100, base_daily_kwh: 220, days_active: 5, daily_loss_inr: 2200, total_loss_inr: 11000 },
      { ticket_id: 'TKT-003', meter_id: 'MTR-1E2F3', feeder_id: 'F-HEB-02', consumer_type: 'RESIDENTIAL', tier: 'HIGH', score: 0.76, attack_type: 'phase_tap', max_dip: 40, base_daily_kwh: 45, days_active: 30, daily_loss_inr: 450, total_loss_inr: 13500 }
    ]);
  };

  getAlertDetail = (id: string) => this.fetch<AlertDetail>(`/api/alerts/${id}`, {
    ticket_id: id, meter_id: 'MTR-8A9F2', feeder_id: 'F-WHD-01', consumer_type: 'INDUSTRIAL', tier: 'CRITICAL', score: 0.94, attack_type: 'magnet_attack', max_dip: 85, base_daily_kwh: 450, days_active: 12, daily_loss_inr: 4500, total_loss_inr: 54000,
    shap: { 'voltage_variance': 0.85, 'current_drop': 0.62, 'temp_spike': 0.12 },
    inspection_brief: { title: 'Magnetic Tampering Detected', description: 'Strong static magnetic field >500mT detected near CT coils causing 85% recording drop.', on_site: ['Verify seal', 'Check for strong magnets'], evidence: ['telemetry_log', 'phase_profile'] },
    kannada_brief: 'CT ಕಾಯಿಲ್‌ಗಳ ಬಳಿ ಪ್ರಬಲ ಮ್ಯಾಗ್ನೆಟಿಕ್ ಕ್ಷೇತ್ರ ಪತ್ತೆಯಾಗಿದೆ. ಮೀಟರ್ ರೀಡಿಂಗ್ 85% ಕಡಿಮೆಯಾಗಿದೆ. ತಕ್ಷಣ ಪರಿಶೀಲಿಸಿ.',
    consumption_timeline: Array.from({length: 24}).map((_, i) => ({ time: `${i}:00`, baseline: 20 + Math.sin(i)*5, actual: i > 18 && i < 22 ? 2 : 20 + Math.sin(i)*5 }))
  });

  getForecast = (feederId: string) => this.fetch<ForecastData>(`/api/forecast/${feederId}`, {
    historical: [], forecast: [], lss_class: 'AMBER'
  }); // App.tsx completely overrides this with client-side logic anyway

  getLstmSequence = (feederId: string) => this.fetch<any>(`/api/lstm_sequence/${feederId}`, {
    reconstruction_errors: Array.from({length: 100}).map((_, i) => ({ time: i, error: i > 40 && i < 55 ? 3.5 + Math.random() : 0.5 + Math.random()*0.5, threshold: 2.0 }))
  });

  getMismatch = (feederId: string, days = 7) => this.fetch<MismatchTrend>(`/api/feeder/${feederId}/mismatch?days=${days}`, {
    trend: [], total_revenue_loss_est: 0
  }); // App.tsx overrides this in MismatchAnalysis if we had it
  
  getAttackSummary = () => this.fetch<any[]>('/api/analytics/attack-summary', []);
  getRevenueImpact = (nMeters = 1200000) => this.fetch<any>(`/api/analytics/revenue-impact?n_meters=${nMeters}`, {});
  getAudit = () => this.fetch<any[]>('/api/audit', []);

  diagnoseAi = async (anomaly: any) => {
    return { diagnosis: "AI Simulated Diagnosis" };
  };
}

export const api = new TannovaAPI();
