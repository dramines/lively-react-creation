import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  X
} from 'lucide-react';
import { FilesService } from '../services/files.service';
import { InvoicesService } from '../services';
import Modal from '../components/Modal';
import InvoicePDF from '../components/InvoicePDF';
import PDFDownloadButton from '../components/PDFDownloadButton';
import { toast } from 'react-hot-toast';
import { Invoice } from '../types';

interface FileType {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'devis';
  size: string;
  date: string;
  url?: string;
  content?: Invoice; // For devis content
}

const FileManager = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDate, setSelectedDate] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const apiFiles = await FilesService.getAllFiles();
        
        const invoices = await InvoicesService.getAllInvoices();
        
        const invoiceFiles = invoices.map(invoice => ({
          id: invoice.id || '',
          name: `Devis ${invoice.numeroFacture}`,
          type: 'devis' as const,
          size: '1 MB',
          date: invoice.dateFacture || '',
          content: invoice
        }));

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
        
        const fileWithCorrectType = {
          ...newFile,
          type: newFile.type as 'pdf' | 'image' | 'document' | 'devis'
        };
        
        setFiles(prev => [...prev, fileWithCorrectType]);
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

  const handleView = (file: FileType) => {
    setSelectedFile(file);
    setIsViewModalOpen(true);
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
                          {(file.type === 'pdf' || file.type === 'devis') && (
                            <button 
                              className="btn-secondary p-2"
                              onClick={() => handleView(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {file.type === 'devis' && file.content ? (
                            <PDFDownloadButton
                              invoice={file.content}
                              fileName={`devis_${file.content.numeroFacture}.pdf`}
                              className="btn-secondary p-2"
                            >
                              <Download className="h-4 w-4" />
                            </PDFDownloadButton>
                          ) : (
                            <button className="btn-secondary p-2">
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            className="btn-secondary p-2 text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(file.id, file.type)}
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
                                {(file.type === 'pdf' || file.type === 'devis') && (
                                  <button 
                                    className="btn-secondary p-2"
                                    onClick={() => handleView(file)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                )}
                                {file.type === 'devis' && file.content ? (
                                  <PDFDownloadButton
                                    invoice={file.content}
                                    fileName={`devis_${file.content.numeroFacture}.pdf`}
                                    className="btn-secondary p-2"
                                  >
                                    <Download className="h-4 w-4" />
                                  </PDFDownloadButton>
                                ) : (
                                  <button className="btn-secondary p-2">
                                    <Download className="h-4 w-4" />
                                  </button>
                                )}
                                <button 
                                  className="btn-secondary p-2 text-red-400 hover:text-red-300"
                                  onClick={() => handleDelete(file.id, file.type)}
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

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFile(null);
        }}
        title={selectedFile?.name || ''}
      >
        {selectedFile?.type === 'devis' && selectedFile.content ? (
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
                      <span>{(item.quantite * item.prixUnitaire).toFixed(2)} €</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.quantite} x {item.prixUnitaire.toFixed(2)} € ({item.taxes}% TVA)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant HT</span>
                  <span>{selectedFile.content.montantHT.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TVA</span>
                  <span>{selectedFile.content.montantTVA.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total TTC</span>
                  <span>{selectedFile.content.total.toFixed(2)} €</span>
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
              <PDFDownloadButton
                invoice={selectedFile.content}
                fileName={`devis_${selectedFile.content.numeroFacture}.pdf`}
                className="btn-primary flex items-center gap-2"
              >
                <>
                  <Download className="h-4 w-4" />
                  Télécharger
                </>
              </PDFDownloadButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedFile?.type === 'image' && selectedFile.url ? (
              <img 
                src={selectedFile.url} 
                alt={selectedFile.name}
                className="max-w-full rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                {selectedFile && (
                  React.createElement(getFileIcon(selectedFile.type), {
                    className: "h-24 w-24 text-gray-400"
                  })
                )}
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedFile(null);
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FileManager;
