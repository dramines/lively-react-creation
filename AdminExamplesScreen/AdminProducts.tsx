
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Edit, Trash2, Upload, Image, ArrowLeft, X, Search, Filter, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductStats } from '@/components/admin/ProductStats';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Product {
  id_product: number;
  reference_product: string;
  nom_product: string;
  img_product?: string;
  img2_product?: string;
  img3_product?: string;
  img4_product?: string;
  description_product?: string;
  type_product?: string;
  category_product?: string;
  itemgroup_product?: string;
  price_product: number;
  qnty_product: number;
  color_product?: string;
  status_product: 'active' | 'inactive' | 'draft';
  discount_product: number;
  createdate_product: string;
  [key: string]: any;
}

// Move ProductModalContent outside to prevent re-renders
const ProductModalContent = ({ 
  isEdit = false, 
  onSubmit, 
  title, 
  formData,
  setFormData,
  selectedImages,
  setSelectedImages,
  imagePreviewUrls,
  setImagePreviewUrls,
  isDragOver,
  setIsDragOver,
  isLoading,
  resetForm,
  setIsDialogOpen,
  setIsEditDialogOpen,
  setEditingProduct
}: { 
  isEdit?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  formData: any;
  setFormData: any;
  selectedImages: File[];
  setSelectedImages: any;
  imagePreviewUrls: string[];
  setImagePreviewUrls: any;
  isDragOver: boolean;
  setIsDragOver: any;
  isLoading: boolean;
  resetForm: () => void;
  setIsDialogOpen: any;
  setIsEditDialogOpen: any;
  setEditingProduct: any;
}) => {
  const productTypes = {
    'sur mesure': {
      'homme': ['blazers', 'blouson', 'manteau', 'djine', 'slack', 'pantalon'],
      'femme': ['chemise', 'costume', 'blazer']
    },
    'prêt à porter': ['chemise', 'tshirt', 'polo', 'chaussure', 'ceinture', 'maroquinerie'],
    'accessoires': ['cravate', 'pochette', 'maroquinerie', 'autre']
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'type_product' && value !== prev.type_product) {
        newData.category_product = '';
        newData.itemgroup_product = '';
      }
      else if (field === 'category_product' && value !== prev.category_product) {
        newData.itemgroup_product = '';
      }
      
      // Auto-calculate quantity when size fields change or itemgroup changes
      if (field.includes('_size') || field === 'itemgroup_product') {
        const calculatedQuantity = calculateTotalQuantity(newData);
        if (shouldShowSizes(newData.itemgroup_product)) {
          newData.qnty_product = calculatedQuantity.toString();
        }
      }
      
      return newData;
    });
  };

  // Calculate total quantity from all size fields
  const calculateTotalQuantity = (data: any) => {
    const sizeFields = [
      's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', 'xs_size',
      '48_size', '50_size', '52_size', '54_size', '56_size', '58_size'
    ];
    
    return sizeFields.reduce((total, field) => {
      const value = parseInt(data[field]) || 0;
      return total + value;
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length + selectedImages.length > 4) {
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedImages.length > 4) {
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    if (imagePreviewUrls[index] && imagePreviewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const getCategoryOptions = () => {
    if (formData.type_product === 'sur mesure') {
      return Object.keys(productTypes['sur mesure']);
    }
    return [];
  };

  const getItemGroupOptions = () => {
    if (formData.type_product === 'sur mesure' && formData.category_product) {
      return productTypes['sur mesure'][formData.category_product as keyof typeof productTypes['sur mesure']] || [];
    }
    if (formData.type_product === 'prêt à porter') {
      return productTypes['prêt à porter'];
    }
    if (formData.type_product === 'accessoires') {
      return productTypes['accessoires'];
    }
    return [];
  };

  const shouldShowLetterSizes = () => {
    const letterSizeCategories = ['chemise', 'tshirt', 'polo', 'blazer'];
    return letterSizeCategories.includes(formData.itemgroup_product);
  };

  const shouldShowCostumeSizes = () => {
    const costumeSizeCategories = ['costume', 'blazers', 'blouson', 'manteau', 'pantalon', 'slack'];
    return costumeSizeCategories.includes(formData.itemgroup_product);
  };

  const shouldShowShoeSizes = () => {
    // For now, disable shoe sizes since columns don't exist in database
    return false;
  };

  const shouldShowSizes = (itemgroup?: string) => {
    const targetItemgroup = itemgroup || formData.itemgroup_product;
    const noSizeCategories = ['cravate', 'pochette', 'maroquinerie', 'ceinture', 'autre'];
    return !noSizeCategories.includes(targetItemgroup);
  };

  const handleSizeChange = (sizeField: string, value: string) => {
    updateFormData(sizeField, value);
  };

  const handleClose = () => {
    if (isEdit) {
      setIsEditDialogOpen(false);
      setEditingProduct(null);
    } else {
      setIsDialogOpen(false);
    }
    resetForm();
  };

  // Check if quantity should be disabled (when sizes are shown)
  const isQuantityDisabled = shouldShowSizes();

  // Rich text editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'align', 'link'
  ];

  return (
    <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 bg-white border border-gray-200 overflow-hidden flex flex-col">
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {isEdit ? 'Modifier les informations du produit' : 'Ajouter un nouveau produit au catalogue'}
        </DialogDescription>
      </DialogHeader>
      
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-black">{title}</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 text-black">Images du Produit</h3>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-300 ${
                isDragOver 
                  ? 'border-black bg-gray-50 scale-105' 
                  : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
              <p className="text-gray-700 mb-2 text-sm sm:text-base font-medium">
                {isDragOver ? 'Déposez vos images ici' : 'Glissez-déposez vos images ou cliquez pour parcourir'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">Maximum 4 images • PNG, JPG, JPEG acceptés</p>
              <label className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 border border-black rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Sélectionner des fichiers
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
            
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black hover:bg-gray-800 text-white rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-6 text-black">Détails du Produit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Type *</Label>
                <Select 
                  value={formData.type_product} 
                  onValueChange={(value) => updateFormData('type_product', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sur mesure">Sur mesure</SelectItem>
                    <SelectItem value="prêt à porter">Prêt à porter</SelectItem>
                    <SelectItem value="accessoires">Accessoires</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type_product === 'sur mesure' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Catégorie *</Label>
                  <Select 
                    value={formData.category_product} 
                    onValueChange={(value) => updateFormData('category_product', value)}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCategoryOptions().map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Groupe d'Article</Label>
                <Select 
                  value={formData.itemgroup_product} 
                  onValueChange={(value) => updateFormData('itemgroup_product', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Sélectionner un groupe" />
                  </SelectTrigger>
                  <SelectContent>
                    {getItemGroupOptions().map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Référence *</Label>
                <Input
                  className="border-gray-300 focus:border-black focus:ring-black"
                  placeholder="Ex: REF-001"
                  value={formData.reference_product}
                  onChange={(e) => updateFormData('reference_product', e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Nom du Produit *</Label>
                <Input
                  className="border-gray-300 focus:border-black focus:ring-black"
                  placeholder="Ex: Chemise Élégante Coton Bio"
                  value={formData.nom_product}
                  onChange={(e) => updateFormData('nom_product', e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                <div className="bg-white border border-gray-300 rounded-md">
                  <ReactQuill
                    theme="snow"
                    value={formData.description_product || ''}
                    onChange={(value) => updateFormData('description_product', value)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Décrivez les caractéristiques, matériaux, et détails du produit..."
                    className="min-h-[120px]"
                    style={{
                      backgroundColor: 'white',
                    }}
                  />
                </div>
                <style>{`
                  .ql-editor {
                    min-height: 120px;
                    font-size: 14px;
                    line-height: 1.5;
                  }
                  .ql-editor ol,
                  .ql-editor ul {
                    padding-left: 0 !important;
                    margin-left: 0 !important;
                  }
                  .ql-editor ol li,
                  .ql-editor ul li {
                    padding-left: 1.5em !important;
                    margin-left: 0 !important;
                  }
                  .ql-editor ol li::before,
                  .ql-editor ul li::before {
                    left: 0 !important;
                  }
                  .ql-toolbar {
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    border-bottom: 1px solid #d1d5db;
                  }
                  .ql-container {
                    border-bottom: none;
                    border-left: none;
                    border-right: none;
                  }
                `}</style>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Prix (TND) *
                </Label>
                <Input
                  className="border-gray-300 focus:border-black focus:ring-black"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price_product}
                  onChange={(e) => updateFormData('price_product', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Stock Total {isQuantityDisabled && <span className="text-xs text-blue-600">(Calculé automatiquement)</span>}
                </Label>
                <Input
                  className={`border-gray-300 focus:border-black focus:ring-black ${
                    isQuantityDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  type="number"
                  placeholder="0"
                  value={formData.qnty_product}
                  onChange={(e) => !isQuantityDisabled && updateFormData('qnty_product', e.target.value)}
                  disabled={isQuantityDisabled}
                  readOnly={isQuantityDisabled}
                />
                {isQuantityDisabled && (
                  <p className="text-xs text-gray-500 mt-1">
                    Le stock total est calculé automatiquement à partir des tailles
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sizes Section */}
          {shouldShowSizes() && (shouldShowLetterSizes() || shouldShowCostumeSizes()) && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium mb-6 text-black">Stock par Taille</h3>
              
              {shouldShowLetterSizes() && (
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Tailles Standards (XS - 4XL)</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {['xs_size', 's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size'].map(size => (
                      <div key={size} className="text-center">
                        <Label className="text-xs font-medium text-gray-600 block mb-1">
                          {size.replace('_size', '').toUpperCase()}
                        </Label>
                        <Input
                          type="number"
                          value={formData[size]}
                          onChange={(e) => handleSizeChange(size, e.target.value)}
                          className="h-9 text-center text-sm border-gray-300 focus:border-black focus:ring-black"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {shouldShowCostumeSizes() && (
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Tailles Costumes (48 - 58)</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {['48_size', '50_size', '52_size', '54_size', '56_size', '58_size'].map(size => (
                      <div key={size} className="text-center">
                        <Label className="text-xs font-medium text-gray-600 block mb-1">
                          {size.replace('_size', '')}
                        </Label>
                        <Input
                          type="number"
                          value={formData[size]}
                          onChange={(e) => handleSizeChange(size, e.target.value)}
                          className="h-9 text-center text-sm border-gray-300 focus:border-black focus:ring-black"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Stock Total Calculé:</strong> {calculateTotalQuantity(formData)} unité(s)
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Le stock total est automatiquement calculé en additionnant toutes les tailles
                </p>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-6 text-black">Informations Complémentaires</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Couleur</Label>
                <Input
                  className="border-gray-300 focus:border-black focus:ring-black"
                  placeholder="Ex: Bleu marine, Rouge..."
                  value={formData.color_product}
                  onChange={(e) => updateFormData('color_product', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Statut</Label>
                <Select value={formData.status_product} onValueChange={(value) => updateFormData('status_product', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">🟢 Actif</SelectItem>
                    <SelectItem value="inactive">🔴 Inactif</SelectItem>
                    <SelectItem value="draft">📝 Brouillon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Remise (%)</Label>
                <Input
                  className="border-gray-300 focus:border-black focus:ring-black"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={formData.discount_product}
                  onChange={(e) => updateFormData('discount_product', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Extra spacing at the bottom for better scrolling */}
          <div className="h-20"></div>
        </form>
      </div>

      {/* Fixed Footer */}
      <div className="bg-white border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 shrink-0">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleClose}
          className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          onClick={onSubmit}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white border-0"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {isEdit ? 'Mise à jour...' : 'Ajout en cours...'}
            </>
          ) : (
            <>
              {isEdit ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {isEdit ? 'Mettre à jour' : 'Ajouter le Produit'}
            </>
          )}
        </Button>
      </div>
    </DialogContent>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    reference_product: '',
    nom_product: '',
    description_product: '',
    type_product: '',
    category_product: '',
    itemgroup_product: '',
    price_product: '',
    qnty_product: '',
    s_size: '',
    m_size: '',
    l_size: '',
    xl_size: '',
    xxl_size: '',
    '3xl_size': '',
    '4xl_size': '',
    xs_size: '',
    '48_size': '',
    '50_size': '',
    '52_size': '',
    '54_size': '',
    '56_size': '',
    '58_size': '',
    color_product: '',
    status_product: 'active',
    discount_product: '0'
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/get_all_products.php');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des produits",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      reference_product: '',
      nom_product: '',
      description_product: '',
      type_product: '',
      category_product: '',
      itemgroup_product: '',
      price_product: '',
      qnty_product: '',
      s_size: '',
      m_size: '',
      l_size: '',
      xl_size: '',
      xxl_size: '',
      '3xl_size': '',
      '4xl_size': '',
      xs_size: '',
      '48_size': '',
      '50_size': '',
      '52_size': '',
      '54_size': '',
      '56_size': '',
      '58_size': '',
      color_product: '',
      status_product: 'active',
      discount_product: '0'
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const handleEditProduct = async (product: Product) => {
    setEditingProduct(product);
    
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/get_single_product.php?id=${product.id_product}`);
      const data = await response.json();
      
      if (data.success) {
        const productData = data.data;
        
        setFormData({
          reference_product: productData.reference_product || '',
          nom_product: productData.nom_product || '',
          description_product: productData.description_product || '',
          type_product: productData.type_product || '',
          category_product: productData.category_product || '',
          itemgroup_product: productData.itemgroup_product || '',
          price_product: productData.price_product?.toString() || '',
          qnty_product: productData.qnty_product?.toString() || '',
          s_size: productData.s_size?.toString() || '',
          m_size: productData.m_size?.toString() || '',
          l_size: productData.l_size?.toString() || '',
          xl_size: productData.xl_size?.toString() || '',
          xxl_size: productData.xxl_size?.toString() || '',
          '3xl_size': productData['3xl_size']?.toString() || '',
          '4xl_size': productData['4xl_size']?.toString() || '',
          xs_size: productData.xs_size?.toString() || '',
          '48_size': productData['48_size']?.toString() || '',
          '50_size': productData['50_size']?.toString() || '',
          '52_size': productData['52_size']?.toString() || '',
          '54_size': productData['54_size']?.toString() || '',
          '56_size': productData['56_size']?.toString() || '',
          '58_size': productData['58_size']?.toString() || '',
          color_product: productData.color_product || '',
          status_product: productData.status_product || 'active',
          discount_product: productData.discount_product?.toString() || '0'
        });

        const existingImages = [];
        if (productData.img_product) existingImages.push(`https://draminesaid.com/lucci/${productData.img_product}`);
        if (productData.img2_product) existingImages.push(`https://draminesaid.com/lucci/${productData.img2_product}`);
        if (productData.img3_product) existingImages.push(`https://draminesaid.com/lucci/${productData.img3_product}`);
        if (productData.img4_product) existingImages.push(`https://draminesaid.com/lucci/${productData.img4_product}`);
        
        setImagePreviewUrls(existingImages);
        setSelectedImages([]);
        setIsEditDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des détails du produit",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Starting form submission...');
    console.log('Form data:', formData);
    console.log('Selected images:', selectedImages);
    
    // Validate required fields
    if (!formData.reference_product || !formData.nom_product || !formData.price_product) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Process form data
      const processedData = { ...formData };
      
      // Ensure all size fields are included with 0 if empty
      const allSizeFields = [
        's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', 'xs_size',
        '48_size', '50_size', '52_size', '54_size', '56_size', '58_size'
      ];
      
      allSizeFields.forEach(field => {
        if (!processedData[field] || processedData[field] === '') {
          processedData[field] = '0';
        }
      });
      
      // Ensure required fields have default values
      if (!processedData.qnty_product) processedData.qnty_product = '0';
      if (!processedData.discount_product) processedData.discount_product = '0';
      if (!processedData.color_product) processedData.color_product = '';
      if (!processedData.description_product) processedData.description_product = '';
      if (!processedData.category_product) processedData.category_product = '';
      
      // Append all form data
      Object.entries(processedData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append images
      selectedImages.forEach((image, index) => {
        formDataToSend.append(`image${index + 1}`, image);
      });

      console.log('Sending request to API...');

      const response = await fetch('https://draminesaid.com/lucci/api/insert_product.php', {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('API Response status:', response.status);
      
      // Check if response is ok first
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API Response data:', result);

      if (result.success) {
        toast({
          title: "Succès",
          description: "Produit ajouté avec succès"
        });
        setIsDialogOpen(false);
        resetForm();
        fetchProducts();
      } else {
        throw new Error(result.message || 'Erreur lors de l\'ajout du produit');
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      let errorMessage = "Erreur lors de l'ajout du produit";
      
      if (error.message.includes('Server error')) {
        errorMessage = "Erreur du serveur. Vérifiez les logs du serveur.";
      } else if (error.message.includes('JSON')) {
        errorMessage = "Erreur de communication avec le serveur.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setIsLoading(true);

    try {
      const updateData: any = { ...formData };
      
      const allSizeFields = [
        's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', 'xs_size',
        '48_size', '50_size', '52_size', '54_size', '56_size', '58_size'
      ];
      
      allSizeFields.forEach(field => {
        if (!updateData[field]) {
          updateData[field] = null;
        }
      });

      const response = await fetch(`https://draminesaid.com/lucci/api/update_product.php?id=${editingProduct.id_product}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Succès",
          description: "Produit mis à jour avec succès"
        });
        setIsEditDialogOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du produit",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/delete_product.php?id=${productToDelete.id_product}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Succès",
          description: "Produit supprimé avec succès"
        });
        fetchProducts();
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du produit",
        variant: "destructive"
      });
    }
  };

  const sortedAndFilteredProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.nom_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.reference_product.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || product.type_product === filterType;
      const matchesStatus = filterStatus === 'all' || product.status_product === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === 'price') {
        compareValue = a.price_product - b.price_product;
      } else if (sortBy === 'date') {
        compareValue = new Date(a.createdate_product).getTime() - new Date(b.createdate_product).getTime();
      } else if (sortBy === 'name') {
        compareValue = a.nom_product.localeCompare(b.nom_product);
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  };

  const getAvailableSizes = (product: Product) => {
    const sizes = [];
    const sizeFields = [
      { field: 'xs_size', label: 'XS' },
      { field: 's_size', label: 'S' },
      { field: 'm_size', label: 'M' },
      { field: 'l_size', label: 'L' },
      { field: 'xl_size', label: 'XL' },
      { field: 'xxl_size', label: 'XXL' },
      { field: '3xl_size', label: '3XL' },
      { field: '4xl_size', label: '4XL' },
      { field: '48_size', label: '48' },
      { field: '50_size', label: '50' },
      { field: '52_size', label: '52' },
      { field: '54_size', label: '54' },
      { field: '56_size', label: '56' },
      { field: '58_size', label: '58' }
    ];

    sizeFields.forEach(({ field, label }) => {
      const stock = product[field];
      if (stock && stock > 0) {
        sizes.push({ label, stock });
      }
    });

    return sizes;
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockStatus = (product: Product) => {
    if (['accessoires', 'cravate', 'pochette', 'maroquinerie', 'ceinture', 'autre'].includes(product.itemgroup_product)) {
      if (product.qnty_product <= 2) {
        return { text: 'Stock faible', color: 'text-red-600' };
      }
      return { text: 'En stock', color: 'text-green-600' };
    }

    const sizeFields = [
      's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', 'xs_size',
      '48_size', '50_size', '52_size', '54_size', '56_size', '58_size'
    ];

    const hasLowStock = sizeFields.some(field => {
      const sizeStock = product[field];
      return sizeStock !== null && sizeStock !== undefined && sizeStock <= 2 && sizeStock > 0;
    });

    if (hasLowStock) {
      return { text: 'Stock faible', color: 'text-red-600' };
    }

    const totalStock = product.qnty_product || 0;
    if (totalStock === 0) return { text: 'Rupture', color: 'text-red-600' };
    return { text: 'En stock', color: 'text-green-600' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black">Gestion des Produits</h2>
            <p className="text-gray-600">
              Gérez votre catalogue de produits ({sortedAndFilteredProducts().length} produits)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={viewMode === 'cards' ? 'text-white' : 'text-gray-600'}
                style={viewMode === 'cards' ? { backgroundColor: '#212937' } : {}}
              >
                <Package className="h-4 w-4 mr-1" />
                Cartes
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'text-white' : 'text-gray-600'}
                style={viewMode === 'table' ? { backgroundColor: '#212937' } : {}}
              >
                <Filter className="h-4 w-4 mr-1" />
                Tableau
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="text-white border-0 hover:opacity-90"
                  style={{ backgroundColor: '#212937' }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un Nouveau Produit
                </Button>
              </DialogTrigger>
              <ProductModalContent 
                onSubmit={handleSubmit}
                title="Ajouter un Nouveau Produit"
                formData={formData}
                setFormData={setFormData}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                imagePreviewUrls={imagePreviewUrls}
                setImagePreviewUrls={setImagePreviewUrls}
                isDragOver={isDragOver}
                setIsDragOver={setIsDragOver}
                isLoading={isLoading}
                resetForm={resetForm}
                setIsDialogOpen={setIsDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                setEditingProduct={setEditingProduct}
              />
            </Dialog>

            {/* Edit Product Modal */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <ProductModalContent 
                isEdit={true}
                onSubmit={handleUpdateSubmit}
                title="Modifier le Produit"
                formData={formData}
                setFormData={setFormData}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                imagePreviewUrls={imagePreviewUrls}
                setImagePreviewUrls={setImagePreviewUrls}
                isDragOver={isDragOver}
                setIsDragOver={setIsDragOver}
                isLoading={isLoading}
                resetForm={resetForm}
                setIsDialogOpen={setIsDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                setEditingProduct={setEditingProduct}
              />
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Confirmer la suppression
                  </DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Êtes-vous sûr de vouloir supprimer le produit <strong>"{productToDelete?.nom_product}"</strong> ?
                  </p>
                  <p className="text-sm text-red-600">
                    Cette action est irréversible.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDeleteDialogOpen(false);
                        setProductToDelete(null);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteProduct}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Product Statistics - moved here below the title */}
        <ProductStats products={products} />

        {/* Search, Filters and Sorting */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher des produits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40 border-gray-300 focus:border-black focus:ring-black">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="sur mesure">Sur mesure</SelectItem>
                    <SelectItem value="prêt à porter">Prêt à porter</SelectItem>
                    <SelectItem value="accessoires">Accessoires</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}>
                  <SelectTrigger className="w-48 border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (plus récent)</SelectItem>
                    <SelectItem value="date-asc">Date (plus ancien)</SelectItem>
                    <SelectItem value="price-asc">Prix (croissant)</SelectItem>
                    <SelectItem value="price-desc">Prix (décroissant)</SelectItem>
                    <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        {viewMode === 'table' ? (
          <ProductsTable 
            products={sortedAndFilteredProducts()}
            onEditProduct={handleEditProduct}
            onDeleteProduct={confirmDeleteProduct}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedAndFilteredProducts().map((product) => {
              const stockStatus = getStockStatus(product);
              const availableSizes = getAvailableSizes(product);
              return (
                <Card key={product.id_product} className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 bg-white flex flex-col h-full">
                  <div className="relative">
                    {product.img_product ? (
                      <img
                        src={`https://draminesaid.com/lucci/${product.img_product}`}
                        alt={product.nom_product}
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={`text-xs font-medium border ${getStatusBadgeStyle(product.status_product)}`}>
                        {product.status_product}
                      </Badge>
                    </div>
                    {product.discount_product > 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-600 text-white text-xs font-medium">
                          -{product.discount_product}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-start justify-between">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                          REF: {product.reference_product}
                        </p>
                        <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                          {product.type_product}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-base text-black line-clamp-2 leading-tight">
                        {product.nom_product}
                      </h3>

                      {/* Product Type and Item Group */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">Type:</span>
                          <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200">
                            {product.type_product}
                          </Badge>
                        </div>
                        {product.itemgroup_product && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Groupe:</span>
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200">
                              {product.itemgroup_product}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {product.color_product && (
                        <p className="text-xs text-gray-600">
                          Couleur: {product.color_product}
                        </p>
                      )}

                      {availableSizes.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Tailles disponibles:</p>
                          <div className="flex flex-wrap gap-1">
                            {availableSizes.slice(0, 8).map((size, index) => (
                              <Badge key={index} variant="secondary" className="text-sm px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200">
                                {size.label}: {size.stock}
                              </Badge>
                            ))}
                            {availableSizes.length > 8 && (
                              <Badge variant="secondary" className="text-sm px-2 py-1 bg-gray-50 text-gray-600 border border-gray-200">
                                +{availableSizes.length - 8} autres
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-black">
                            {product.price_product} TND
                          </span>
                          <span className={`text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p className="text-sm font-semibold text-black">{product.qnty_product}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-10"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => confirmDeleteProduct(product)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10 px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {sortedAndFilteredProducts().length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                  ? 'Aucun produit ne correspond à vos critères de recherche.'
                  : 'Commencez par ajouter votre premier produit.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
