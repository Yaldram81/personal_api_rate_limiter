
import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, ActionLog, LimitRule, User } from './types';
import { getStore, saveStore } from './store';
import { getAIInsights } from './services/geminiService';
import Dashboard from './components/Dashboard';
import RuleManager from './components/RuleManager';
import ActionLogList from './components/ActionLogList';
import OverrideModal from './components/OverrideModal';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [user, setUser] = useState<User>(getStore().user);
  const [rules, setRules] = useState<LimitRule[]>(getStore().rules);
  const [logs, setLogs] = useState<ActionLog[]>(getStore().logs);
  
  // States for the blocking flow
  const [blockingRule, setBlockingRule] = useState<LimitRule | null>(null);
  const [blockReason, setBlockReason] = useState<string>('');

  // States for AI Insights
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    saveStore({ user, rules, logs });
  }, [user, rules, logs]);

  const handleTestAction = (actionName: string) => {
    const rule = rules.find(r => r.actionName === actionName);
    if (!rule) return;

    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const oneDayAgo = now - 86400000;

    const logsForAction = logs.filter(l => l.actionName === actionName && l.success);
    
    // Cooldown check
    const lastAction = logsForAction[logsForAction.length - 1];
    if (lastAction && rule.cooldownSecs && (now - lastAction.timestamp) < (rule.cooldownSecs * 1000)) {
      setBlockReason(`Wait ${Math.ceil((rule.cooldownSecs * 1000 - (now - lastAction.timestamp)) / 1000)}s more before repeating.`);
      setBlockingRule(rule);
      return;
    }

    // Hourly check
    const hourlyLogs = logsForAction.filter(l => l.timestamp > oneHourAgo);
    if (rule.maxPerHour && hourlyLogs.length >= rule.maxPerHour) {
      setBlockReason(`Maximum hourly limit of ${rule.maxPerHour} reached.`);
      setBlockingRule(rule);
      return;
    }

    // Daily check
    const dailyLogs = logsForAction.filter(l => l.timestamp > oneDayAgo);
    if (rule.maxPerDay && dailyLogs.length >= rule.maxPerDay) {
      setBlockReason(`Maximum daily limit of ${rule.maxPerDay} reached.`);
      setBlockingRule(rule);
      return;
    }

    // If passed all checks
    recordAction(actionName, true, false, 0);
  };

  const recordAction = (actionName: string, success: boolean, override: boolean, penalty: number) => {
    const newLog: ActionLog = {
      id: Date.now().toString(),
      actionName,
      timestamp: Date.now(),
      success,
      override,
      penalty
    };
    setLogs(prev => [...prev, newLog]);
    if (penalty > 0) {
      setUser(prev => ({ ...prev, points: Math.max(0, prev.points - penalty) }));
    }
  };

  const confirmOverride = () => {
    if (blockingRule) {
      recordAction(blockingRule.actionName, true, true, blockingRule.overridePenalty);
      setBlockingRule(null);
    }
  };

  const cancelOverride = () => {
    if (blockingRule) {
      recordAction(blockingRule.actionName, false, false, 0);
      setBlockingRule(null);
    }
  };

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const data = await getAIInsights(logs, rules);
    setAiInsights(data.insights || []);
    setLoadingInsights(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-black tracking-tighter text-indigo-400">LIMITLESS</h1>
          <p className="text-xs text-slate-500 font-medium">Rate Limiting System v1.0</p>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>} />
          <NavButton active={view === 'rules'} onClick={() => setView('rules')} label="Rules Manager" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>} />
          <NavButton active={view === 'history'} onClick={() => setView('history')} label="History Logs" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>} />
          <NavButton active={view === 'ai-insights'} onClick={() => { setView('ai-insights'); fetchInsights(); }} label="AI Insights" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM16.464 14.95a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 111.414-1.414l.707.707zM6.464 14.95a1 1 0 11-1.414-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707z" /></svg>} />
        </nav>
        <div className="p-6 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/40/40" className="rounded-full ring-2 ring-indigo-500" alt="Avatar" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.points} XP Available</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{view.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">SYSTEM READY</span>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard 
              user={user} 
              logs={logs} 
              rules={rules} 
              onTestAction={handleTestAction} 
            />
          )}

          {view === 'rules' && (
            <RuleManager 
              rules={rules} 
              onAddRule={r => setRules([...rules, r])}
              onUpdateRule={updated => setRules(rules.map(r => r.id === updated.id ? updated : r))}
              onDeleteRule={id => setRules(rules.filter(r => r.id !== id))}
            />
          )}

          {view === 'history' && (
            <ActionLogList logs={logs} />
          )}

          {view === 'ai-insights' && (
            <div className="space-y-6">
              <div className="bg-indigo-600 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-2">Behavioral Analytics</h3>
                <p className="text-indigo-100">Powered by Gemini 3.0 Flash</p>
              </div>
              
              {loadingInsights ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                  <p className="text-slate-500 font-medium">Analyzing habits and calculating optimizations...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiInsights.length > 0 ? aiInsights.map((insight, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </div>
                      <h4 className="font-bold text-slate-800 mb-2">{insight.title}</h4>
                      <p className="text-sm text-slate-500 mb-4">{insight.description}</p>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Recommendation</p>
                        <p className="text-xs font-medium text-slate-700">{insight.actionableStep}</p>
                      </div>
                    </div>
                  )) : (
                     <div className="col-span-3 text-center py-12 text-slate-400">Not enough data for meaningful insights. Try performing more actions.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Override Modal Portal */}
      {blockingRule && (
        <OverrideModal 
          rule={blockingRule} 
          reason={blockReason}
          onConfirm={confirmOverride}
          onCancel={cancelOverride}
        />
      )}
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
      active 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default App;
