export type WaterClass = "excellent" | "good" | "sufficient" | "poor" | "unknown";

export interface Water {
  class: WaterClass;
  label: string;
  color: string;
  raw_code: number | null;
  season: string | null;
}

export interface Crowd {
  score_0_10: number;
  label: "Empty" | "Quiet" | "Busy" | "Packed" | "Closed";
  people_count: number | null;
  method: "yolo" | "heuristic" | "renovation";
  note: string | null;
}

export interface Webcam {
  url: string;
  label: string | null;
}

export interface BeachSummary {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  vibe: string[];
  webcam: Webcam | null;
  splash_score: number;
  headline: string;
  crowd: Crowd;
  water: Water | null;
  sea_temp_c: number | null;
  sea_temp_source: string | null;
  wave_height_m: number | null;
  subscores: {
    crowd: number;
    water: number;
    temp: number;
    wind_wave: number;
  };
}

export interface NowConditions {
  air_temp_c: number | null;
  wind_speed_kmh: number | null;
  wind_direction_deg: number | null;
  wind_name: string | null;
  humidity_pct: number | null;
  uv_index: number | null;
  cloud_cover_pct: number | null;
  sea_temp_c_dhmz: number | null;
  sea_temp_c_model: number | null;
  wave_height_m: number | null;
}

export interface BeachesResponse {
  now: NowConditions;
  beaches: BeachSummary[];
}
