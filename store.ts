
import { ActionLog, LimitRule, User } from './types';

const INITIAL_USER: User = {
  id: 1,
  name: 'Demo User',
  email: 'demo@example.com',
  points: 1000
};

const INITIAL_RULES: LimitRule[] = [
  { id: '1', actionName: 'Twitter', maxPerHour: 3, maxPerDay: 10, cooldownSecs: 300, overridePenalty: 50, description: 'Stop doomscrolling!' },
  { id: '2', actionName: 'Deploy Script', maxPerHour: 5, maxPerDay: null, cooldownSecs: 60, overridePenalty: 20, description: 'Check your code first.' }
];

export const getStore = () => {
  const user = localStorage.getItem('limiter_user');
  const rules = localStorage.getItem('limiter_rules');
  const logs = localStorage.getItem('limiter_logs');

  return {
    user: user ? JSON.parse(user) : INITIAL_USER,
    rules: rules ? JSON.parse(rules) : INITIAL_RULES,
    logs: logs ? JSON.parse(logs) : [] as ActionLog[]
  };
};

export const saveStore = (data: { user?: User, rules?: LimitRule[], logs?: ActionLog[] }) => {
  if (data.user) localStorage.setItem('limiter_user', JSON.stringify(data.user));
  if (data.rules) localStorage.setItem('limiter_rules', JSON.stringify(data.rules));
  if (data.logs) localStorage.setItem('limiter_logs', JSON.stringify(data.logs));
};
