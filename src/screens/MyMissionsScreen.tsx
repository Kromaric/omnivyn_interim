import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Text, ActivityIndicator, Chip, SegmentedButtons } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as api from '../api';

export default function MyMissionsScreen() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const response = await api.getMesMissions();
      setMissions(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement missions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMissions();
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return '#10b981';
      case 'terminee':
        return '#6b7280';
      case 'ouverte':
        return '#3b82f6';
      default:
        return '#9ca3af';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return 'En cours';
      case 'terminee':
        return 'Terminée';
      case 'ouverte':
        return 'Ouverte';
      default:
        return statut;
    }
  };

  const filteredMissions = missions.filter((mission: any) => {
    if (filter === 'all') return true;
    return mission.statut === filter;
  });

  const renderMission = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>{item.titre}</Title>
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
          <Icon name="map-marker" size={16} color="#666" />
          <Text style={styles.infoText}>{item.lieu}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>
            Du {new Date(item.date_debut).toLocaleDateString()} au {new Date(item.date_fin).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="currency-eur" size={16} color="#666" />
          <Text style={styles.infoText}>{item.taux_horaire}€/h</Text>
        </View>

        {item.description && (
          <Paragraph numberOfLines={2} style={styles.description}>
            {item.description}
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
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'all', label: 'Toutes' },
            { value: 'en_cours', label: 'En cours' },
            { value: 'terminee', label: 'Terminées' },
          ]}
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>
          {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredMissions}
        renderItem={renderMission}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="briefcase-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucune mission trouvée</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'all' 
                ? 'Vous n\'avez aucune mission pour le moment'
                : `Aucune mission ${getStatusLabel(filter).toLowerCase()}`
              }
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
  filterContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    marginBottom: 10,
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
  description: {
    marginTop: 10,
    color: '#666',
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
