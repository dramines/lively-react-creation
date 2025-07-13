
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
      subtitle: 'Boutique de Luxe • Maroquinerie d\'Exception',
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
      thank: 'Merci pour votre confiance !',
      footer: 'LUCCI BY E.Y • Pour toute question : contact@luccibey.com • Tel: +216 55542230',
      signature: 'Signature électronique validée',
      warranty: 'Garantie 2 ans • Échange 30 jours • Livraison assurée'
    },
    en: {
      title: 'ORDER RECEIPT',
      company: 'LUCCI BY E.Y',
      subtitle: 'Luxury Boutique • Exceptional Leather Goods',
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
      thank: 'Thank you for your trust!',
      footer: 'LUCCI BY E.Y • For any questions: contact@luccibey.com • Tel: +216 55542230',
      signature: 'Electronic signature validated',
      warranty: '2-year warranty • 30-day exchange • Insured delivery'
    }
  };

  const t = translations[language];
  let yPosition = 20;

  // Luxury color palette
  const darkNavy = [25, 32, 56];        // Primary dark
  const goldAccent = [212, 175, 55];    // Luxury gold
  const charcoal = [64, 64, 64];        // Dark gray
  const lightGray = [248, 250, 252];    // Very light background
  const mediumGray = [156, 163, 175];   // Medium gray
  const white = [255, 255, 255];

  // Premium header with gradient effect
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 55, 'F');
  
  // Gold accent line
  doc.setFillColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.rect(0, 50, 210, 5, 'F');
  
  // Company name with elegant typography
  doc.setTextColor(white[0], white[1], white[2]);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(t.company, 20, 30);
  
  // Luxury subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(t.subtitle, 20, 42);
  
  // Receipt title with gold accent
  yPosition = 75;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(t.title, 20, yPosition);
  
  // Gold underline for title
  doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.setLineWidth(2);
  doc.line(20, yPosition + 3, 120, yPosition + 3);
  
  yPosition += 25;

  // Order information in elegant box with better spacing
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(15, yPosition - 8, 180, 38, 'F');
  doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.setLineWidth(1);
  doc.rect(15, yPosition - 8, 180, 38, 'S');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  
  // Order details with professional spacing
  doc.text(`${t.orderNumber}:`, 25, yPosition + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(order.numero_commande, 85, yPosition + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${t.orderDate}:`, 25, yPosition + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(order.date_creation_order).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US'), 85, yPosition + 22);
  
  yPosition += 45;

  // Customer section with modern design
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(t.customerInfo, 20, yPosition);
  
  // Gold accent line under section title
  doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.setLineWidth(1);
  doc.line(20, yPosition + 2, 80, yPosition + 2);
  
  yPosition += 15;
  
  // Customer details in structured layout
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  
  const customerDetails = [
    [`${t.name}:`, `${order.customer.prenom} ${order.customer.nom}`],
    [`${t.email}:`, order.customer.email],
    [`${t.phone}:`, order.customer.telephone],
    [`${t.address}:`, order.customer.adresse]
  ];
  
  customerDetails.forEach(([label, value], index) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.text(label, 20, yPosition + (index * 10));
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.text(value, 55, yPosition + (index * 10));
  });
  
  yPosition += 50;

  // Delivery address section if exists
  if (order.delivery_address) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(t.deliveryAddress, 20, yPosition);
    
    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.line(20, yPosition + 2, 85, yPosition + 2);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    
    const deliveryDetails = [
      [`${t.name}:`, `${order.delivery_address.prenom_destinataire} ${order.delivery_address.nom_destinataire}`],
      [`${t.phone}:`, order.delivery_address.telephone_destinataire],
      [`${t.address}:`, order.delivery_address.adresse_livraison],
      ['Ville:', `${order.delivery_address.ville_livraison} ${order.delivery_address.code_postal_livraison}`],
      ['Pays:', order.delivery_address.pays_livraison]
    ];
    
    deliveryDetails.forEach(([label, value], index) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
      doc.text(label, 20, yPosition + (index * 8));
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      doc.text(value, 55, yPosition + (index * 8));
    });
    
    yPosition += 50;
  }

  // Premium items section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(t.orderItems, 20, yPosition);
  
  doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.line(20, yPosition + 2, 85, yPosition + 2);
  yPosition += 20;

  // Elegant table header
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(15, yPosition - 8, 180, 15, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text(t.product, 20, yPosition);
  doc.text(t.reference, 85, yPosition);
  doc.text(t.price, 125, yPosition);
  doc.text(t.quantity, 155, yPosition);
  doc.text(t.total, 175, yPosition);
  yPosition += 15;

  // Items with alternating backgrounds
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  
  order.items.forEach((item, index) => {
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Alternating row colors for elegance
    if (index % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(15, yPosition - 5, 180, 20, 'F');
    }
    
    doc.setFontSize(9);
    const productName = item.nom_product_snapshot.length > 20 ? 
      item.nom_product_snapshot.substring(0, 20) + '...' : 
      item.nom_product_snapshot;
    
    doc.setFont('helvetica', 'bold');
    doc.text(productName, 20, yPosition + 2);
    
    doc.setFont('helvetica', 'normal');
    doc.text(item.reference_product_snapshot, 85, yPosition + 2);
    doc.text(`€${parseFloat(String(item.price_product_snapshot)).toFixed(2)}`, 125, yPosition + 2);
    doc.text(String(item.quantity_ordered), 160, yPosition + 2);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`€${parseFloat(String(item.total_item)).toFixed(2)}`, 175, yPosition + 2);
    
    // Item details on second line
    if (item.size_selected || item.color_selected) {
      doc.setFontSize(8);
      doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
      doc.text(`${t.size}: ${item.size_selected || 'N/A'} • ${t.color}: ${item.color_selected || 'N/A'}`, 20, yPosition + 10);
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      yPosition += 8;
    }
    yPosition += 18;
  });

  yPosition += 15;

  // Premium summary section
  const summaryStartY = yPosition;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(110, yPosition - 5, 85, 50, 'F');
  doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.setLineWidth(1.5);
  doc.rect(110, yPosition - 5, 85, 50, 'S');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  
  // Summary details
  doc.text(`${t.subtotal}:`, 115, yPosition + 5);
  doc.text(`€${parseFloat(String(order.sous_total_order)).toFixed(2)}`, 170, yPosition + 5);
  
  if (order.discount_amount_order > 0) {
    doc.setTextColor(200, 50, 50);
    doc.text(`${t.discount}:`, 115, yPosition + 15);
    doc.text(`-€${parseFloat(String(order.discount_amount_order)).toFixed(2)}`, 170, yPosition + 15);
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    yPosition += 10;
  }
  
  doc.text(`${t.delivery}:`, 115, yPosition + 15);
  doc.text(`€${parseFloat(String(order.delivery_cost_order)).toFixed(2)}`, 170, yPosition + 15);
  
  // Total with gold background
  doc.setFillColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.rect(110, yPosition + 20, 85, 15, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`${t.totalAmount}:`, 115, yPosition + 30);
  doc.text(`€${parseFloat(String(order.total_order)).toFixed(2)}`, 165, yPosition + 30);

  yPosition += 55;

  // Additional information section
  if (order.payment_method || order.notes_order) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    
    if (order.payment_method) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${t.paymentMethod}:`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(order.payment_method, 70, yPosition);
      yPosition += 10;
    }
    
    if (order.notes_order) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${t.notes}:`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      const notes = order.notes_order.length > 80 ? order.notes_order.substring(0, 80) + '...' : order.notes_order;
      doc.text(notes, 20, yPosition + 8);
      yPosition += 20;
    }
  }

  // Thank you message with elegant styling
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.text(t.thank, 20, yPosition);
  yPosition += 15;

  // Warranty and guarantee info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text(t.warranty, 20, yPosition);
  yPosition += 10;

  // Electronic signature
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(t.signature, 20, yPosition);
  yPosition += 15;

  // Premium footer
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 270, 210, 27, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text(t.footer, 20, 285);

  // Elegant border
  doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 277);

  // Save with professional naming
  const fileName = `LUCCI_Receipt-${order.numero_commande}_${language.toUpperCase()}.pdf`;
  doc.save(fileName);
};
