
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40
  },
  companyInfo: {
    fontSize: 10,
    color: '#666666'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#B8860B'
  },
  section: {
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  table: {
    marginTop: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    padding: 8,
    fontSize: 10
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'center' },
  col5: { width: '15%', textAlign: 'right' },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 3,
    fontSize: 10
  },
  totalLabel: {
    width: 100
  },
  totalValue: {
    width: 80,
    textAlign: 'right'
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#666666'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#666666',
    textAlign: 'center'
  }
});

interface InvoicePDFProps {
  invoice: {
    numeroFacture: string;
    dateFacture: string;
    dateEcheance: string;
    clientName: string;
    clientAddress?: string;
    clientPhone?: string;
    clientTaxNumber?: string;
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
    companyName?: string;
    companyTaxNumber?: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
  };
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text>Vilart Events</Text>
          <Text>{invoice.companyTaxNumber || '1865480/V/A/M/000'}</Text>
          <Text>{invoice.companyAddress || 'A3, Imm La Coupole, rue Windermere, Lac 1, Tunis 1053'}</Text>
          <Text>Téléphone: {invoice.companyPhone || '+216 54 754 704'}</Text>
          <Text>Email: {invoice.companyEmail || 'vilartprod@gmail.com'}</Text>
        </View>
      </View>

      {/* Invoice Title and Number */}
      <Text style={styles.title}>Facture FAC/{invoice.numeroFacture}</Text>

      {/* Invoice Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View>
            <Text style={{ fontSize: 10, color: '#666666' }}>Date de la facture:</Text>
            <Text style={{ fontSize: 10 }}>{format(new Date(invoice.dateFacture), 'dd/MM/yyyy')}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, color: '#666666' }}>Date d'échéance:</Text>
            <Text style={{ fontSize: 10 }}>{format(new Date(invoice.dateEcheance), 'dd/MM/yyyy')}</Text>
          </View>
        </View>
      </View>

      {/* Client Info */}
      <View style={styles.section}>
        <Text style={{ fontSize: 10, color: '#666666', marginBottom: 5 }}>Facturé à:</Text>
        <Text style={{ fontSize: 12, marginBottom: 3 }}>{invoice.clientName}</Text>
        <Text style={{ fontSize: 10 }}>{invoice.clientAddress || '18 Rue de l\'usine charguia 2'}</Text>
        <Text style={{ fontSize: 10 }}>Tel {invoice.clientPhone || '70 250 000'}</Text>
        <Text style={{ fontSize: 10 }}>MF: {invoice.clientTaxNumber || '70 250 000'}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>DESCRIPTION</Text>
          <Text style={styles.col2}>QUANTITÉ</Text>
          <Text style={styles.col3}>PRIX UNITAIRE</Text>
          <Text style={styles.col4}>TAXES</Text>
          <Text style={styles.col5}>MONTANT</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantite}</Text>
            <Text style={styles.col3}>{item.prixUnitaire.toFixed(2)} DT</Text>
            <Text style={styles.col4}>{item.taxes}%</Text>
            <Text style={styles.col5}>
              {(item.quantite * item.prixUnitaire).toFixed(2)} DT
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Montant hors taxes:</Text>
          <Text style={styles.totalValue}>{invoice.montantHT.toFixed(2)} DT</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TVA (19%):</Text>
          <Text style={styles.totalValue}>{invoice.montantTVA.toFixed(2)} DT</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Timbre Fiscal:</Text>
          <Text style={styles.totalValue}>1,000 DT</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{invoice.total.toFixed(2)} DT</Text>
        </View>
      </View>

      {/* Notes */}
      {invoice.notes && (
        <View style={[styles.section, { marginTop: 40 }]}>
          <Text style={{ fontSize: 10, color: '#666666', marginBottom: 5 }}>Notes:</Text>
          <Text style={{ fontSize: 10 }}>{invoice.notes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Communication de paiement: FAC/{invoice.numeroFacture}</Text>
        <Text>Conditions générales: https://vilartprod.com/terms</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
