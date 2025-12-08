import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Text, ActivityIndicator, Chip, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as api from '../api';

export default function ContratsScreen({ navigation }: any) {
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadContrats();
  }, []);

  const loadContrats = async () => {
    try {
      const response = await api.getMesContrats();
      setContrats(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement contrats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadContrats();
  };

  const handleSignContract = (contratId: number) => {
    navigation.navigate('Signature', { contratId });
  };

  const getStatusColor = (isSigned: boolean) => {
    return isSigned ? '#10b981' : '#f59e0b';
  };

  const getStatusLabel = (isSigned: boolean) => {
    return isSigned ? 'Signé' : 'À signer';
  };

  const renderContrat = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>{item.mission?.titre || 'Contrat'}</Title>
            <Text style={styles.company}>{item.entreprise?.nom}</Text>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(!!item.signature_interimaire) }]}
            textStyle={styles.statusText}
          >
            {getStatusLabel(!!item.signature_interimaire)}
          </Chip>
        </View>

        <View style={styles.infoRow}>
          <Icon name="file-document" size={16} color="#666" />
          <Text style={styles.infoText}>Type: {item.type}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar-start" size={16} color="#666" />
          <Text style={styles.infoText}>
            Du {new Date(item.date_debut).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar-end" size={16} color="#666" />
          <Text style={styles.infoText}>
            Au {new Date(item.date_fin).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="currency-eur" size={16} color="#666" />
          <Text style={styles.infoText}>Taux: {item.taux_horaire}€/h</Text>
        </View>

        {item.signature_interimaire ? (
          <View style={styles.signatureContainer}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.signedText}>
              Signé le {new Date(item.date_signature_interimaire).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={() => handleSignContract(item.id)}
            style={styles.signButton}
            icon="pen"
          >
            Signer le contrat
          </Button>
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
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {contrats.length} contrat{contrats.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={contrats}
        renderItem={renderContrat}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucun contrat</Text>
            <Text style={styles.emptySubtext}>
              Postulez à des missions pour obtenir des contrats
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
  signatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#d1fae5',
    borderRadius: 8,
  },
  signedText: {
    marginLeft: 10,
    color: '#059669',
    fontWeight: '600',
  },
  signButton: {
    marginTop: 15,
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
