import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: '',
    date_naissance: '',
    adresse: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!formData.nom_complet || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Erreur d\'inscription');
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez Omnivyn Intérim</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Nom complet *"
            value={formData.nom_complet}
            onChangeText={(text) => updateField('nom_complet', text)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Téléphone *"
            value={formData.telephone}
            onChangeText={(text) => updateField('telephone', text)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Date de naissance (AAAA-MM-JJ) *"
            value={formData.date_naissance}
            onChangeText={(text) => updateField('date_naissance', text)}
            mode="outlined"
            placeholder="1990-01-01"
            style={styles.input}
          />

          <TextInput
            label="Adresse *"
            value={formData.adresse}
            onChangeText={(text) => updateField('adresse', text)}
            mode="outlined"
            multiline
            numberOfLines={2}
            style={styles.input}
          />

          <TextInput
            label="Mot de passe *"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="Confirmer le mot de passe *"
            value={formData.password_confirmation}
            onChangeText={(text) => updateField('password_confirmation', text)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            S'inscrire
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.loginButton}
          >
            Déjà un compte ? Se connecter
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  loginButton: {
    marginTop: 15,
  },
});
