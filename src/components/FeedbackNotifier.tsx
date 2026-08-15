import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FeedbackNotifier: React.FC = () => {
  const { isProcessing, processingMessage, activeToast, showToast } = useApp();

  return (
    <>
      {/* Top micro progress bar when processing */}
      {isProcessing && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 animate-pulse w-full shadow-md" />
          {processingMessage && (
            <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2 rounded-full shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2.5 backdrop-blur-md animate-bounce">
              <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              <span>{processingMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Floating Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-18 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 animate-slide-up backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            {activeToast.type === 'success' && (
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
            {activeToast.type === 'error' && (
              <div className="w-7 h-7 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            {activeToast.type === 'info' && (
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                <Info className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs font-semibold text-slate-100 truncate">{activeToast.message}</span>
          </div>
        </div>
      )}
    </>
  );
};
