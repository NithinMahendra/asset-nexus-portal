
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Printer, Download, Share2, QrCode } from 'lucide-react';
import RoleBasedAccess from '@/components/RoleBasedAccess';
import { toast } from '@/components/ui/use-toast';

interface AssetQRCodeProps {
  assetId: string;
  assetName: string;
  isOpen: boolean;
  onClose: () => void;
}

const AssetQRCode = ({ assetId, assetName, isOpen, onClose }: AssetQRCodeProps) => {
  const [size, setSize] = useState(200);
  
  // Create the QR code URL with asset ID
  const qrValue = `${window.location.origin}/asset-scanner/${assetId}`;
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Asset QR Code - ${assetName}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              h2 { margin-bottom: 10px; }
              p { margin-bottom: 30px; color: #666; }
              .qrcode { margin: 0 auto; }
              .asset-details { margin-top: 20px; font-size: 14px; }
              .asset-id { font-family: monospace; background: #f5f5f5; padding: 4px; border-radius: 4px; }
              .footer { margin-top: 40px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <h2>${assetName}</h2>
            <p>Asset ID: <span class="asset-id">${assetId}</span></p>
            <div class="qrcode">
              ${document.getElementById('qr-code-to-print')?.innerHTML}
            </div>
            <div class="asset-details">
              <p>Scan this code to view details or report issues</p>
            </div>
            <div class="footer">
              <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
            <script>
              setTimeout(() => { window.print(); window.close(); }, 500);
            </script>
          </body>
        </html>
      `);
    }
  };
  
  const handleDownload = () => {
    const canvas = document.querySelector('#qr-code-to-print canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${assetName.replace(/\s+/g, '-')}-QR-${assetId.slice(0, 8)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "QR Code Downloaded",
        description: "The QR code image has been saved to your device",
      });
    }
  };
  
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      toast({
        title: "URL Copied",
        description: "Asset URL copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy URL:", err);
      toast({
        title: "Copy Failed",
        description: "Could not copy URL to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="mr-2 h-5 w-5" />
            Asset QR Code
          </DialogTitle>
          <DialogDescription>
            Scan this QR code to access asset information and submit service requests
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <div id="qr-code-to-print" className="border p-4 rounded-lg bg-white shadow-sm">
            <QRCodeSVG 
              value={qrValue}
              size={size}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/placeholder.svg",
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          
          <div className="text-center mt-4 space-y-1">
            <p className="font-semibold">{assetName}</p>
            <p className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
              {assetId}
            </p>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button size="sm" variant="outline" onClick={() => setSize(Math.min(size + 50, 400))}>
              Larger
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSize(Math.max(size - 50, 100))}>
              Smaller
            </Button>
          </div>
        </div>
        
        <RoleBasedAccess allowedRoles={['admin', 'employee']}>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-between">
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
          </div>
        </RoleBasedAccess>
      </DialogContent>
    </Dialog>
  );
};

export default AssetQRCode;
