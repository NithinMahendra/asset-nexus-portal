
import React, { useState, useEffect } from 'react';
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
import { ScanLine } from 'lucide-react';

interface AssetQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (assetId: string) => void;
}

const AssetQRScanner = ({ isOpen, onClose, onSuccess }: AssetQRScannerProps) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const navigate = useNavigate();
  
  const handleScan = (result: string | null) => {
    if (result) {
      try {
        // Extract the assetId from the URL pattern
        const url = new URL(result);
        const pathParts = url.pathname.split('/');
        const assetIdIndex = pathParts.findIndex(p => p === 'asset-scanner') + 1;
        
        if (assetIdIndex > 0 && assetIdIndex < pathParts.length) {
          const assetId = pathParts[assetIdIndex];
          toast({
            title: "QR Code Scanned",
            description: `Asset ID: ${assetId}`,
          });
          
          if (onSuccess) {
            onSuccess(assetId);
          } else {
            navigate(`/asset-scanner/${assetId}`);
          }
          onClose();
        } else {
          toast({
            title: "Invalid QR Code",
            description: "This doesn't appear to be a valid asset QR code",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error scanning code",
          description: "Please try again with a valid asset QR code",
          variant: "destructive"
        });
      }
    }
  };

  const handleError = (error: Error) => {
    console.error("QR Scanner error:", error);
    toast({
      title: "Camera Error",
      description: "Unable to access camera. Please check permissions and try again.",
      variant: "destructive"
    });
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
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
                onError={handleError}
                className="w-full h-full"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-primary w-1/2 h-1/2 rounded-lg opacity-50"></div>
              <ScanLine className="absolute text-primary animate-pulse w-1/4 h-1/4" />
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button onClick={toggleCamera} variant="outline">
            Switch Camera
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssetQRScanner;
