import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export const LegalDisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/20 text-amber-200/90 text-xs px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-300">Statutory Notice:</strong> LegalAI India is an educational, research, and informational platform. It does not provide formal legal advice, representation, or substitute for a licensed advocate or court. For actionable legal counsel, consult a qualified advocate.
          </p>
        </div>
        <button
          id="btn-dismiss-disclaimer"
          onClick={() => setDismissed(true)}
          className="text-amber-400/80 hover:text-amber-200 p-1 rounded transition-colors"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
