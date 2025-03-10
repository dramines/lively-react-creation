
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #eee',
    paddingBottom: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    width: '30%',
  },
  infoValue: {
    fontSize: 12,
    width: '70%',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 10,
  },
  itemsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
    paddingTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    fontSize: 12,
  },
  itemDescription: {
    width: '40%',
  },
  itemQuantity: {
    width: '15%',
    textAlign: 'center',
  },
  itemPrice: {
    width: '15%',
    textAlign: 'right',
  },
  itemTax: {
    width: '15%',
    textAlign: 'right',
  },
  itemTotal: {
    width: '15%',
    textAlign: 'right',
  },
  totalsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsColumn: {
    width: '30%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
  },
  totalValue: {
    fontSize: 12,
    textAlign: 'right',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  notes: {
    fontSize: 11,
    color: '#666',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
  }
});

// Define the prop types
interface InvoiceProps {
  invoice: {
    numeroFacture: string;
    dateFacture: string;
    dateEcheance: string;
    clientName: string;
    items: Array<{
      description: string;
      quantite: number;
      prixUnitaire: number;
      taxes: number;
    }>;
    montantHT: number;
    montantTVA: number;
    total: number;
    notes?: string;
  };
}

const InvoicePDF: React.FC<InvoiceProps> = ({ invoice }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>Vilart Production</Text>
          <Text style={styles.title}>Devis {invoice.numeroFacture}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={{ width: '50%' }}>
            <Text style={styles.infoLabel}>Client:</Text>
            <Text style={styles.infoValue}>{invoice.clientName}</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={styles.infoLabel}>Date du devis:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(invoice.dateFacture), 'dd/MM/yyyy')}
            </Text>
            <Text style={styles.infoLabel}>Date d'échéance:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(invoice.dateEcheance), 'dd/MM/yyyy')}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemDescription}>Description</Text>
            <Text style={styles.itemQuantity}>Quantité</Text>
            <Text style={styles.itemPrice}>Prix</Text>
            <Text style={styles.itemTax}>TVA (%)</Text>
            <Text style={styles.itemTotal}>Total</Text>
          </View>
          
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemQuantity}>{item.quantite}</Text>
              <Text style={styles.itemPrice}>{item.prixUnitaire.toFixed(2)} €</Text>
              <Text style={styles.itemTax}>{item.taxes}%</Text>
              <Text style={styles.itemTotal}>
                {(item.quantite * item.prixUnitaire).toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.totalsContainer}>
          <View style={styles.totalsColumn}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total:</Text>
              <Text style={styles.totalValue}>{invoice.montantHT.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA:</Text>
              <Text style={styles.totalValue}>{invoice.montantTVA.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>{invoice.total.toFixed(2)} €</Text>
            </View>
          </View>
        </View>
        
        {invoice.notes && (
          <View style={styles.notes}>
            <Text>Notes: {invoice.notes}</Text>
          </View>
        )}
        
        <View style={styles.footer}>
          <Text>Vilart Production - SIRET: 12345678900001</Text>
          <Text>123 Rue de la Musique, 75001 Paris - contact@vilartprod.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
