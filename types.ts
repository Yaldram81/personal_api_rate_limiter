
export interface User {
  id: number;
  name: string;
  email: string;
  points: number;
}

export interface ActionLog {
  id: string;
  actionName: string;
  timestamp: number;
  success: boolean;
  override: boolean;
  penalty: number;
}

export interface LimitRule {
  id: string;
  actionName: string;
  maxPerHour: number | null;
  maxPerDay: number | null;
  cooldownSecs: number | null;
  overridePenalty: number;
  description?: string;
}

export type ViewType = 'dashboard' | 'rules' | 'history' | 'ai-insights';
