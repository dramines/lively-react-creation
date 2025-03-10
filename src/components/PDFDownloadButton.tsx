
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { Download } from 'lucide-react';
import { Invoice } from '../types';

interface PDFDownloadButtonProps {
  invoice: Invoice;
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
      {({ loading }) => (
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
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
