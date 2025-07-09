import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const generateOrderReceiptPDF = (orderData: any, language: 'fr' | 'en' = 'fr') => {
  console.log('Generating PDF with order data:', orderData);
  
  const doc = new jsPDF();

  // Professional color scheme matching your app
  const colors = {
    primary: '#1a1a1a',
    secondary: '#666666', 
    accent: '#d4af37',
    light: '#f8f9fa',
    border: '#e5e7eb',
    success: '#059669',
    background: '#ffffff'
  };

  // Typography settings
  const fonts = {
    title: 22,
    subtitle: 16,
    heading: 14,
    body: 11,
    small: 9
  };

  const margin = 20;
  let yPos = margin;

  // Helper functions
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    doc.setFontSize(options.size || fonts.body);
    doc.setTextColor(options.color || colors.primary);
    doc.setFont('helvetica', options.weight || 'normal');
    doc.text(text, x, y);
  };

  const addLine = (y: number, color: string = colors.border, width: number = 0.5) => {
    doc.setLineWidth(width);
    doc.setDrawColor(color);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
  };

  const formatPrice = (price: any): string => {
    const num = parseFloat(String(price)) || 0;
    return new Intl.NumberFormat('fr-TN', { 
      style: 'decimal', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(num) + ' TND';
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: language === 'fr' ? fr : undefined });
    } catch {
      return dateString;
    }
  };

  // Header with company branding
  yPos += 10;
  doc.setFillColor(colors.primary);
  doc.rect(margin, yPos - 8, doc.internal.pageSize.getWidth() - 2 * margin, 25, 'F');
  
  addText('SPADA DI BATTIGLIA', margin + 10, yPos + 8, { 
    size: fonts.title, 
    color: '#ffffff', 
    weight: 'bold' 
  });
  addText('Boutique de Mode Premium', margin + 10, yPos + 18, { 
    size: fonts.body, 
    color: '#ffffff' 
  });

  // Invoice title and number
  const invoiceTitle = language === 'fr' ? 'FACTURE' : 'INVOICE';
  addText(invoiceTitle, doc.internal.pageSize.getWidth() - margin - 40, yPos + 8, { 
    size: fonts.subtitle, 
    color: '#ffffff', 
    weight: 'bold' 
  });

  yPos += 45;

  // Order information section
  const orderNumber = orderData.numero_commande || orderData.order_number || 'N/A';
  const orderDate = orderData.date_creation_order || orderData.date_creation || orderData.created_at;

  addText(`${language === 'fr' ? 'N° Commande:' : 'Order Number:'} ${orderNumber}`, margin, yPos, { 
    size: fonts.heading, 
    weight: 'bold' 
  });
  yPos += 10;
  addText(`${language === 'fr' ? 'Date:' : 'Date:'} ${formatDate(orderDate)}`, margin, yPos);
  yPos += 20;

  // Customer and delivery information in two columns
  const colWidth = (doc.internal.pageSize.getWidth() - 3 * margin) / 2;
  
  // Customer info
  addText(language === 'fr' ? 'INFORMATIONS CLIENT' : 'CUSTOMER INFORMATION', margin, yPos, { 
    size: fonts.heading, 
    weight: 'bold',
    color: colors.primary
  });

  const customer = orderData.customer || {};
  const customerName = `${customer.prenom || orderData.prenom_customer || ''} ${customer.nom || orderData.nom_customer || ''}`.trim() || 'N/A';
  const customerEmail = customer.email || orderData.email_customer || 'N/A';
  const customerPhone = customer.telephone || orderData.telephone_customer || 'N/A';
  const customerAddress = customer.adresse || orderData.adresse_customer || 'N/A';
  const customerCity = `${customer.ville || orderData.ville_customer || ''} ${customer.code_postal || orderData.code_postal_customer || ''}`.trim();
  const customerCountry = customer.pays || orderData.pays_customer || 'N/A';

  yPos += 15;
  addText(`${language === 'fr' ? 'Nom:' : 'Name:'} ${customerName}`, margin, yPos);
  yPos += 8;
  addText(`Email: ${customerEmail}`, margin, yPos);
  yPos += 8;
  addText(`${language === 'fr' ? 'Téléphone:' : 'Phone:'} ${customerPhone}`, margin, yPos);
  yPos += 8;
  addText(`${language === 'fr' ? 'Adresse:' : 'Address:'} ${customerAddress}`, margin, yPos);
  yPos += 8;
  if (customerCity) {
    addText(`${customerCity}, ${customerCountry}`, margin, yPos);
  }

  // Delivery info (right column)
  const deliveryStartY = yPos - 40;
  addText(language === 'fr' ? 'ADRESSE DE LIVRAISON' : 'DELIVERY ADDRESS', margin + colWidth + 10, deliveryStartY, { 
    size: fonts.heading, 
    weight: 'bold',
    color: colors.primary
  });

  const delivery = orderData.delivery_address || {};
  const deliveryName = `${delivery.prenom_destinataire || customerName}`.trim();
  const deliveryAddress = delivery.adresse_livraison || customerAddress;
  const deliveryCity = `${delivery.ville_livraison || customer.ville || orderData.ville_customer || ''} ${delivery.code_postal_livraison || customer.code_postal || orderData.code_postal_customer || ''}`.trim();
  const deliveryCountry = delivery.pays_livraison || customerCountry;
  const deliveryPhone = delivery.telephone_destinataire || customerPhone;

  let tempY = deliveryStartY + 15;
  addText(`${language === 'fr' ? 'Nom:' : 'Name:'} ${deliveryName}`, margin + colWidth + 10, tempY);
  tempY += 8;
  addText(`${language === 'fr' ? 'Téléphone:' : 'Phone:'} ${deliveryPhone}`, margin + colWidth + 10, tempY);
  tempY += 8;
  addText(`${language === 'fr' ? 'Adresse:' : 'Address:'} ${deliveryAddress}`, margin + colWidth + 10, tempY);
  tempY += 8;
  if (deliveryCity) {
    addText(`${deliveryCity}, ${deliveryCountry}`, margin + colWidth + 10, tempY);
  }

  yPos += 30;
  addLine(yPos);
  yPos += 15;

  // Order items table
  addText(language === 'fr' ? 'DÉTAILS DE LA COMMANDE' : 'ORDER DETAILS', margin, yPos, { 
    size: fonts.heading, 
    weight: 'bold',
    color: colors.primary
  });
  yPos += 15;

  const items = orderData.items || [];
  const tableData = items.map((item: any) => [
    item.nom_product_snapshot || item.name || 'N/A',
    item.reference_product_snapshot || item.reference || '-',
    `${item.size_selected || '-'} / ${item.color_selected || '-'}`,
    String(item.quantity_ordered || item.quantity || 1),
    formatPrice(item.price_product_snapshot || item.price || 0),
    formatPrice(item.total_item || (item.price_product_snapshot || item.price || 0) * (item.quantity_ordered || item.quantity || 1))
  ]);

  const headers = language === 'fr' 
    ? ['Produit', 'Référence', 'Taille/Couleur', 'Qté', 'Prix Unit.', 'Total']
    : ['Product', 'Reference', 'Size/Color', 'Qty', 'Unit Price', 'Total'];

  (doc as any).autoTable({
    startY: yPos,
    head: [headers],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: colors.primary,
      textColor: '#ffffff',
      fontStyle: 'bold',
      fontSize: fonts.body
    },
    bodyStyles: { 
      textColor: colors.primary,
      fontSize: fonts.small
    },
    alternateRowStyles: { 
      fillColor: colors.light 
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 35 },
      2: { cellWidth: 35 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });

  const finalY = (doc as any).autoTable.previous.finalY + 20;

  // Financial summary
  const subtotal = parseFloat(String(orderData.sous_total_order || orderData.subtotal || 0));
  const discount = parseFloat(String(orderData.discount_amount_order || orderData.discount_amount || 0));
  const shipping = parseFloat(String(orderData.delivery_cost_order || orderData.shipping_cost || 0));
  const total = parseFloat(String(orderData.total_order || orderData.total || subtotal + shipping - discount));

  const summaryX = doc.internal.pageSize.getWidth() - margin - 80;
  let summaryY = finalY;

  addLine(summaryY - 5);
  
  addText(`${language === 'fr' ? 'Sous-total:' : 'Subtotal:'} ${formatPrice(subtotal)}`, summaryX, summaryY, { size: fonts.body });
  summaryY += 10;
  
  if (discount > 0) {
    addText(`${language === 'fr' ? 'Remise:' : 'Discount:'} -${formatPrice(discount)}`, summaryX, summaryY, { 
      size: fonts.body, 
      color: colors.success 
    });
    summaryY += 10;
  }
  
  addText(`${language === 'fr' ? 'Livraison:' : 'Shipping:'} ${formatPrice(shipping)}`, summaryX, summaryY, { size: fonts.body });
  summaryY += 15;
  
  addLine(summaryY - 5, colors.primary, 1);
  addText(`${language === 'fr' ? 'TOTAL:' : 'TOTAL:'} ${formatPrice(total)}`, summaryX, summaryY + 5, { 
    size: fonts.heading, 
    weight: 'bold',
    color: colors.primary
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  addLine(footerY - 10);
  addText(language === 'fr' ? 'Merci pour votre confiance!' : 'Thank you for your trust!', margin, footerY, { 
    size: fonts.body,
    color: colors.secondary
  });
  addText('SPADA DI BATTAGLIA - Boutique de Mode Premium', margin, footerY + 10, { 
    size: fonts.small,
    color: colors.secondary
  });

  // Save PDF
  const filename = `facture_${orderNumber}_${language.toUpperCase()}.pdf`;
  doc.save(filename);
  
  console.log(`PDF generated successfully: ${filename}`);
};

// Keep backward compatibility
export const generateOrderReceipt = generateOrderReceiptPDF;
