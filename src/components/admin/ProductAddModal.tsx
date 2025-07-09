
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import { getItemGroupSizeType, getSizeFieldsForItemGroup, needsSizeSelection } from '@/config/productSizeConfig';

interface ProductAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

interface ProductFormData {
  reference_product: string;
  nom_product: string;
  description_product: string;
  type_product: string;
  category_product: string;
  itemgroup_product: string;
  price_product: number;
  qnty_product: number;
  color_product: string;
  status_product: string;
  discount_product: number;
  // Size fields
  xs_size: number;
  s_size: number;
  m_size: number;
  l_size: number;
  xl_size: number;
  xxl_size: number;
  '3xl_size': number;
  '4xl_size': number;
  '48_size': number;
  '50_size': number;
  '52_size': number;
  '54_size': number;
  '56_size': number;
  '58_size': number;
}

export const ProductAddModal: React.FC<ProductAddModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    reference_product: '',
    nom_product: '',
    description_product: '',
    type_product: 'pret a porter',
    category_product: '',
    itemgroup_product: 'tshirt',
    price_product: 0,
    qnty_product: 0,
    color_product: '',
    status_product: 'active',
    discount_product: 0,
    xs_size: 0,
    s_size: 0,
    m_size: 0,
    l_size: 0,
    xl_size: 0,
    xxl_size: 0,
    '3xl_size': 0,
    '4xl_size': 0,
    '48_size': 0,
    '50_size': 0,
    '52_size': 0,
    '54_size': 0,
    '56_size': 0,
    '58_size': 0,
  });

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedImages.length > 4) {
      toast({
        title: "Erreur",
        description: "Maximum 4 images autorisées",
        variant: "destructive",
      });
      return;
    }
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value.toString());
      });

      // Add images
      selectedImages.forEach((file, index) => {
        submitFormData.append(`image${index + 1}`, file);
      });

      const response = await fetch('https://draminesaid.com/lucci/api/insert_product.php', {
        method: 'POST',
        body: submitFormData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Succès",
          description: "Produit ajouté avec succès",
        });
        onProductAdded();
        onClose();
        // Reset form
        setFormData({
          reference_product: '',
          nom_product: '',
          description_product: '',
          type_product: 'pret a porter',
          category_product: '',
          itemgroup_product: 'tshirt',
          price_product: 0,
          qnty_product: 0,
          color_product: '',
          status_product: 'active',
          discount_product: 0,
          xs_size: 0,
          s_size: 0,
          m_size: 0,
          l_size: 0,
          xl_size: 0,
          xxl_size: 0,
          '3xl_size': 0,
          '4xl_size': 0,
          '48_size': 0,
          '50_size': 0,
          '52_size': 0,
          '54_size': 0,
          '56_size': 0,
          '58_size': 0,
        });
        setSelectedImages([]);
      } else {
        throw new Error(result.message || 'Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'ajout du produit",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the size type for the selected item group
  const sizeType = getItemGroupSizeType(formData.itemgroup_product);
  const productNeedsSizes = needsSizeSelection(formData.itemgroup_product);
  const sizeFields = getSizeFieldsForItemGroup(formData.itemgroup_product);

  const renderSizeInputs = () => {
    if (!productNeedsSizes) {
      return null;
    }

    const getSizeLabel = (sizeField: string) => {
      const sizeLabels: Record<string, string> = {
        'xs_size': 'XS',
        's_size': 'S',
        'm_size': 'M',
        'l_size': 'L',
        'xl_size': 'XL',
        'xxl_size': 'XXL',
        '3xl_size': '3XL',
        '4xl_size': '4XL',
        '48_size': '48',
        '50_size': '50',
        '52_size': '52',
        '54_size': '54',
        '56_size': '56',
        '58_size': '58',
      };
      return sizeLabels[sizeField] || sizeField;
    };

    const getSectionTitle = () => {
      switch (sizeType) {
        case 'standard':
          return 'Tailles standards disponibles';
        case 'formal':
          return 'Tailles formelles disponibles';
        case 'shoe':
          return 'Pointures disponibles';
        default:
          return 'Tailles disponibles';
      }
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{getSectionTitle()}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sizeFields.map((sizeField) => (
            <div key={sizeField} className="space-y-2">
              <Label htmlFor={sizeField}>{getSizeLabel(sizeField)}</Label>
              <Input
                id={sizeField}
                type="number"
                min="0"
                value={formData[sizeField as keyof ProductFormData] as number}
                onChange={(e) => handleInputChange(sizeField as keyof ProductFormData, parseInt(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations du produit
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images - Moved to top */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Images du produit (max 4)</h3>
            <div className="flex flex-wrap gap-6">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {selectedImages.length < 4 && (
                <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 text-center">Ajouter une image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Référence *</Label>
              <Input
                id="reference"
                value={formData.reference_product}
                onChange={(e) => handleInputChange('reference_product', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du produit *</Label>
              <Input
                id="nom"
                value={formData.nom_product}
                onChange={(e) => handleInputChange('nom_product', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description_product}
              onChange={(e) => handleInputChange('description_product', e.target.value)}
              rows={3}
            />
          </div>

          {/* Product Type & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type de produit</Label>
              <Select
                value={formData.type_product}
                onValueChange={(value) => handleInputChange('type_product', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sur mesure">Sur mesure</SelectItem>
                  <SelectItem value="pret a porter">Prêt à porter</SelectItem>
                  <SelectItem value="accessoires">Accessoires</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                value={formData.category_product}
                onChange={(e) => handleInputChange('category_product', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Groupe d'articles</Label>
              <Select
                value={formData.itemgroup_product}
                onValueChange={(value) => handleInputChange('itemgroup_product', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tshirt">T-shirt</SelectItem>
                  <SelectItem value="polo">Polo</SelectItem>
                  <SelectItem value="chemise">Chemise</SelectItem>
                  <SelectItem value="blazers">Blazers</SelectItem>
                  <SelectItem value="costume">Costume</SelectItem>
                  <SelectItem value="pantalon">Pantalon</SelectItem>
                  <SelectItem value="cravate">Cravate</SelectItem>
                  <SelectItem value="pochette">Pochette</SelectItem>
                  <SelectItem value="ceinture">Ceinture</SelectItem>
                  <SelectItem value="chaussure">Chaussure</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (TND) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price_product}
                onChange={(e) => handleInputChange('price_product', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">
                {productNeedsSizes ? 'Quantité totale *' : 'Quantité *'}
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.qnty_product}
                onChange={(e) => handleInputChange('qnty_product', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <Input
                id="color"
                value={formData.color_product}
                onChange={(e) => handleInputChange('color_product', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Remise (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount_product}
                onChange={(e) => handleInputChange('discount_product', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Dynamic Size Inputs */}
          {renderSizeInputs()}

          {/* Status */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={formData.status_product}
              onValueChange={(value) => handleInputChange('status_product', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajouter le produit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
