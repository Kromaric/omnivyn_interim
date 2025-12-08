import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Text, ActivityIndicator, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as api from '../api';

export default function PaiementsScreen() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPaiements();
  }, []);

  const loadPaiements = async () => {
    try {
      const response = await api.getMesPaiements();
      setPaiements(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement paiements:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPaiements();
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'paye':
        return '#10b981';
      case 'valide':
        return '#3b82f6';
      case 'en_attente':
        return '#f59e0b';
      case 'refuse':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'paye':
        return 'Payé';
      case 'valide':
        return 'Validé';
      case 'en_attente':
        return 'En attente';
      case 'refuse':
        return 'Refusé';
      default:
        return statut;
    }
  };

  const calculateTotal = () => {
    return paiements
      .filter((p: any) => p.statut === 'paye')
      .reduce((sum: number, p: any) => sum + parseFloat(p.montant), 0)
      .toFixed(2);
  };

  const renderPaiement = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Title style={styles.amount}>{parseFloat(item.montant).toFixed(2)}€</Title>
            <Text style={styles.mission}>{item.mission?.titre}</Text>
            <Text style={styles.company}>{item.entreprise?.nom}</Text>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.statut) }]}
            textStyle={styles.statusText}
          >
            {getStatusLabel(item.statut)}
          </Chip>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>
            {new Date(item.created_at).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        {item.date_paiement && (
          <View style={styles.infoRow}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.infoText}>
              Payé le {new Date(item.date_paiement).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        )}

        {item.notes && (
          <Paragraph numberOfLines={2} style={styles.notes}>
            {item.notes}
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.totalCard}>
        <Card.Content>
          <View style={styles.totalContainer}>
            <View>
              <Text style={styles.totalLabel}>Total reçu</Text>
              <Title style={styles.totalAmount}>{calculateTotal()}€</Title>
            </View>
            <Icon name="cash-multiple" size={48} color="#10b981" />
          </View>
        </Card.Content>
      </Card>

      <View style={styles.header}>
        <Text style={styles.headerText}>
          {paiements.length} paiement{paiements.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={paiements}
        renderItem={renderPaiement}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="currency-eur-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucun paiement</Text>
            <Text style={styles.emptySubtext}>
              Vos paiements apparaîtront ici
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalCard: {
    margin: 10,
    backgroundColor: '#fff',
    elevation: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 5,
  },
  mission: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  company: {
    fontSize: 14,
    color: '#666',
  },
  statusChip: {
    height: 30,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  notes: {
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#bbb',
  },
});
