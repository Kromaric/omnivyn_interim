import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, ActivityIndicator, Chip } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

export default function EditProfileScreen({ navigation }: any) {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nom_complet: '',
    telephone: '',
    adresse: '',
    taux_horaire_souhaite: '',
    disponibilite: 'disponible',
    competences: [] as string[],
  });
  const [newCompetence, setNewCompetence] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.getProfile();
      const profile = response.data.interimaire;
      setFormData({
        nom_complet: profile.nom_complet || '',
        telephone: profile.telephone || '',
        adresse: profile.adresse || '',
        taux_horaire_souhaite: profile.taux_horaire_souhaite?.toString() || '',
        disponibilite: profile.disponibilite || 'disponible',
        competences: profile.competences || [],
      });
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      Alert.alert('Erreur', 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nom_complet || !formData.telephone) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        taux_horaire_souhaite: formData.taux_horaire_souhaite ? parseFloat(formData.taux_horaire_souhaite) : null,
      };

      await api.updateProfile(dataToSend);
      await updateUserData({ nom_complet: formData.nom_complet });

      Alert.alert('Succès', 'Profil mis à jour avec succès', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', error);
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible de mettre à jour le profil'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompetence = () => {
    if (newCompetence.trim()) {
      setFormData({
        ...formData,
        competences: [...formData.competences, newCompetence.trim()],
      });
      setNewCompetence('');
    }
  };

  const handleRemoveCompetence = (index: number) => {
    setFormData({
      ...formData,
      competences: formData.competences.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Nom complet *"
          value={formData.nom_complet}
          onChangeText={(text) => setFormData({ ...formData, nom_complet: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Téléphone *"
          value={formData.telephone}
          onChangeText={(text) => setFormData({ ...formData, telephone: text })}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Adresse"
          value={formData.adresse}
          onChangeText={(text) => setFormData({ ...formData, adresse: text })}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
        />

        <TextInput
          label="Taux horaire souhaité (€/h)"
          value={formData.taux_horaire_souhaite}
          onChangeText={(text) => setFormData({ ...formData, taux_horaire_souhaite: text })}
          mode="outlined"
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <TextInput
          label="Disponibilité"
          value={formData.disponibilite}
          mode="outlined"
          editable={false}
          style={styles.input}
        />

        <View style={styles.section}>
          <TextInput
            label="Ajouter une compétence"
            value={newCompetence}
            onChangeText={setNewCompetence}
            mode="outlined"
            right={
              <TextInput.Icon
                icon="plus"
                onPress={handleAddCompetence}
                disabled={!newCompetence.trim()}
              />
            }
            style={styles.input}
          />

          <View style={styles.competencesContainer}>
            {formData.competences.map((comp, index) => (
              <Chip
                key={index}
                onClose={() => handleRemoveCompetence(index)}
                style={styles.chip}
              >
                {comp}
              </Chip>
            ))}
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
          icon="content-save"
        >
          Enregistrer
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
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  section: {
    marginTop: 10,
  },
  competencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});
