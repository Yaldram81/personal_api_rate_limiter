
import React from 'react';
import { LimitRule } from '../types';

interface OverrideModalProps {
  rule: LimitRule;
  onCancel: () => void;
  onConfirm: () => void;
  reason: string;
}

const OverrideModal: React.FC<OverrideModalProps> = ({ rule, onCancel, onConfirm, reason }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Limit Exceeded</h3>
          <p className="text-slate-500 mb-6">
            You've hit the rate limit for <span className="font-bold text-indigo-600">"{rule.actionName}"</span>.<br/>
            <span className="text-sm italic">{reason}</span>
          </p>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100">
            <p className="text-sm font-semibold text-slate-600 mb-1 uppercase tracking-wider">Penalty Cost</p>
            <p className="text-3xl font-black text-red-500">-{rule.overridePenalty} pts</p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              Use Override
            </button>
            <button 
              onClick={onCancel}
              className="w-full bg-white hover:bg-slate-50 text-slate-600 font-semibold py-3 rounded-xl border border-slate-200 transition-all"
            >
              Cancel Action
            </button>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Choose discipline over convenience. Overrides impact your productivity rank.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverrideModal;
