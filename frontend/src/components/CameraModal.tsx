import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraModal: React.FC<Props> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Convert dataUrl to File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          onClose();
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-clarity-darkBrown p-2 z-10 transition-colors">
          <X className="w-8 h-8" />
        </button>

        <div className="p-8 pb-0">
           <h2 className="text-3xl font-bold text-clarity-darkBrown mb-2">Utilisez votre caméra</h2>
           <p className="text-clarity-muted font-medium mb-6">Prenez une photo nette de votre page de notes.</p>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center m-8 mt-2 rounded-[2rem] overflow-hidden border-4 border-clarity-beige">
          {!capturedImage ? (
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
             <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-8 pt-0 flex gap-4">
          {!capturedImage ? (
            <button
              onClick={takePhoto}
              className="flex-1 bg-clarity-brown text-white font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-clarity-darkBrown transition-all transform active:scale-95"
            >
              <Camera className="w-6 h-6 text-clarity-beige" />
              Prendre la photo
            </button>
          ) : (
            <>
              <button
                onClick={() => setCapturedImage(null)}
                className="flex-1 bg-clarity-beige text-clarity-brown font-extrabold py-5 rounded-2xl border border-clarity-lightBrown flex items-center justify-center gap-3 hover:bg-clarity-lightBrown hover:text-white transition-all transform active:scale-95"
              >
                <RefreshCw className="w-6 h-6" />
                Reprendre
              </button>
              <button
                onClick={confirmPhoto}
                className="flex-1 bg-green-600 text-white font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-green-700 transition-all transform active:scale-95"
              >
                <CheckCircle className="w-6 h-6" />
                Utiliser cette photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
