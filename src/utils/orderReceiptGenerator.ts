import jsPDF from 'jspdf';
import { OrderDetails } from '../services/orderDetailsService';

export const generateOrderReceiptPDF = (order: OrderDetails, language: 'fr' | 'en' = 'fr') => {
  const doc = new jsPDF();
  
  // Translations
  const translations = {
    fr: {
      title: 'REÇU DE COMMANDE',
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
      total: 'Total',
      subtotal: 'Sous-total',
      discount: 'Remise',
      delivery: 'Frais de livraison',
      totalAmount: 'TOTAL À PAYER',
      status: 'Statut',
      thank: 'Merci pour votre commande!'
    },
    en: {
      title: 'ORDER RECEIPT',
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
      total: 'Total',
      subtotal: 'Subtotal',
      discount: 'Discount',
      delivery: 'Delivery Fee',
      totalAmount: 'TOTAL AMOUNT',
      status: 'Status',
      thank: 'Thank you for your order!'
    }
  };

  const t = translations[language];
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LUCCI BY E.Y', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(16);
  doc.text(t.title, 20, yPosition);
  yPosition += 20;

  // Order Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.orderNumber}: ${order.numero_commande}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.orderDate}: ${new Date(order.date_creation_order).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.status}: ${order.status_order}`, 20, yPosition);
  yPosition += 20;

  // Customer Info
  doc.setFont('helvetica', 'bold');
  doc.text(t.customerInfo, 20, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.name}: ${order.customer.prenom} ${order.customer.nom}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.email}: ${order.customer.email}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.phone}: ${order.customer.telephone}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.address}: ${order.customer.adresse}`, 20, yPosition);
  yPosition += 20;

  // Delivery Address if different
  if (order.delivery_address) {
    doc.setFont('helvetica', 'bold');
    doc.text(t.deliveryAddress, 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.delivery_address.prenom_destinataire} ${order.delivery_address.nom_destinataire}`, 20, yPosition);
    yPosition += 8;
    doc.text(`${order.delivery_address.adresse_livraison}`, 20, yPosition);
    yPosition += 8;
    doc.text(`${order.delivery_address.code_postal_livraison} ${order.delivery_address.ville_livraison}`, 20, yPosition);
    yPosition += 8;
    doc.text(`${order.delivery_address.pays_livraison}`, 20, yPosition);
    yPosition += 20;
  }

  // Order Items
  doc.setFont('helvetica', 'bold');
  doc.text(t.orderItems, 20, yPosition);
  yPosition += 15;

  // Items table header
  doc.setFontSize(10);
  doc.text(t.product, 20, yPosition);
  doc.text(t.reference, 80, yPosition);
  doc.text(t.price, 120, yPosition);
  doc.text(t.quantity, 150, yPosition);
  doc.text(t.total, 170, yPosition);
  yPosition += 8;

  // Draw line under header
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 5;

  // Items
  doc.setFont('helvetica', 'normal');
  order.items.forEach((item) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(item.nom_product_snapshot.substring(0, 30), 20, yPosition);
    doc.text(item.reference_product_snapshot, 80, yPosition);
    doc.text(`€${parseFloat(String(item.price_product_snapshot)).toFixed(2)}`, 120, yPosition);
    doc.text(String(item.quantity_ordered), 150, yPosition);
    doc.text(`€${parseFloat(String(item.total_item)).toFixed(2)}`, 170, yPosition);
    yPosition += 8;
    
    if (item.size_selected || item.color_selected) {
      doc.setFontSize(8);
      doc.text(`Taille: ${item.size_selected || 'N/A'} | Couleur: ${item.color_selected || 'N/A'}`, 20, yPosition);
      doc.setFontSize(10);
      yPosition += 6;
    }
  });

  yPosition += 10;
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 15;

  // Totals
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.subtotal}: €${parseFloat(String(order.sous_total_order)).toFixed(2)}`, 120, yPosition);
  yPosition += 8;
  
  if (order.discount_amount_order > 0) {
    doc.text(`${t.discount}: -€${parseFloat(String(order.discount_amount_order)).toFixed(2)}`, 120, yPosition);
    yPosition += 8;
  }
  
  doc.text(`${t.delivery}: €${parseFloat(String(order.delivery_cost_order)).toFixed(2)}`, 120, yPosition);
  yPosition += 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${t.totalAmount}: €${parseFloat(String(order.total_order)).toFixed(2)}`, 120, yPosition);
  yPosition += 20;

  // Thank you message
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(t.thank, 20, yPosition);

  // Save the PDF
  doc.save(`commande_${order.numero_commande}.pdf`);
};
