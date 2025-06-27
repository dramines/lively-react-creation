
import jsPDF from 'jspdf';

interface OrderItem {
  nom: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface Customer {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
}

interface Order {
  id: number;
  numero_commande: string;
  customer: Customer;
  total: number;
  status: string;
  date_creation: string;
  items: OrderItem[];
  delivery_cost: number;
  discount: number;
}

export const generateOrderPDF = (order: Order, language: 'fr' | 'en' = 'fr') => {
  const doc = new jsPDF();
  
  // Define text content based on language
  const texts = {
    fr: {
      title: 'REÇU DE COMMANDE',
      orderNumber: 'Numéro de commande',
      orderDate: 'Date de commande',
      customerInfo: 'Informations Client',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      orderDetails: 'Détails de la Commande',
      product: 'Produit',
      quantity: 'Qté',
      unitPrice: 'Prix Unit.',
      total: 'Total',
      subtotal: 'Sous-total',
      delivery: 'Livraison',
      discount: 'Remise',
      finalTotal: 'Total Final',
      status: 'Statut',
      thankYou: 'Merci pour votre commande !',
      footer: 'LUCCI BY E.Y - Boutique de Luxe'
    },
    en: {
      title: 'ORDER RECEIPT',
      orderNumber: 'Order Number',
      orderDate: 'Order Date',
      customerInfo: 'Customer Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      orderDetails: 'Order Details',
      product: 'Product',
      quantity: 'Qty',
      unitPrice: 'Unit Price',
      total: 'Total',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      discount: 'Discount',
      finalTotal: 'Final Total',
      status: 'Status',
      thankYou: 'Thank you for your order!',
      footer: 'LUCCI BY E.Y - Luxury Boutique'
    }
  };

  const t = texts[language];
  
  // Colors
  const primaryColor = [31, 41, 55]; // Gray-900
  const secondaryColor = [107, 114, 128]; // Gray-500
  const accentColor = [16, 185, 129]; // Emerald-500

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('LUCCI BY E.Y', 20, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(t.footer, 20, 30);

  // Title
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.title, 20, 60);

  // Order Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.orderNumber}: ${order.numero_commande}`, 20, 75);
  doc.text(`${t.orderDate}: ${new Date(order.date_creation).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}`, 20, 85);

  // Customer Info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.customerInfo, 20, 105);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.name}: ${order.customer.prenom} ${order.customer.nom}`, 20, 120);
  doc.text(`${t.email}: ${order.customer.email}`, 20, 130);
  doc.text(`${t.phone}: ${order.customer.telephone}`, 20, 140);
  doc.text(`${t.address}: ${order.customer.adresse}`, 20, 150);

  // Order Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.orderDetails, 20, 170);

  // Table Header
  const tableStartY = 180;
  doc.setFillColor(245, 245, 245);
  doc.rect(20, tableStartY, 170, 10, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(t.product, 25, tableStartY + 7);
  doc.text(t.quantity, 120, tableStartY + 7);
  doc.text(t.unitPrice, 140, tableStartY + 7);
  doc.text(t.total, 170, tableStartY + 7);

  // Table Rows
  let currentY = tableStartY + 15;
  doc.setFont('helvetica', 'normal');
  order.items.forEach((item, index) => {
    const itemTotal = item.quantity * item.price;
    doc.text(item.nom, 25, currentY);
    if (item.size || item.color) {
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`${item.size ? `Taille: ${item.size}` : ''} ${item.color ? `Couleur: ${item.color}` : ''}`, 25, currentY + 5);
      currentY += 5;
    }
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(item.quantity.toString(), 125, currentY);
    doc.text(`€${item.price.toFixed(2)}`, 145, currentY);
    doc.text(`€${itemTotal.toFixed(2)}`, 175, currentY);
    currentY += 15;
  });

  // Summary
  currentY += 10;
  const subtotal = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.subtotal}:`, 130, currentY);
  doc.text(`€${subtotal.toFixed(2)}`, 175, currentY);
  
  currentY += 10;
  doc.text(`${t.delivery}:`, 130, currentY);
  doc.text(`€${order.delivery_cost.toFixed(2)}`, 175, currentY);
  
  if (order.discount > 0) {
    currentY += 10;
    doc.text(`${t.discount}:`, 130, currentY);
    doc.text(`-€${order.discount.toFixed(2)}`, 175, currentY);
  }
  
  // Final Total
  currentY += 15;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(125, currentY - 5, 65, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(`${t.finalTotal}:`, 130, currentY + 3);
  doc.text(`€${order.total.toFixed(2)}`, 175, currentY + 3);

  // Status
  currentY += 20;
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.status}: ${getStatusText(order.status, language)}`, 20, currentY);

  // Thank you message
  currentY += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(t.thankYou, 20, currentY);

  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('www.luccibey.com | contact@luccibey.com', 20, 280);

  // Save the PDF
  doc.save(`${order.numero_commande}_${language}.pdf`);
};

const getStatusText = (status: string, language: 'fr' | 'en') => {
  const statusMap = {
    fr: {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    },
    en: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    }
  };
  
  return statusMap[language][status as keyof typeof statusMap[typeof language]] || status;
};
