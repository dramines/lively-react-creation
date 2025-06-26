
import jsPDF from 'jspdf';
import { OrderDetails } from '../services/orderDetailsService';
import { getProductImage } from './imageUtils';

export const generateOrderReceiptPDF = (order: OrderDetails, language: 'fr' | 'en' = 'fr') => {
  const doc = new jsPDF();
  
  // Translations
  const translations = {
    fr: {
      title: 'REÇU DE COMMANDE',
      company: 'LUCCI BY E.Y',
      subtitle: 'Boutique de Luxe',
      orderNumber: 'Numéro de commande',
      orderDate: 'Date de commande',
      customerInfo: 'INFORMATIONS CLIENT',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      deliveryAddress: 'ADRESSE DE LIVRAISON',
      orderItems: 'ARTICLES COMMANDÉS',
      product: 'Produit',
      reference: 'Référence',
      price: 'Prix unitaire',
      quantity: 'Quantité',
      size: 'Taille',
      color: 'Couleur',
      total: 'Total',
      subtotal: 'Sous-total',
      discount: 'Remise',
      delivery: 'Frais de livraison',
      totalAmount: 'TOTAL À PAYER',
      status: 'Statut',
      paymentMethod: 'Mode de paiement',
      notes: 'Notes',
      thank: 'Merci pour votre commande !',
      footer: 'Pour toute question, contactez-nous à contact@luccibey.com'
    },
    en: {
      title: 'ORDER RECEIPT',
      company: 'LUCCI BY E.Y',
      subtitle: 'Luxury Boutique',
      orderNumber: 'Order Number',
      orderDate: 'Order Date',
      customerInfo: 'CUSTOMER INFORMATION',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      deliveryAddress: 'DELIVERY ADDRESS',
      orderItems: 'ORDER ITEMS',
      product: 'Product',
      reference: 'Reference',
      price: 'Unit Price',
      quantity: 'Quantity',
      size: 'Size',
      color: 'Color',
      total: 'Total',
      subtotal: 'Subtotal',
      discount: 'Discount',
      delivery: 'Delivery Fee',
      totalAmount: 'TOTAL AMOUNT',
      status: 'Status',
      paymentMethod: 'Payment Method',
      notes: 'Notes',
      thank: 'Thank you for your order!',
      footer: 'For any questions, contact us at contact@luccibey.com'
    }
  };

  const t = translations[language];
  let yPosition = 20;

  // Colors
  const primaryColor = [31, 41, 55]; // Dark gray
  const accentColor = [59, 130, 246]; // Blue
  const lightGray = [243, 244, 246];

  // Header with company branding
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(t.company, 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(t.subtitle, 20, 35);
  
  yPosition = 60;

  // Receipt title
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(t.title, 20, yPosition);
  yPosition += 20;

  // Order info section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, yPosition - 5, 170, 25, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${t.orderNumber}: ${order.numero_commande}`, 25, yPosition + 5);
  doc.text(`${t.orderDate}: ${new Date(order.date_creation_order).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}`, 25, yPosition + 15);
  
  yPosition += 35;

  // Customer information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(t.customerInfo, 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${t.name}: ${order.customer.prenom} ${order.customer.nom}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.email}: ${order.customer.email}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.phone}: ${order.customer.telephone}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.address}: ${order.customer.adresse}`, 20, yPosition);
  yPosition += 15;

  // Delivery address if different
  if (order.delivery_address) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(t.deliveryAddress, 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${order.delivery_address.prenom_destinataire} ${order.delivery_address.nom_destinataire}`, 20, yPosition);
    yPosition += 8;
    doc.text(`${order.delivery_address.adresse_livraison}`, 20, yPosition);
    yPosition += 8;
    doc.text(`${order.delivery_address.code_postal_livraison} ${order.delivery_address.ville_livraison}`, 20, yPosition);
    yPosition += 8;
    doc.text(`${order.delivery_address.pays_livraison}`, 20, yPosition);
    yPosition += 15;
  }

  // Order items section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(t.orderItems, 20, yPosition);
  yPosition += 15;

  // Items table header
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, yPosition - 5, 170, 12, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(t.product, 25, yPosition + 3);
  doc.text(t.reference, 80, yPosition + 3);
  doc.text(t.price, 120, yPosition + 3);
  doc.text(t.quantity, 150, yPosition + 3);
  doc.text(t.total, 170, yPosition + 3);
  yPosition += 15;

  // Items
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  order.items.forEach((item, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, yPosition - 3, 170, 15, 'F');
    }
    
    doc.setFontSize(9);
    const productName = item.nom_product_snapshot.length > 25 ? 
      item.nom_product_snapshot.substring(0, 25) + '...' : 
      item.nom_product_snapshot;
    doc.text(productName, 25, yPosition + 2);
    doc.text(item.reference_product_snapshot, 80, yPosition + 2);
    doc.text(`€${parseFloat(String(item.price_product_snapshot)).toFixed(2)}`, 120, yPosition + 2);
    doc.text(String(item.quantity_ordered), 155, yPosition + 2);
    doc.text(`€${parseFloat(String(item.total_item)).toFixed(2)}`, 170, yPosition + 2);
    
    if (item.size_selected || item.color_selected) {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${t.size}: ${item.size_selected || 'N/A'} | ${t.color}: ${item.color_selected || 'N/A'}`, 25, yPosition + 8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      yPosition += 6;
    }
    yPosition += 15;
  });

  yPosition += 10;

  // Summary section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(100, yPosition, 90, 40, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.subtotal}: €${parseFloat(String(order.sous_total_order)).toFixed(2)}`, 105, yPosition + 8);
  
  if (order.discount_amount_order > 0) {
    doc.setTextColor(220, 38, 38);
    doc.text(`${t.discount}: -€${parseFloat(String(order.discount_amount_order)).toFixed(2)}`, 105, yPosition + 16);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  }
  
  doc.text(`${t.delivery}: €${parseFloat(String(order.delivery_cost_order)).toFixed(2)}`, 105, yPosition + 24);
  
  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(`${t.totalAmount}: €${parseFloat(String(order.total_order)).toFixed(2)}`, 105, yPosition + 35);

  yPosition += 50;

  // Additional info
  if (order.payment_method || order.notes_order) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    if (order.payment_method) {
      doc.text(`${t.paymentMethod}: ${order.payment_method}`, 20, yPosition);
      yPosition += 8;
    }
    
    if (order.notes_order) {
      doc.text(`${t.notes}: ${order.notes_order}`, 20, yPosition);
      yPosition += 15;
    }
  }

  // Thank you message
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(t.thank, 20, yPosition);
  yPosition += 15;

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(t.footer, 20, yPosition);

  // Add page border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);

  // Save the PDF
  const fileName = `${order.numero_commande}_${language}_receipt.pdf`;
  doc.save(fileName);
};
