import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Text, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.getDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Title style={styles.welcome}>Bonjour {user?.prenom} !</Title>
        <Paragraph style={styles.headerText}>Voici vos statistiques</Paragraph>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats?.missions_en_cours || 0}</Title>
            <Paragraph>Missions en cours</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats?.missions_completees || 0}</Title>
            <Paragraph>Missions complétées</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats?.missions_disponibles || 0}</Title>
            <Paragraph>Missions disponibles</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats?.total_heures || 0}h</Title>
            <Paragraph>Heures travaillées</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Derniers paiements</Title>
          <Paragraph style={styles.amount}>
            {stats?.dernier_paiement || '0.00'} €
          </Paragraph>
          <Text style={styles.subtext}>Total ce mois</Text>
        </Card.Content>
      </Card>
    </ScrollView>
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
    padding: 20,
    backgroundColor: '#2563eb',
  },
  welcome: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 5,
  },
  headerText: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  infoCard: {
    margin: 10,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 10,
  },
  subtext: {
    color: '#666',
    marginTop: 5,
  },
});
