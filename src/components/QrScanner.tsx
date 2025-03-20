import { useState, useEffect, useRef } from 'react';
import { X, QrCode, CameraOff, AlertTriangle, Check } from 'lucide-react';
import { ReservationsService } from '../services/reservations.service';
import { useDebounce } from '../hooks/useDebounce';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
  onClose: () => void;
  onScan: (result: string) => void;
}

const QrScanner = ({ onClose, onScan }: QrScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [checkResult, setCheckResult] = useState<{
    status: 'checking' | 'exists' | 'not-exists' | null;
    message: string;
  }>({ status: null, message: '' });
  
  // Debug state to show camera feed status
  const [debugInfo, setDebugInfo] = useState<string>('Initializing scanner...');
  const debouncedDebugInfo = useDebounce(debugInfo, 300);
  
  // References
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement | null>(null);
  const isScanning = useRef<boolean>(false);

  useEffect(() => {
    // Only initialize the scanner when scanning is true
    if (scanning && scannerDivRef.current) {
      initScanner();
    }
    
    // Cleanup function
    return () => {
      if (scannerRef.current && isScanning.current) {
        try {
          scannerRef.current.stop()
            .then(() => {
              console.log('Scanner stopped');
              isScanning.current = false;
            })
            .catch(err => {
              console.error('Failed to stop scanner during cleanup:', err);
            });
        } catch (err) {
          // Only log the error if it's not the "not running" error
          if (!err.toString().includes('not running')) {
            console.error('Error cleaning up scanner:', err);
          }
        }
      }
    };
  }, [scanning]);

  const initScanner = async () => {
    try {
      setDebugInfo('Initializing QR scanner...');
      
      // Only attempt to stop if currently scanning
      if (scannerRef.current && isScanning.current) {
        try {
          await scannerRef.current.stop();
          isScanning.current = false;
        } catch (err) {
          // Ignore "not running" errors
          if (!err.toString().includes('not running')) {
            console.error('Error stopping scanner before reinitialization:', err);
          }
        }
      }
      
      if (!scannerDivRef.current) {
        setError("Scanner container not available");
        return;
      }
      
      // Create new instance
      scannerRef.current = new Html5Qrcode('qr-reader');
      
      const qrCodeSuccessCallback = (decodedText: string) => {
        console.log("QR Code detected:", decodedText);
        setDebugInfo(`QR code found: ${decodedText}`);
        
        // Stop scanning
        if (scannerRef.current && isScanning.current) {
          scannerRef.current.stop()
            .then(() => {
              console.log('Scanner stopped after detection');
              isScanning.current = false;
              setScanning(false);
              checkReservation(decodedText);
            })
            .catch(err => {
              console.error('Failed to stop scanner:', err);
              // Still check the reservation even if stopping fails
              setScanning(false);
              isScanning.current = false;
              checkReservation(decodedText);
            });
        } else {
          setScanning(false);
          checkReservation(decodedText);
        }
      };
      
      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        formatsToSupport: [0], // 0 is for QR Code format
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true // Use native BarcodeDetector API if available
        }
      };
      
      // Start scanning
      scannerRef.current.start(
        { facingMode: "environment" }, // Use back camera
        config,
        qrCodeSuccessCallback,
        (errorMessage: string) => {
          // This is just for temporary scan errors, not for fatal errors
          if (Math.random() < 0.05) { // Only log occasionally to prevent spam
            setDebugInfo(`Scanning... ${errorMessage}`);
          }
        }
      )
      .then(() => {
        isScanning.current = true;
        setDebugInfo('Scanner started, looking for QR codes...');
        console.log("QR Code scanning started");
      })
      .catch((err: any) => {
        console.error("Failed to start scanner:", err);
        setDebugInfo('Failed to start scanner');
        setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
      });
    } catch (err) {
      console.error("Error initializing scanner:", err);
      setError("Erreur lors de l'initialisation du scanner");
    }
  };

  const checkReservation = async (orderId: string) => {
    setCheckResult({ status: 'checking', message: 'Vérification de la réservation...' });
    
    try {
      const result = await ReservationsService.validateReservation(orderId);
      
      if (result.success) {
        setCheckResult({ 
          status: 'exists', 
          message: `Réservation trouvée: ${result.reservation.first_name} ${result.reservation.last_name} - ${result.reservation.event_name}` 
        });
        // Wait a moment to show the success message before calling onScan
        setTimeout(() => {
          onScan(orderId);
        }, 1500);
      } else {
        setCheckResult({ 
          status: 'not-exists', 
          message: result.message
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
    if (!file) return;
    
    try {
      setCheckResult({ status: 'checking', message: 'Analyse de l\'image...' });
      
      if (scannerRef.current && isScanning.current) {
        try {
          await scannerRef.current.stop();
          isScanning.current = false;
        } catch (err) {
          // Ignore "not running" errors
          if (!err.toString().includes('not running')) {
            console.error("Error stopping scanner for file upload:", err);
          }
        }
      }
      
      if (scannerRef.current) {
        scannerRef.current.scanFile(file, true)
          .then((decodedText: string) => {
            checkReservation(decodedText);
          })
          .catch((err: Error) => {
            console.error("Error scanning file:", err);
            setCheckResult({ 
              status: 'not-exists', 
              message: 'Aucun code QR valide détecté dans l\'image.' 
            });
          });
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setCheckResult({ 
        status: 'not-exists', 
        message: 'Erreur lors du traitement de l\'image.' 
      });
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
    
    // Short timeout to ensure clean restart
    setTimeout(() => {
      initScanner();
    }, 100);
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
                <Check className="h-5 w-5 flex-shrink-0" />
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
                <div 
                  id="qr-reader" 
                  ref={scannerDivRef}
                  className="w-full h-full"
                ></div>
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
