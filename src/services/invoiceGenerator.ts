
import jsPDF from 'jspdf';

interface InvoiceItem {
  nom_product: string;
  reference: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
  discount?: number;
}

interface DeliveryAddress {
  nom: string;
  prenom: string;
  telephone?: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
  instructions?: string;
}

interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  customer: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
  };
  items: InvoiceItem[];
  delivery_address?: DeliveryAddress;
  delivery_date?: string;
  sous_total?: number;
  discount_amount?: number;
  delivery_cost?: number;
  total_order: number;
  status?: string;
  payment_method?: string;
  notes?: string;
}

interface InvoiceTranslations {
  title: string;
  orderNumber: string;
  orderDate: string;
  customerInfo: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryAddress: string;
  deliveryDate: string;
  orderItems: string;
  product: string;
  reference: string;
  price: string;
  quantity: string;
  size: string;
  color: string;
  total: string;
  subtotal: string;
  discount: string;
  delivery: string;
  totalAmount: string;
  status: string;
  paymentMethod: string;
  notes: string;
  thank: string;
  company: string;
  currency: string;
}

export const generateInvoicePDF = async (orderData: InvoiceData, language: 'fr' | 'en' = 'fr') => {
  // Load translations
  const translationsModule = language === 'fr' 
    ? await import('../i18n/locales/invoice/fr.json')
    : await import('../i18n/locales/invoice/en.json');
  
  const t: InvoiceTranslations = translationsModule.default;

  const doc = new jsPDF();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.company, 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(16);
  doc.text(t.title, 20, yPosition);
  yPosition += 20;

  // Order Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.orderNumber}: ${orderData.orderNumber}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.orderDate}: ${new Date(orderData.orderDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}`, 20, yPosition);
  yPosition += 8;
  if (orderData.status) {
    doc.text(`${t.status}: ${orderData.status}`, 20, yPosition);
    yPosition += 8;
  }
  if (orderData.payment_method) {
    doc.text(`${t.paymentMethod}: ${orderData.payment_method}`, 20, yPosition);
    yPosition += 8;
  }
  yPosition += 10;

  // Customer Info
  doc.setFont('helvetica', 'bold');
  doc.text(t.customerInfo, 20, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.name}: ${orderData.customer.prenom} ${orderData.customer.nom}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.email}: ${orderData.customer.email}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.phone}: ${orderData.customer.telephone}`, 20, yPosition);
  yPosition += 8;
  doc.text(`${t.address}: ${orderData.customer.adresse}, ${orderData.customer.ville} ${orderData.customer.code_postal}, ${orderData.customer.pays}`, 20, yPosition);
  yPosition += 15;

  // Delivery Address if different
  if (orderData.delivery_address) {
    doc.setFont('helvetica', 'bold');
    doc.text(t.deliveryAddress, 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`${orderData.delivery_address.prenom} ${orderData.delivery_address.nom}`, 20, yPosition);
    yPosition += 8;
    if (orderData.delivery_address.telephone) {
      doc.text(`${t.phone}: ${orderData.delivery_address.telephone}`, 20, yPosition);
      yPosition += 8;
    }
    doc.text(`${orderData.delivery_address.adresse}, ${orderData.delivery_address.ville} ${orderData.delivery_address.code_postal}, ${orderData.delivery_address.pays}`, 20, yPosition);
    yPosition += 15;
  }

  // Delivery Date
  if (orderData.delivery_date) {
    doc.text(`${t.deliveryDate}: ${new Date(orderData.delivery_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}`, 20, yPosition);
    yPosition += 15;
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
  orderData.items.forEach((item) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    const itemTotal = (item.quantity * item.price) - (item.discount || 0);
    
    doc.text(item.nom_product.substring(0, 25), 20, yPosition);
    doc.text(item.reference, 80, yPosition);
    doc.text(`${item.price.toFixed(2)} ${t.currency}`, 120, yPosition);
    doc.text(String(item.quantity), 150, yPosition);
    doc.text(`${itemTotal.toFixed(2)} ${t.currency}`, 170, yPosition);
    yPosition += 8;
    
    if (item.size || item.color) {
      doc.setFontSize(8);
      const details = [];
      if (item.size) details.push(`${t.size}: ${item.size}`);
      if (item.color) details.push(`${t.color}: ${item.color}`);
      doc.text(details.join(' | '), 20, yPosition);
      doc.setFontSize(10);
      yPosition += 6;
    }
  });

  yPosition += 10;
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 15;

  // Totals
  doc.setFont('helvetica', 'normal');
  if (orderData.sous_total) {
    doc.text(`${t.subtotal}: ${orderData.sous_total.toFixed(2)} ${t.currency}`, 120, yPosition);
    yPosition += 8;
  }
  
  if (orderData.discount_amount && orderData.discount_amount > 0) {
    doc.text(`${t.discount}: -${orderData.discount_amount.toFixed(2)} ${t.currency}`, 120, yPosition);
    yPosition += 8;
  }
  
  if (orderData.delivery_cost) {
    doc.text(`${t.delivery}: ${orderData.delivery_cost.toFixed(2)} ${t.currency}`, 120, yPosition);
    yPosition += 15;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${t.totalAmount}: ${orderData.total_order.toFixed(2)} ${t.currency}`, 120, yPosition);
  yPosition += 20;

  // Notes
  if (orderData.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${t.notes}: ${orderData.notes}`, 20, yPosition);
    yPosition += 15;
  }

  // Thank you message
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(t.thank, 20, yPosition);

  // Download the PDF
  doc.save(`facture_${orderData.orderNumber}.pdf`);
};
