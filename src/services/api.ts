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
  private async fetch<T>(path: string): Promise<T> {
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(`API Error: ${resp.statusText}`);
    return resp.json();
  }

  getDashboardSummary = () => this.fetch<DashboardSummary>('/api/dashboard/summary');
  getZones = () => this.fetch<ZoneStats[]>('/api/dashboard/zones');
  getAlerts = (tier?: string, limit?: number) => {
    let url = `/api/alerts?limit=${limit || 50}`;
    if (tier) url += `&tier=${tier}`;
    return this.fetch<AlertDetail[]>(url);
  };
  getAlertDetail = (id: string) => this.fetch<AlertDetail>(`/api/alerts/${id}`);
  getForecast = (feederId: string) => this.fetch<ForecastData>(`/api/forecast/${feederId}`);
  getLstmSequence = (feederId: string) => this.fetch<any>(`/api/lstm_sequence/${feederId}`);
  getMismatch = (feederId: string, days = 7) => this.fetch<MismatchTrend>(`/api/feeder/${feederId}/mismatch?days=${days}`);
  
  getAttackSummary = () => this.fetch<any[]>('/api/analytics/attack-summary');
  getRevenueImpact = (nMeters = 1200000) => this.fetch<any>(`/api/analytics/revenue-impact?n_meters=${nMeters}`);
  getAudit = () => this.fetch<any[]>('/api/audit');

  diagnoseAi = async (anomaly: any) => {
    const resp = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anomaly })
    });
    return resp.json();
  };
}

export const api = new TannovaAPI();
