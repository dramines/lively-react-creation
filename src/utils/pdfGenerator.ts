import jsPDF from 'jspdf';
import { FaceDesign } from '@/components/personalization/types/faceDesign';

export const generateDesignPDF = async (designs: { [key: string]: FaceDesign }, selectedSize: string, quantity: number) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let yOffset = 15;

  // Add professional header with gray gradient instead of black
  pdf.setFillColor(142, 145, 150); // Using a neutral gray color
  pdf.rect(0, 0, pdf.internal.pageSize.width, 40, 'F');
  
  // Add company logo
  try {
    const logoImg = '/logo.png';
    pdf.addImage(logoImg, 'PNG', 15, 10, 30, 15);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du logo:', error);
  }

  // Add document title with professional styling
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Spécifications de Design', pdf.internal.pageSize.width / 2, 25, { align: 'center' });
  yOffset = 50;

  // Add order summary section with enhanced styling
  pdf.setFillColor(245, 247, 250);
  pdf.rect(15, yOffset, pdf.internal.pageSize.width - 30, 35, 'F');
  pdf.setDrawColor(230, 230, 230);
  pdf.rect(15, yOffset, pdf.internal.pageSize.width - 30, 35, 'D');
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(51, 51, 51);
  pdf.text('Résumé de la Commande', 20, yOffset + 8);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text([
    `Taille: ${selectedSize}`,
    `Quantité: ${quantity} unités`,
    `Date de création: ${new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`
  ], 20, yOffset + 18);
  yOffset += 45;

  // Process each design face with enhanced presentation
  for (const [key, design] of Object.entries(designs)) {
    if (yOffset > 250) {
      pdf.addPage();
      yOffset = 20;
    }

    // Add face section header with gradient
    pdf.setFillColor(245, 247, 250);
    pdf.rect(15, yOffset, pdf.internal.pageSize.width - 30, 15, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(15, yOffset, pdf.internal.pageSize.width - 30, 15, 'D');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 51, 51);
    pdf.text(`Design - ${design.faceId}`, 20, yOffset + 10);
    yOffset += 20;

    // Add design preview with enhanced border and shadow effect
    try {
      const imgData = design.canvasImage;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 180;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(15, yOffset, pdfWidth, pdfHeight, 3, 3, 'FD');
      
      pdf.addImage(imgData, 'PNG', 15, yOffset, pdfWidth, pdfHeight);
      yOffset += pdfHeight + 15;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'aperçu du design:', error);
    }

    // Text Elements Section with text previews
    if (design.textElements.length > 0) {
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 20;
      }

      pdf.setFillColor(245, 247, 250);
      pdf.rect(15, yOffset, pdf.internal.pageSize.width - 30, 12, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(15, yOffset, pdf.internal.pageSize.width - 30, 12, 'D');
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Éléments de Texte', 20, yOffset + 9);
      yOffset += 20;

      design.textElements.forEach((text, index) => {
        // Create text preview canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 500;
        canvas.height = 100;

        // Set text properties
        ctx.fillStyle = text.color;
        const fontWeight = text.style.bold ? 'bold' : 'normal';
        const fontStyle = text.style.italic ? 'italic' : 'normal';
        ctx.font = `${fontWeight} ${fontStyle} ${text.size * 2}px ${text.font}`;
        ctx.textAlign = text.style.align as CanvasTextAlign;
        ctx.textBaseline = 'middle';

        // Draw text
        ctx.fillText(text.content, canvas.width / 2, canvas.height / 2);
        
        // Add underline if needed
        if (text.style.underline) {
          const textMetrics = ctx.measureText(text.content);
          const xStart = (canvas.width - textMetrics.width) / 2;
          ctx.beginPath();
          ctx.moveTo(xStart, canvas.height / 2 + text.size);
          ctx.lineTo(xStart + textMetrics.width, canvas.height / 2 + text.size);
          ctx.strokeStyle = text.color;
          ctx.lineWidth = text.size / 10;
          ctx.stroke();
        }

        // Add text preview to PDF
        try {
          const textPreviewImage = canvas.toDataURL('image/png');
          pdf.addImage(textPreviewImage, 'PNG', 25, yOffset, 160, 32);
          yOffset += 40;
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'aperçu du texte:', error);
        }

        // Add text details box
        pdf.setFillColor(250, 250, 250);
        pdf.setDrawColor(230, 230, 230);
        pdf.roundedRect(20, yOffset, 170, 50, 3, 3, 'FD');
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text(`Texte ${index + 1}:`, 25, yOffset + 8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`"${text.content}"`, 60, yOffset + 8);
        
        // Font details
        pdf.setFontSize(10);
        pdf.text([
          `Police: ${text.font}`,
          `Taille: ${text.size}px`,
          `Couleur: ${text.color}`
        ].join('  •  '), 25, yOffset + 20);
        
        // Style details
        const styles = [];
        if (text.style.bold) styles.push('Gras');
        if (text.style.italic) styles.push('Italique');
        if (text.style.underline) styles.push('Souligné');
        styles.push(`Alignement: ${
          text.style.align === 'center' ? 'Centré' :
          text.style.align === 'right' ? 'Droite' : 'Gauche'
        }`);
        
        pdf.text(`Styles: ${styles.join(' • ')}`, 25, yOffset + 32);
        
        yOffset += 60;
      });
    }

    // Images Section with enhanced presentation
    if (design.uploadedImages.length > 0) {
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 20;
      }

      pdf.setFillColor(245, 247, 250);
      pdf.rect(15, yOffset, pdf.internal.pageSize.width - 30, 12, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(15, yOffset, pdf.internal.pageSize.width - 30, 12, 'D');
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Images Téléchargées', 20, yOffset + 9);
      yOffset += 20;

      design.uploadedImages.forEach((image, index) => {
        // Image info box with enhanced styling
        pdf.setFillColor(250, 250, 250);
        pdf.setDrawColor(230, 230, 230);
        pdf.roundedRect(20, yOffset, 170, 80, 3, 3, 'FD');
        
        // Image details with better organization
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Image ${index + 1}:`, 25, yOffset + 8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(image.name, 70, yOffset + 8);

        // Add image metadata
        pdf.setFontSize(10);
        pdf.text(`Nom du fichier: ${image.name}`, 25, yOffset + 20);

        try {
          const imgProps = pdf.getImageProperties(image.url);
          const maxWidth = 80;
          const maxHeight = 50;
          let imgWidth = maxWidth;
          let imgHeight = (imgProps.height * maxWidth) / imgProps.width;
          
          if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = (imgProps.width * maxHeight) / imgProps.height;
          }
          
          // Add image with border
          pdf.setDrawColor(230, 230, 230);
          pdf.roundedRect(25, yOffset + 25, imgWidth, imgHeight, 2, 2, 'D');
          pdf.addImage(image.url, 'PNG', 25, yOffset + 25, imgWidth, imgHeight);

          // Add image dimensions
          pdf.text(`Dimensions: ${imgProps.width}px × ${imgProps.height}px`, 25, yOffset + 70);
        } catch (error) {
          console.error(`Erreur lors de l'ajout de l'image ${image.name}:`, error);
          pdf.text('Erreur lors du chargement de l\'image', 25, yOffset + 40);
        }
        
        yOffset += 90;
      });
    }

    yOffset += 10;
  }

  // Add professional footer with page numbers and timestamp
  const pageCount = pdf.getNumberOfPages();
  const timestamp = new Date().toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFillColor(245, 247, 250);
    pdf.rect(0, pdf.internal.pageSize.height - 20, pdf.internal.pageSize.width, 20, 'F');
    
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Document généré le ${timestamp}`, 15, pdf.internal.pageSize.height - 8);
    pdf.text(`Page ${i} sur ${pageCount}`, pdf.internal.pageSize.width - 15, pdf.internal.pageSize.height - 8, { align: 'right' });
  }

  pdf.save('specifications-design.pdf');
};
