import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, List, Avatar, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProfile = async () => {
    try {
      const response = await api.getProfile();
      setProfile(response.data.interimaire);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getInitials = (nom: string) => {
    const names = nom.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={getInitials(user?.nom || user?.nom_complet || 'U')}
            style={styles.avatar}
          />
          <Title style={styles.name}>{profile?.nom_complet || user?.nom}</Title>
          <Text style={styles.email}>{user?.email}</Text>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
            icon="pencil"
          >
            Modifier mon profil
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Informations personnelles</Title>
          
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#666" />
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{profile?.telephone || 'Non renseigné'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#666" />
            <Text style={styles.infoLabel}>Adresse</Text>
            <Text style={styles.infoValue}>{profile?.adresse || 'Non renseignée'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="cake-variant" size={20} color="#666" />
            <Text style={styles.infoLabel}>Date de naissance</Text>
            <Text style={styles.infoValue}>
              {profile?.date_naissance 
                ? new Date(profile.date_naissance).toLocaleDateString('fr-FR')
                : 'Non renseignée'
              }
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="briefcase" size={20} color="#666" />
            <Text style={styles.infoLabel}>Expérience</Text>
            <Text style={styles.infoValue}>
              {profile?.experience_annees || 0} an{(profile?.experience_annees || 0) > 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="check-circle" size={20} color="#666" />
            <Text style={styles.infoLabel}>Statut</Text>
            <Text style={[styles.infoValue, { color: profile?.statut === 'disponible' ? '#10b981' : '#f59e0b' }]}>
              {profile?.statut || 'Non défini'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {profile?.competences && profile.competences.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Compétences</Title>
            <View style={styles.competencesContainer}>
              {profile.competences.map((comp: string, index: number) => (
                <View key={index} style={styles.competenceItem}>
                  <Icon name="check" size={16} color="#10b981" />
                  <Text style={styles.competenceText}>{comp}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <List.Section>
          <List.Subheader>Actions</List.Subheader>
          
          <List.Item
            title="Mes documents"
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Documents')}
          />

          <Divider />

          <List.Item
            title="Paramètres"
            left={props => <List.Icon {...props} icon="cog" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
          />

          <Divider />

          <List.Item
            title="Aide et support"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Info', 'Contactez support@omnivyn.fr')}
          />
        </List.Section>
      </Card>

      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          icon="logout"
          textColor="#ef4444"
          style={styles.logoutButton}
        >
          Déconnexion
        </Button>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 10,
    backgroundColor: '#2563eb',
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#1e40af',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#e0e7ff',
    marginBottom: 15,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  card: {
    margin: 10,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    width: 120,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  competencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  competenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  competenceText: {
    marginLeft: 5,
    color: '#10b981',
    fontWeight: '600',
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    borderColor: '#ef4444',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 30,
  },
});
