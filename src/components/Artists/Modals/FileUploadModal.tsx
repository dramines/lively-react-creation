
import { FileText, Trash2, UploadCloud } from 'lucide-react';
import Modal from '../../Modal';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  uploadProgress: number;
  isUploading: boolean;
  onUpload: () => void;
}

const FileUploadModal = ({
  isOpen,
  onClose,
  selectedFile,
  setSelectedFile,
  uploadProgress,
  isUploading,
  onUpload
}: FileUploadModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isUploading && onClose()}
      title="Ajouter un document"
    >
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
          {selectedFile ? (
            <div className="space-y-2">
              <div className="bg-gray-700/50 p-3 rounded flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-gold-400 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                {!isUploading && (
                  <button 
                    onClick={() => setSelectedFile(null)} 
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                className="btn-primary w-full"
                onClick={onUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Téléchargement en cours...' : 'Télécharger ce fichier'}
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300 mb-2">Glissez-déposez vos fichiers ici ou</p>
              <div>
                <label className="btn-secondary cursor-pointer">
                  <span>Parcourir</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2">Taille maximale: 5MB</p>
            </>
          )}
        </div>
        
        {isUploading && (
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold-400" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-400">{uploadProgress}%</p>
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isUploading}
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FileUploadModal;
