import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import SignatureCanvas from 'react-native-signature-canvas';
import * as api from '../api';

interface SignatureScreenProps {
  route: any;
  navigation: any;
}

export default function SignatureScreen({ route, navigation }: SignatureScreenProps) {
  const { contratId } = route.params;
  const signatureRef = useRef<any>(null);
  const [signing, setSigning] = useState(false);

  const handleSignature = (signature: string) => {
    handleSaveSignature(signature);
  };

  const handleSaveSignature = async (signature: string) => {
    setSigning(true);
    try {
      await api.signerContrat(contratId, signature);
      Alert.alert(
        'Succès',
        'Contrat signé avec succès',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible de signer le contrat'
      );
    } finally {
      setSigning(false);
    }
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  if (signing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Signature en cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Signez dans le cadre ci-dessous</Text>
      </View>

      <View style={styles.signatureContainer}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleSignature}
          descriptionText="Signature"
          clearText="Effacer"
          confirmText="Confirmer"
          webStyle={`
            .m-signature-pad {
              box-shadow: none;
              border: 2px dashed #ccc;
              border-radius: 8px;
            }
            .m-signature-pad--body {
              border: none;
            }
            .m-signature-pad--footer {
              display: none;
            }
          `}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleClear}
          style={styles.button}
          icon="eraser"
        >
          Effacer
        </Button>
        <Button
          mode="contained"
          onPress={handleConfirm}
          style={styles.button}
          icon="check"
        >
          Signer
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  signatureContainer: {
    flex: 1,
    margin: 20,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
