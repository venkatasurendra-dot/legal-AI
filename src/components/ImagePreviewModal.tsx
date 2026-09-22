import React from 'react';
import { X, Download, ZoomIn, FileText } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  fileName?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fileName = 'Legal_Document_Photo.jpg',
}) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#111622] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#151c2a] border-b border-slate-800">
          <div className="flex items-center space-x-2 truncate mr-3">
            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
              {fileName}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Preview Container */}
        <div className="flex-1 bg-black/90 p-3 sm:p-6 overflow-auto flex items-center justify-center min-h-[300px]">
          <img
            src={imageUrl}
            alt={fileName}
            className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
          />
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#141a26] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Multimodal Legal Visual Analysis & Inspection</span>
          <span className="text-amber-400/90 font-medium">BNS • BNSS • Indian Stamp Act Compliant</span>
        </div>
      </div>
    </div>
  );
};
