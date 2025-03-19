
import { FileText, Filter, Plus, Search, Tag, Clock, Download, UploadCloud } from 'lucide-react';
import { useState } from 'react';

interface Document {
  id: string;
  nom: string;
  type: string;
  date: string;
  taille: string;
  url?: string;
}

interface DocumentsListProps {
  documents: Document[];
  onAddDocument: () => void;
}

const DocumentsList = ({ documents, onAddDocument }: DocumentsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || doc.type.includes(fileTypeFilter);
    return matchesSearch && matchesType;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return 'image';
    } else if (fileType.includes('pdf')) {
      return 'pdf';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return 'doc';
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return 'sheet';
    } else {
      return 'file';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">Documents</h2>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={onAddDocument}
        >
          <UploadCloud className="h-5 w-5" />
          Ajouter un document
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un document..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="input appearance-none pr-10 pl-4"
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="pdf">PDF</option>
              <option value="application">Documents</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="space-y-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded flex items-center justify-center ${
                    getFileIcon(doc.type) === 'image' ? 'bg-purple-600' :
                    getFileIcon(doc.type) === 'pdf' ? 'bg-red-600' :
                    getFileIcon(doc.type) === 'doc' ? 'bg-blue-600' :
                    getFileIcon(doc.type) === 'sheet' ? 'bg-green-600' :
                    'bg-gray-600'
                  }`}>
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.nom}</h4>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Tag className="h-3 w-3 mr-1" />
                      <span className="mr-2">
                        {doc.type.split('/')[1] ? doc.type.split('/')[1].toUpperCase() : doc.type}
                      </span>
                      <Clock className="h-3 w-3 mr-1 ml-2" />
                      <span className="mr-2">
                        {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </span>
                      <FileText className="h-3 w-3 mr-1 ml-2" />
                      <span>{doc.taille}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {doc.url && (
                    <a 
                      href={doc.url} 
                      download={doc.nom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400">Aucun document trouvé</p>
              <button 
                onClick={onAddDocument}
                className="mt-4 btn-secondary"
              >
                Ajouter un document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsList;
