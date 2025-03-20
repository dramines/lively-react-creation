import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Search,
  Calendar as CalendarIcon,
  Download,
  Eye,
  File,
  FileText,
  Image as ImageIcon,
  Upload,
  Grid,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { FilesService } from '../services/files.service';
import { InvoicesService } from '../services';
import Modal from '../components/Modal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../components/InvoicePDF';
import { toast } from 'react-hot-toast';

interface File {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'devis';
  size: string;
  date: string;
  url?: string;
  content?: any; // For devis content
}

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const FileManager = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDate, setSelectedDate] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Load files and invoices from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load files from API
        const apiFiles = await FilesService.getAllFiles();
        
        // Load invoices from API
        const invoices = await InvoicesService.getAllInvoices();
        
        // Convert invoices to file format
        const invoiceFiles = invoices.map(invoice => ({
          id: invoice.id || '',
          name: `Devis ${invoice.numeroFacture}`,
          type: 'devis' as const,
          size: '1 MB',
          date: invoice.dateFacture,
          content: invoice
        }));

        // Combine API files with invoice files
        const allFiles = [...apiFiles, ...invoiceFiles];
        setFiles(allFiles);
      } catch (error) {
        console.error('Error loading files:', error);
        toast.error('Error loading files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setIsUploadModalOpen(false);
      
      try {
        const newFile = await FilesService.uploadFile(uploadedFile);
        
        // Type fix to ensure newFile conforms to File interface
        const typedNewFile: File = {
          id: newFile.id,
          name: newFile.name,
          type: newFile.type as 'pdf' | 'image' | 'document' | 'devis',
          size: newFile.size,
          date: newFile.date,
          url: newFile.url
        };
        
        setFiles(prev => [...prev, typedNewFile]);
        toast.success('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload file. Please try again.');
      }
    }
  };

  const handleDelete = async (id: string, type: string) => {
    try {
      if (type === 'devis') {
        await InvoicesService.deleteInvoice(id);
      } else {
        await FilesService.deleteFile(id);
      }
      
      const updatedFiles = files.filter(file => file.id !== id);
      setFiles(updatedFiles);
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file. Please try again.');
    }
  };

  const handleView = (file: File) => {
    setSelectedFile(file);
    setPageNumber(1); // Reset page number
    setIsViewModalOpen(true);
  };

  // Open file in new tab
  const handleOpenInNewTab = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'image':
        return ImageIcon;
      case 'devis':
        return FileText;
      default:
        return File;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || file.date.includes(selectedDate);
    return matchesSearch && matchesDate;
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setPdfError('Failed to load PDF. Please try downloading the file instead.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gestionnaire de fichiers</h1>
        <button 
          onClick={() => setIsUploadModalOpen(true)} 
          className="btn-primary flex items-center gap-2"
        >
          <Upload className="h-5 w-5" />
          Téléverser
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Chargement des fichiers...</div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des fichiers..."
                  className="input pr-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="date"
                  className="input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <button
                className={`btn-secondary ${viewMode === 'grid' ? 'bg-gray-600' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`btn-secondary ${viewMode === 'list' ? 'bg-gray-600' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.length === 0 ? (
                <div className="col-span-4 text-center py-12 text-gray-400">
                  Aucun fichier trouvé.
                </div>
              ) : (
                filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="card hover:border-gold-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-center h-32 bg-gray-800 rounded-lg mb-4">
                        {file.type === 'image' && file.url ? (
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="h-full w-full object-contain rounded-lg"
                          />
                        ) : (
                          <FileIcon className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium truncate" title={file.name}>
                          {file.name}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>{file.size}</span>
                          <span>{new Date(file.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-end gap-2">
                          {(file.type === 'pdf' || file.type === 'image') && file.url && (
                            <button 
                              className="btn-secondary p-2"
                              onClick={() => handleOpenInNewTab(file.url)}
                              title="Visualiser"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          )}
                          {(file.type === 'pdf' || file.type === 'devis') && (
                            <button 
                              className="btn-secondary p-2"
                              onClick={() => handleView(file)}
                              title="Aperçu"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {file.type === 'devis' ? (
                            <PDFDownloadLink
                              document={<InvoicePDF invoice={file.content} />}
                              fileName={`devis_${file.content.numeroFacture}.pdf`}
                              className="btn-secondary p-2"
                            >
                              {({ loading }) => 
                                loading ? (
                                  <span className="loading">...</span>
                                ) : (
                                  <Download className="h-4 w-4" />
                                )
                              }
                            </PDFDownloadLink>
                          ) : (
                            <a 
                              href={file.url} 
                              download={file.name}
                              className="btn-secondary p-2"
                              title="Télécharger"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                          <button 
                            className="btn-secondary p-2 text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(file.id, file.type)}
                            title="Supprimer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-3 font-semibold text-gray-400">Nom</th>
                      <th className="pb-3 font-semibold text-gray-400">Type</th>
                      <th className="pb-3 font-semibold text-gray-400">Taille</th>
                      <th className="pb-3 font-semibold text-gray-400">Date</th>
                      <th className="pb-3 font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-400">
                          Aucun fichier trouvé.
                        </td>
                      </tr>
                    ) : (
                      filteredFiles.map((file) => {
                        const FileIcon = getFileIcon(file.type);
                        return (
                          <tr
                            key={file.id}
                            className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                          >
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <FileIcon className="h-5 w-5 text-gray-400" />
                                <span>{file.name}</span>
                              </div>
                            </td>
                            <td className="py-4">{file.type}</td>
                            <td className="py-4">{file.size}</td>
                            <td className="py-4">
                              {new Date(file.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-4">
                              <div className="flex gap-2">
                                {(file.type === 'pdf' || file.type === 'image') && file.url && (
                                  <button 
                                    className="btn-secondary p-2"
                                    onClick={() => handleOpenInNewTab(file.url)}
                                    title="Visualiser"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </button>
                                )}
                                {(file.type === 'pdf' || file.type === 'devis') && (
                                  <button 
                                    className="btn-secondary p-2"
                                    onClick={() => handleView(file)}
                                    title="Aperçu"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                )}
                                {file.type === 'devis' ? (
                                  <PDFDownloadLink
                                    document={<InvoicePDF invoice={file.content} />}
                                    fileName={`devis_${file.content.numeroFacture}.pdf`}
                                    className="btn-secondary p-2"
                                  >
                                    {({ loading }) => 
                                      loading ? (
                                        <span className="loading">...</span>
                                      ) : (
                                        <Download className="h-4 w-4" />
                                      )
                                    }
                                  </PDFDownloadLink>
                                ) : (
                                  <a 
                                    href={file.url}
                                    download={file.name}
                                    className="btn-secondary p-2"
                                    title="Télécharger"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                )}
                                <button 
                                  className="btn-secondary p-2 text-red-400 hover:text-red-300"
                                  onClick={() => handleDelete(file.id, file.type)}
                                  title="Supprimer"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Téléverser un fichier"
      >
        <div className="space-y-4">
          <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*,application/pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-400">
                Cliquez ou glissez un fichier ici pour le téléverser
              </p>
              <p className="text-sm text-gray-500">
                Formats acceptés: Images, PDF, Documents
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFile(null);
          setPageNumber(1);
        }}
        title={selectedFile?.name || ''}
      >
        {selectedFile?.type === 'devis' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Client</h3>
                <p className="text-white">{selectedFile.content.clientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Date</h3>
                <p className="text-white">
                  {new Date(selectedFile.content.dateFacture).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Articles</h3>
              <div className="space-y-2">
                {selectedFile.content.items.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>{item.description}</span>
                      <span>{(item.quantite * item.prixUnitaire).toFixed(2)} TND</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.quantite} x {item.prixUnitaire.toFixed(2)} TND ({item.taxes}% TVA)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant HT</span>
                  <span>{selectedFile.content.montantHT.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TVA</span>
                  <span>{selectedFile.content.montantTVA.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total TTC</span>
                  <span>{selectedFile.content.total.toFixed(2)} TND</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedFile(null);
                }}
              >
                Fermer
              </button>
              <PDFDownloadLink
                document={<InvoicePDF invoice={selectedFile.content} />}
                fileName={`devis_${selectedFile.content.numeroFacture}.pdf`}
                className="btn-primary flex items-center gap-2"
              >
                {({ loading }) => 
                  loading ? (
                    <span>Génération du PDF...</span>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Télécharger
                    </>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedFile?.type === 'image' && selectedFile.url ? (
              <div className="flex justify-center">
                <img 
                  src={selectedFile.url} 
                  alt={selectedFile.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            ) : selectedFile?.type === 'pdf' && selectedFile.url ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center w-full">
                  {/* Instead of trying to render PDF, show simplified preview info */}
                  <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg gap-4">
                    <FileText className="h-16 w-16 text-gray-400" />
                    <div className="text-center">
                      <p className="mb-2">Fichier PDF</p>
                      <p className="text-sm text-gray-400">{selectedFile.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                {selectedFile && (
                  React.createElement(getFileIcon(selectedFile.type), {
                    className: "h-24 w-24 text-gray-400"
                  })
                )}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedFile(null);
                  setPageNumber(1);
                }}
              >
                Fermer
              </button>
              {selectedFile && selectedFile.url && (
                <>
                  <a
                    href={selectedFile.url}
                    download={selectedFile.name}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </a>
                  <button
                    onClick={() => handleOpenInNewTab(selectedFile.url)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visualiser
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FileManager;
