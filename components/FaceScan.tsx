
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { RefreshCw, X, Zap, AlertCircle, Upload, CheckCircle2, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { ScanResult } from '../types';

interface FaceScanProps {
  onScanComplete: (result: ScanResult) => void;
  onClose: () => void;
}

type ScanView = 'CAMERA' | 'SCANNING' | 'REVIEW';

export const FaceScan: React.FC<FaceScanProps> = ({ onScanComplete, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [view, setView] = useState<ScanView>('CAMERA');
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);
  
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (isMounted.current) {
      setIsStreaming(false);
    }
  };

  const startCamera = async () => {
    if (isMounted.current) setError('');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (isMounted.current) setError('Camera API is not supported in this browser.');
      return;
    }

    try {
      if (isStreaming) stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      });
      
      if (!isMounted.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (isMounted.current) {
             videoRef.current?.play().catch(e => console.error("Play error:", e));
             setIsStreaming(true);
          }
        };
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (!isMounted.current) return;
      setError('Unable to access camera. Please allow permission or upload a photo.');
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (view === 'CAMERA') {
      startCamera();
    }
    return () => stopCamera();
  }, [view]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
        performAnalysis(dataUrl);
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCapturedImage(dataUrl);
        setError('');
        stopCamera();
        performAnalysis(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = (imageUri: string) => {
    setView('SCANNING');
    
    // Simulate AI Latency
    setTimeout(() => {
      if (!isMounted.current) return;

      const mockResult: ScanResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        overallScore: Math.floor(Math.random() * (95 - 75) + 75),
        metrics: {
          acne: Math.floor(Math.random() * 30),
          wrinkles: Math.floor(Math.random() * 25),
          pigmentation: Math.floor(Math.random() * 45),
          texture: Math.floor(Math.random() * 35),
        },
        imageUri,
        summary: "Skin barrier looks healthy. Moderate sebum detected in T-zone. Pores are clear, but hydration levels could be improved."
      };
      
      setAnalysisResult(mockResult);
      setView('REVIEW');
    }, 3500);
  };

  const handleSave = () => {
    if (analysisResult) {
      onScanComplete(analysisResult);
    }
  };

  const getMetricColor = (val: number) => {
    if (val < 20) return 'bg-green-500';
    if (val < 45) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white dark:bg-slate-900">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        <h3 className="text-xl font-bold mb-3 dark:text-white">Access Error</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">{error}</p>
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="w-full max-w-xs py-3.5 bg-glow-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 mb-3"
        >
          <Upload size={20} />
          Upload Photo
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
        <button onClick={onClose} className="text-slate-500 font-medium">Cancel</button>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-black flex flex-col overflow-hidden">
      {/* Top Bar - Hidden in Review for cleaner look */}
      {view !== 'REVIEW' && (
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent text-white">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><X /></button>
          <span className="font-bold tracking-widest text-xs">AI FACE ANALYZER</span>
          <div className="w-10"></div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {view === 'CAMERA' && (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            {/* Guide Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-85 border-2 border-white/30 rounded-[35%] relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-bold tracking-widest uppercase border border-white/20">
                  Align Face
                </div>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-glow-400 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-glow-400 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-glow-400 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-glow-400 rounded-br-2xl"></div>
              </div>
            </div>
          </>
        )}

        {view === 'SCANNING' && capturedImage && (
          <div className="relative w-full h-full">
            <img src={capturedImage} alt="Scanning" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-30">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-glow-400 shadow-[0_0_20px_rgba(14,165,233,1)] animate-scan"></div>
              <div className="text-white text-center">
                <div className="w-20 h-20 rounded-full border-4 border-glow-500 border-t-transparent animate-spin mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-1">AI Analyzing...</h3>
                <p className="text-glow-200 text-sm animate-pulse tracking-wide">Detecting skin patterns & imperfections</p>
              </div>
            </div>
          </div>
        )}

        {view === 'REVIEW' && analysisResult && (
          <div className="w-full h-full bg-slate-50 dark:bg-slate-950 flex flex-col overflow-y-auto no-scrollbar animate-fadeIn">
            {/* Review Header with Captured Image Preview */}
            <div className="relative h-64 flex-shrink-0">
               <img src={capturedImage || ''} alt="Result" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent"></div>
               <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="bg-glow-500 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-tighter uppercase mb-2 inline-block">Analysis Complete</span>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-none">Skin Report</h2>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Health Score</span>
                    <span className="text-3xl font-black text-glow-500">{analysisResult.overallScore}</span>
                  </div>
               </div>
            </div>

            {/* Metrics Grid */}
            <div className="px-6 space-y-6 pb-28">
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck className="text-glow-500" size={20} />
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Concern Breakdown</h3>
                  </div>
                  
                  <div className="space-y-5">
                    {Object.entries(analysisResult.metrics).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                            {key === 'acne' ? 'Jerawat' : key === 'wrinkles' ? 'Kerutan' : key === 'pigmentation' ? 'Pigmentasi' : 'Tekstur'}
                          </span>
                          <span className="text-xs font-black text-slate-500 dark:text-slate-400">{val as number}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            // Cast val to number to fix argument of type unknown is not assignable to parameter of type number error
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${getMetricColor(val as number)} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* AI Summary */}
               <div className="bg-glow-50 dark:bg-glow-900/10 rounded-3xl p-6 border border-glow-100 dark:border-glow-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="text-glow-600 dark:text-glow-400" size={18} />
                    <h3 className="font-bold text-glow-800 dark:text-glow-200 text-sm">AI Recommendation</h3>
                  </div>
                  <p className="text-sm text-glow-700 dark:text-glow-300 leading-relaxed italic">
                    "{analysisResult.summary}"
                  </p>
               </div>
            </div>

            {/* Action Buttons in Review */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 dark:from-slate-950 pt-10 flex gap-3">
              <button 
                onClick={() => setView('CAMERA')}
                className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Retake
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-4 bg-glow-500 text-white rounded-2xl font-bold shadow-lg shadow-glow-200 dark:shadow-none flex items-center justify-center gap-2 hover:bg-glow-600 transition-all active:scale-95"
              >
                Save to Track
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Controls */}
      {view === 'CAMERA' && (
        <div className="absolute bottom-0 left-0 right-0 p-10 flex justify-center bg-gradient-to-t from-black/90 to-transparent items-center gap-8">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20"
          >
            <Upload size={24} />
          </button>
          
          <button 
            onClick={captureImage}
            disabled={!isStreaming}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group"
          >
            <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform" />
          </button>
          
          <div className="w-14 h-14" /> {/* balance spacer */}
        </div>
      )}
    </div>
  );
};
