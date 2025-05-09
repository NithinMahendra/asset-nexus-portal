
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ScanLine, Camera, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AssetQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (assetId: string) => void;
}

const AssetQRScanner = ({ isOpen, onClose, onSuccess }: AssetQRScannerProps) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const handleScan = (result: string | null) => {
    if (!result || !scanning) return;
    
    try {
      // Extract the assetId from the URL pattern
      const url = new URL(result);
      const pathParts = url.pathname.split('/');
      const assetIdIndex = pathParts.findIndex(p => p === 'asset-scanner') + 1;
      
      if (assetIdIndex > 0 && assetIdIndex < pathParts.length) {
        // Stop scanning once we've found a valid QR code
        setScanning(false);
        
        const assetId = pathParts[assetIdIndex];
        console.log("Successfully scanned asset ID:", assetId);
        
        toast({
          title: "QR Code Scanned Successfully",
          description: `Loading asset information...`,
          variant: "default"
        });
        
        if (onSuccess) {
          onSuccess(assetId);
        } else {
          navigate(`/asset-scanner/${assetId}`);
        }
        onClose();
      } else {
        setScanError("Invalid asset QR code format");
        console.error("Invalid QR code format:", result);
      }
    } catch (error) {
      setScanError("Unable to process QR code");
      console.error("QR code processing error:", error);
    }
  };

  const handleError = (error: unknown) => {
    console.error("QR Scanner error:", error);
    setScanError("Camera access error. Please check permissions.");
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };
  
  const resetScan = () => {
    setScanError(null);
    setScanning(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Asset QR Code</DialogTitle>
          <DialogDescription>
            Point your camera at an asset QR code to view details or report issues
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          {scanError ? (
            <div className="w-full aspect-square overflow-hidden rounded-lg border flex flex-col items-center justify-center p-4">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{scanError}</AlertDescription>
              </Alert>
              <Button onClick={resetScan} className="mt-2">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="w-full aspect-square overflow-hidden rounded-lg border">
              {isOpen && (
                <QrReader
                  constraints={{ facingMode }}
                  scanDelay={500}
                  onResult={(result) => {
                    if (result) {
                      handleScan(result.getText());
                    }
                  }}
                  className="w-full h-full"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-primary w-1/2 h-1/2 rounded-lg opacity-50"></div>
                <ScanLine className="absolute text-primary animate-pulse w-1/4 h-1/4" />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button onClick={toggleCamera} variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            {facingMode === 'user' ? 'Use Back Camera' : 'Use Front Camera'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssetQRScanner;
