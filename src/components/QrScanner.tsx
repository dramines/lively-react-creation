
import { useState, useEffect, useRef } from 'react';
import { X, QrCode, CameraOff, AlertTriangle } from 'lucide-react';
import { ReservationsService } from '../services/reservations.service';
import jsQR from 'jsqr';
import { useDebounce } from '../hooks/useDebounce';

interface QrScannerProps {
  onClose: () => void;
  onScan: (result: string) => void;
}

const QrScanner = ({ onClose, onScan }: QrScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [checkResult, setCheckResult] = useState<{
    status: 'checking' | 'exists' | 'not-exists' | null;
    message: string;
  }>({ status: null, message: '' });
  
  // Reference to animation frame to properly clean up
  const animationFrameId = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scannerIntervalRef = useRef<number | null>(null);
  
  // Debug state to show camera feed status
  const [debugInfo, setDebugInfo] = useState<string>('Initializing camera...');
  const debouncedDebugInfo = useDebounce(debugInfo, 300);

  useEffect(() => {
    // Function to initialize the camera
    const initCamera = async () => {
      try {
        console.log('Attempting to access camera...');
        setDebugInfo('Requesting camera access...');
        
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        setDebugInfo('Camera stream obtained');
        console.log('Camera access granted!');
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          try {
            await videoRef.current.play();
            setDebugInfo('Video playing, starting scan');
            console.log('Video playing, starting scan');
            // Start scanning after a short delay to ensure video is actually playing
            setTimeout(() => {
              startScanning();
            }, 500);
          } catch (err) {
            console.error("Error playing video:", err);
            setError("Erreur lors de la lecture vidéo. Veuillez réessayer.");
            setDebugInfo('Error playing video');
          }
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
        setDebugInfo('Camera access error');
      }
    };

    if (scanning) {
      initCamera();
    }
    
    return () => {
      // Cleanup function to stop camera and animation frame
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      
      if (scannerIntervalRef.current) {
        clearInterval(scannerIntervalRef.current);
        scannerIntervalRef.current = null;
      }
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [scanning]);

  const startScanning = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) {
      console.log('Cannot start scanning: conditions not met');
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      console.log('Cannot get canvas context');
      return;
    }
    
    console.log('Starting QR scanning...');
    setDebugInfo('Scanning for QR codes...');
    
    // Clear any existing interval
    if (scannerIntervalRef.current) {
      clearInterval(scannerIntervalRef.current);
    }
    
    // Set up an interval to scan more frequently (every 100ms)
    scannerIntervalRef.current = window.setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Match canvas dimensions to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for QR code detection
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Use jsQR to detect QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });
        
        if (code) {
          console.log("QR code detected:", code.data);
          setDebugInfo('QR code found: ' + code.data);
          
          // Stop scanning interval
          if (scannerIntervalRef.current) {
            clearInterval(scannerIntervalRef.current);
            scannerIntervalRef.current = null;
          }
          
          // Stop scanning and check the reservation
          setScanning(false);
          checkReservation(code.data);
        } else {
          // Only update debug info occasionally to avoid too many re-renders
          if (Math.random() < 0.1) { // 10% chance to update
            setDebugInfo('Scanning... No QR code detected yet');
          }
        }
      } else {
        setDebugInfo(`Video state: ${video.readyState} (waiting for data)`);
      }
    }, 50); // Scan every 50ms for better responsiveness
  };

  const checkReservation = async (orderId: string) => {
    setCheckResult({ status: 'checking', message: 'Vérification de la réservation...' });
    
    try {
      const reservation = await ReservationsService.getReservationByOrderId(orderId);
      
      if (reservation) {
        setCheckResult({ 
          status: 'exists', 
          message: `Réservation trouvée: ${reservation.first_name} ${reservation.last_name} - ${reservation.event_name}` 
        });
        // Wait a moment to show the success message before calling onScan
        setTimeout(() => {
          onScan(orderId);
        }, 1500);
      } else {
        setCheckResult({ 
          status: 'not-exists', 
          message: `Aucune réservation trouvée avec l'ID: ${orderId}` 
        });
      }
    } catch (error) {
      console.error("Error checking reservation:", error);
      setCheckResult({ 
        status: 'not-exists', 
        message: 'Erreur lors de la vérification de la réservation.' 
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);
            
            // Get image data for QR code detection
            const imageData = context.getImageData(0, 0, img.width, img.height);
            
            // Use jsQR to detect QR code
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            });
            
            if (code) {
              checkReservation(code.data);
            } else {
              setCheckResult({ 
                status: 'not-exists', 
                message: 'Aucun code QR valide détecté dans l\'image.' 
              });
            }
          }
          
          // Clean up object URL
          URL.revokeObjectURL(imageUrl);
        };
        
        img.src = imageUrl;
      } catch (err) {
        console.error("Error processing image:", err);
        setCheckResult({ 
          status: 'not-exists', 
          message: 'Erreur lors du traitement de l\'image.' 
        });
      }
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      await checkReservation(manualInput.trim());
    }
  };

  const handleRestartScan = () => {
    setScanning(true);
    setCheckResult({ status: null, message: '' });
    setDebugInfo('Restarting scan...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-800 rounded-lg max-w-md w-full overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <QrCode className="h-5 w-5 text-gold-400" />
            Scanner un code QR
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          {error ? (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-3 mb-4">
              <CameraOff className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          ) : checkResult.status ? (
            <div className={`p-4 rounded-lg flex items-start gap-3 mb-4 ${
              checkResult.status === 'checking' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' :
              checkResult.status === 'exists' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
              'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}>
              {checkResult.status === 'checking' ? (
                <div className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : checkResult.status === 'exists' ? (
                <div className="h-5 w-5 bg-green-400 rounded-full flex items-center justify-center text-black font-bold">✓</div>
              ) : (
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{checkResult.message}</p>
                {checkResult.status !== 'checking' && (
                  <button 
                    onClick={handleRestartScan}
                    className="text-xs underline mt-2"
                  >
                    Scanner un autre code
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video 
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                ></video>
                <canvas 
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full opacity-0" 
                ></canvas>
                <div className="absolute inset-0 border-2 border-gold-400/50 rounded-lg pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-1/2 h-1/2 border-2 border-gold-400 rounded-lg"></div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-xs text-white p-1 rounded">
                  {debouncedDebugInfo}
                </div>
              </div>
              <div className="text-center mb-3">
                <button 
                  onClick={handleRestartScan}
                  className="text-xs text-gold-400 underline"
                >
                  Réinitialiser la caméra
                </button>
              </div>
            </>
          )}
          
          <div className="mt-4">
            {!checkResult.status && (
              <p className="text-sm text-gray-400 mb-3">
                Positionnez le code QR dans le cadre pour le scanner automatiquement.
              </p>
            )}
            
            <div className="border-t border-gray-700 pt-4 mt-4">
              <form onSubmit={handleManualSubmit} className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Ou entrez un ID de réservation manuellement :</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="input flex-1" 
                    placeholder="Ex: RES-12345"
                  />
                  <button 
                    type="submit"
                    className="btn-primary whitespace-nowrap"
                    disabled={!manualInput.trim()}
                  >
                    Vérifier
                  </button>
                </div>
              </form>

              <p className="text-sm text-gray-400 mb-2">Ou chargez une image contenant un code QR :</p>
              <label className="btn-secondary w-full justify-center cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                Importer une image
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 text-center">
          <button 
            onClick={onClose}
            className="btn-secondary"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrScanner;