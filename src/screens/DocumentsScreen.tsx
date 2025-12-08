import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, Linking, Platform } from 'react-native';
import { Card, Title, Text, ActivityIndicator, FAB, Button, Chip, Portal, Modal, TextInput as PaperInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import * as api from '../api';

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [documentType, setDocumentType] = useState('cv');
  const [documentName, setDocumentName] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await api.getMesDocuments();
      setDocuments(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
      Alert.alert('Erreur', 'Impossible de charger les documents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        copyTo: 'cachesDirectory',
      });

      setSelectedFile(result[0]);
      setDocumentName(result[0].name || '');
      setModalVisible(true);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Sélection annulée');
      } else {
        console.error('Erreur sélection document:', err);
        Alert.alert('Erreur', 'Impossible de sélectionner le fichier');
      }
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !documentName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('type', documentType);
      formData.append('nom', documentName);
      formData.append('fichier', {
        uri: Platform.OS === 'ios' ? selectedFile.uri.replace('file://', '') : selectedFile.uri,
        type: selectedFile.type || 'application/pdf',
        name: selectedFile.name || 'document.pdf',
      } as any);

      await api.uploadDocument(formData);
      
      Alert.alert('Succès', 'Document uploadé avec succès');
      setModalVisible(false);
      setSelectedFile(null);
      setDocumentName('');
      loadDocuments();
    } catch (error: any) {
      console.error('Erreur upload:', error);
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible d\'uploader le document'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleOpenDocument = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Erreur', 'Impossible d\'ouvrir le document');
      });
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'cv':
        return 'file-document';
      case 'piece_identite':
        return 'card-account-details';
      case 'diplome':
        return 'school';
      case 'certification':
        return 'certificate';
      default:
        return 'file';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'cv':
        return 'CV';
      case 'piece_identite':
        return 'Pièce d\'identité';
      case 'diplome':
        return 'Diplôme';
      case 'certification':
        return 'Certification';
      default:
        return 'Autre';
    }
  };

  const renderDocument = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Icon name={getDocumentIcon(item.type)} size={32} color="#2563eb" />
          </View>
          <View style={styles.contentContainer}>
            <Title style={styles.title}>{item.nom}</Title>
            <Chip style={styles.typeChip}>{getDocumentTypeLabel(item.type)}</Chip>
            <Text style={styles.date}>
              Ajouté le {new Date(item.created_at).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        <Button
          mode="outlined"
          onPress={() => handleOpenDocument(item.url)}
          icon="eye"
          style={styles.viewButton}
        >
          Voir le document
        </Button>
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
          {documents.length} document{documents.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucun document</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez vos documents pour compléter votre profil
            </Text>
          </View>
        }
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Ajouter un document</Title>

          {selectedFile && (
            <View style={styles.fileInfo}>
              <Icon name="file" size={24} color="#2563eb" />
              <Text style={styles.fileName}>{selectedFile.name}</Text>
            </View>
          )}

          <PaperInput
            label="Nom du document"
            value={documentName}
            onChangeText={setDocumentName}
            mode="outlined"
            style={styles.input}
          />

          <Text style={styles.label}>Type de document</Text>
          <View style={styles.typeButtons}>
            {[
              { value: 'cv', label: 'CV' },
              { value: 'piece_identite', label: 'Pièce d\'identité' },
              { value: 'diplome', label: 'Diplôme' },
              { value: 'certification', label: 'Certification' },
              { value: 'autre', label: 'Autre' },
            ].map((type) => (
              <Chip
                key={type.value}
                selected={documentType === type.value}
                onPress={() => setDocumentType(type.value)}
                style={styles.typeChip}
              >
                {type.label}
              </Chip>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleUploadDocument}
              loading={uploading}
              disabled={uploading || !selectedFile || !documentName}
            >
              Uploader
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handlePickDocument}
        label="Ajouter"
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
    marginBottom: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
    height: 28,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  viewButton: {
    marginTop: 10,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2563eb',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    marginBottom: 15,
  },
  fileName: {
    marginLeft: 10,
    flex: 1,
    color: '#2563eb',
    fontWeight: '600',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
