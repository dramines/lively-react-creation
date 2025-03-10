
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { Download } from 'lucide-react';

interface PDFDownloadButtonProps {
  invoice: any;
  fileName: string;
  className?: string;
  children?: React.ReactNode;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ 
  invoice, 
  fileName, 
  className = "", 
  children 
}) => {
  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={fileName}
      className={className}
    >
      {({ loading }) => 
        loading ? (
          <span>Loading...</span>
        ) : (
          children || (
            <>
              <Download className="h-4 w-4" />
              Télécharger
            </>
          )
        )
      }
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
