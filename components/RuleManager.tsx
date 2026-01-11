
import React, { useState } from 'react';
import { LimitRule } from '../types';

interface RuleManagerProps {
  rules: LimitRule[];
  onAddRule: (rule: LimitRule) => void;
  onUpdateRule: (rule: LimitRule) => void;
  onDeleteRule: (id: string) => void;
}

const RuleManager: React.FC<RuleManagerProps> = ({ rules, onAddRule, onUpdateRule, onDeleteRule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRule, setEditingRule] = useState<LimitRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<LimitRule>>({
    actionName: '',
    maxPerHour: 5,
    maxPerDay: 20,
    cooldownSecs: 60,
    overridePenalty: 10,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.actionName) return;
    onAddRule({
      ...newRule as LimitRule,
      id: Date.now().toString()
    });
    setNewRule({ actionName: '', maxPerHour: 5, maxPerDay: 20, cooldownSecs: 60, overridePenalty: 10, description: '' });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRule) {
      onUpdateRule(editingRule);
      setEditingRule(null);
    }
  };

  const filteredRules = rules.filter(rule =>
    rule.actionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Create Rule Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6">Create New Rule</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Action Name</label>
            <input 
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g., Open Twitter"
              value={newRule.actionName}
              onChange={e => setNewRule({...newRule, actionName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Max Per Hour</label>
            <input 
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newRule.maxPerHour || ''}
              onChange={e => setNewRule({...newRule, maxPerHour: parseInt(e.target.value) || null})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Max Per Day</label>
            <input 
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newRule.maxPerDay || ''}
              onChange={e => setNewRule({...newRule, maxPerDay: parseInt(e.target.value) || null})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cooldown (seconds)</label>
            <input 
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newRule.cooldownSecs || ''}
              onChange={e => setNewRule({...newRule, cooldownSecs: parseInt(e.target.value) || null})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Override Penalty (Points)</label>
            <input 
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newRule.overridePenalty || 0}
              onChange={e => setNewRule({...newRule, overridePenalty: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="space-y-2 lg:col-span-1 flex items-end">
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors"
            >
              Add Rule
            </button>
          </div>
        </form>
      </div>

      <div className="pt-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
            placeholder="Search rules by action name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.length > 0 ? (
            filteredRules.map(rule => (
              <div 
                key={rule.id} 
                className="group relative bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer"
                onClick={() => setEditingRule(rule)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-indigo-900">{rule.actionName}</h3>
                    <p className="text-sm text-slate-500 mb-4">{rule.description || 'No description provided'}</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Hourly:</span>
                        <span className="font-medium">{rule.maxPerHour || '∞'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Daily:</span>
                        <span className="font-medium">{rule.maxPerDay || '∞'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Cooldown:</span>
                        <span className="font-medium">{rule.cooldownSecs}s</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Penalty:</span>
                        <span className="font-medium text-red-500">-{rule.overridePenalty} pts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRule(rule.id);
                      }}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      title="Delete Rule"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    Click to Edit
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 italic bg-white rounded-xl border border-dashed border-slate-300">
              {searchTerm ? `No rules matching "${searchTerm}"` : "No rules found."}
            </div>
          )}
        </div>
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Rule: {editingRule.actionName}</h2>
              <button onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Action Name</label>
                  <input 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    value={editingRule.actionName}
                    onChange={e => setEditingRule({...editingRule, actionName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Override Penalty</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    value={editingRule.overridePenalty}
                    onChange={e => setEditingRule({...editingRule, overridePenalty: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Max Per Hour</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    value={editingRule.maxPerHour || ''}
                    onChange={e => setEditingRule({...editingRule, maxPerHour: parseInt(e.target.value) || null})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Max Per Day</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    value={editingRule.maxPerDay || ''}
                    onChange={e => setEditingRule({...editingRule, maxPerDay: parseInt(e.target.value) || null})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Cooldown (seconds)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    value={editingRule.cooldownSecs || ''}
                    onChange={e => setEditingRule({...editingRule, cooldownSecs: parseInt(e.target.value) || null})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <input 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    value={editingRule.description || ''}
                    onChange={e => setEditingRule({...editingRule, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleManager;
