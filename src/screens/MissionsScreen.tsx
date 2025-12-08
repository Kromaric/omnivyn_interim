import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, ActivityIndicator, Chip, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as api from '../api';

export default function MissionsScreen({ navigation }: any) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const response = await api.getMissionsDisponibles();
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

  const filteredMissions = missions.filter((mission: any) =>
    mission.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.entreprise?.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMission = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('MissionDetail', { missionId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Title style={styles.title}>{item.titre}</Title>
              <Text style={styles.company}>{item.entreprise?.nom}</Text>
            </View>
            <View style={styles.salaryContainer}>
              <Text style={styles.salary}>{item.taux_horaire}€/h</Text>
            </View>
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

          {item.competences_requises && item.competences_requises.length > 0 && (
            <View style={styles.competencesContainer}>
              {item.competences_requises.slice(0, 3).map((comp: string, index: number) => (
                <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                  {comp}
                </Chip>
              ))}
            </View>
          )}

          <Paragraph numberOfLines={2} style={styles.description}>
            {item.description}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
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
      <Searchbar
        placeholder="Rechercher une mission..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>
          {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} disponible{filteredMissions.length > 1 ? 's' : ''}
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
            <Icon name="briefcase-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucune mission disponible</Text>
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
  searchbar: {
    margin: 10,
    elevation: 2,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  salaryContainer: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  salary: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  competencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
    height: 28,
  },
  chipText: {
    fontSize: 12,
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
  },
});
