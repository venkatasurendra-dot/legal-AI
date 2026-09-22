import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  RotateCcw, 
  Check, 
  X, 
  FlipHorizontal, 
  AlertCircle, 
  FileText,
  Sparkles
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string, fileName: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Check available video devices
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoDevices.length > 1);
        })
        .catch(() => {});
    }
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopStream();
    setErrorMessage(null);
    setIsInitializing(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device detected on this system. You can upload a photo from your files instead.');
      } else {
        setErrorMessage(`Unable to access camera: ${err.message || 'Unknown error'}. Please verify permissions or use file upload.`);
      }
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, capturedImage, startCamera, stopStream]);

  const handleSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopStream();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      onCapture(capturedImage, `Camera_Legal_Document_${timestamp}.jpg`);
      onClose();
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#111622] border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#161d2c]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Capture Legal Document or Photo</h3>
              <p className="text-[11px] text-slate-400">Take a photo of a notice, agreement, summons, or legal evidence</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="relative flex-1 bg-black min-h-[320px] sm:min-h-[400px] flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            /* Review captured photo */
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                src={capturedImage}
                alt="Captured Legal Document"
                className="max-h-[60vh] max-w-full object-contain rounded-lg border border-slate-700"
              />
              <div className="absolute top-4 left-4 bg-emerald-950/90 border border-emerald-600/50 text-emerald-300 text-xs px-2.5 py-1 rounded-full flex items-center space-x-1.5 backdrop-blur-sm">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photo Captured</span>
              </div>
            </div>
          ) : (
            /* Live camera stream */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full max-h-[60vh] object-cover sm:object-contain"
              />

              {/* Document framing guide */}
              <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-amber-400/50 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between items-center text-[10px] text-amber-300/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs self-start">
                  <FileText className="w-3 h-3 mr-1" />
                  <span>Align document / page inside frame</span>
                </div>
                <div className="text-[10px] text-slate-400 text-center bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs self-center">
                  Ensure text and stamp seals are legible and well-lit
                </div>
              </div>

              {/* Initializing indicator */}
              {isInitializing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center space-y-2 text-slate-300">
                  <Camera className="w-8 h-8 text-amber-400 animate-pulse" />
                  <span className="text-xs">Starting camera feed...</span>
                </div>
              )}

              {/* Error overlay */}
              {errorMessage && (
                <div className="absolute inset-0 bg-slate-950/90 p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">Camera Unavailable</h4>
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed">{errorMessage}</p>
                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Access</span>
                    </button>
                    <button
                      onClick={() => {
                        stopStream();
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Hidden Canvas for capture rendering */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 bg-[#141a27] border-t border-slate-800 flex items-center justify-between">
          {capturedImage ? (
            /* Controls after snapping */
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>

              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center space-x-2 shadow-lg transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Attach to Legal AI Chat</span>
              </button>
            </div>
          ) : (
            /* Live camera controls */
            <div className="flex items-center justify-between w-full">
              {hasMultipleCameras ? (
                <button
                  onClick={toggleCameraFacing}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1.5 transition-colors"
                  title="Switch Front/Rear Camera"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Flip Camera</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>High-resolution capture</span>
                </div>
              )}

              {/* Shutter Button */}
              <button
                onClick={handleSnap}
                disabled={isInitializing || !!errorMessage}
                className={`w-14 h-14 rounded-full border-4 border-amber-500/80 bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                  isInitializing || !!errorMessage ? 'opacity-40 cursor-not-allowed' : ''
                }`}
                title="Capture Document Photo"
              >
                <div className="w-10 h-10 rounded-full border-2 border-slate-950/40 bg-white/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-slate-950" />
                </div>
              </button>

              <button
                onClick={() => {
                  stopStream();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
