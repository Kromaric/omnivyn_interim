import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Text, Button, ActivityIndicator, Chip, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as api from '../api';

export default function MissionDetailScreen({ route, navigation }: any) {
  const { missionId } = route.params;
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [postulating, setPostulating] = useState(false);

  useEffect(() => {
    loadMissionDetails();
  }, []);

  const loadMissionDetails = async () => {
    try {
      const response = await api.getMissionDetails(missionId);
      setMission(response.data);
    } catch (error) {
      console.error('Erreur chargement mission:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de la mission');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePostuler = async () => {
    Alert.alert(
      'Confirmer',
      'Êtes-vous sûr de vouloir postuler à cette mission ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Postuler',
          onPress: async () => {
            try {
              setPostulating(true);
              await api.postulerMission(missionId);
              Alert.alert(
                'Succès',
                'Votre candidature a été envoyée avec succès !',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('MyMissions'),
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert(
                'Erreur',
                error.response?.data?.message || 'Impossible de postuler à cette mission'
              );
            } finally {
              setPostulating(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!mission) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>{mission.titre}</Title>
          <Text style={styles.company}>{mission.entreprise?.nom}</Text>
          
          <View style={styles.salaryBadge}>
            <Text style={styles.salaryText}>{mission.taux_horaire}€/h</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#2563eb" />
            <Text style={styles.infoLabel}>Lieu :</Text>
            <Text style={styles.infoValue}>{mission.lieu}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar-start" size={20} color="#2563eb" />
            <Text style={styles.infoLabel}>Début :</Text>
            <Text style={styles.infoValue}>
              {new Date(mission.date_debut).toLocaleDateString('fr-FR')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar-end" size={20} color="#2563eb" />
            <Text style={styles.infoLabel}>Fin :</Text>
            <Text style={styles.infoValue}>
              {new Date(mission.date_fin).toLocaleDateString('fr-FR')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="file-document" size={20} color="#2563eb" />
            <Text style={styles.infoLabel}>Type :</Text>
            <Text style={styles.infoValue}>{mission.type_contrat || 'CDD'}</Text>
          </View>
        </Card.Content>
      </Card>

      {mission.competences_requises && mission.competences_requises.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Compétences requises</Title>
            <View style={styles.competencesContainer}>
              {mission.competences_requises.map((comp: string, index: number) => (
                <Chip key={index} style={styles.chip}>
                  {comp}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Description</Title>
          <Paragraph style={styles.description}>{mission.description}</Paragraph>
        </Card.Content>
      </Card>

      {mission.entreprise && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>À propos de l'entreprise</Title>
            <Paragraph style={styles.companyInfo}>
              <Text style={styles.bold}>Nom : </Text>{mission.entreprise.nom}
            </Paragraph>
            {mission.entreprise.secteur && (
              <Paragraph style={styles.companyInfo}>
                <Text style={styles.bold}>Secteur : </Text>{mission.entreprise.secteur}
              </Paragraph>
            )}
            {mission.entreprise.ville && (
              <Paragraph style={styles.companyInfo}>
                <Text style={styles.bold}>Ville : </Text>{mission.entreprise.ville}
              </Paragraph>
            )}
          </Card.Content>
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handlePostuler}
          loading={postulating}
          disabled={postulating || mission.interimaire_id}
          style={styles.button}
          icon="send"
        >
          {mission.interimaire_id ? 'Mission déjà assignée' : 'Postuler à cette mission'}
        </Button>
      </View>
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
  headerCard: {
    margin: 10,
    backgroundColor: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  company: {
    fontSize: 16,
    color: '#e0e7ff',
    marginBottom: 10,
  },
  salaryBadge: {
    backgroundColor: '#10b981',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  salaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    margin: 10,
    marginTop: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 60,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  competencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
  },
  companyInfo: {
    marginBottom: 5,
    fontSize: 14,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  button: {
    paddingVertical: 8,
  },
});
