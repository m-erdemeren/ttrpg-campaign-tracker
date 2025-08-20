import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateCharacterScreen() {
  const goBack = () => {
    router.back();
  };

  const createTestCharacter = async () => {
    try {
      const { auth, db } = await import('../src/config/firebase-config');
      const { collection, addDoc } = await import('firebase/firestore');
      
      if (!auth.currentUser) {
        console.log('No authenticated user');
        return;
      }

      const testCharacter = {
        userId: auth.currentUser.uid,
        name: 'Test Character',
        race: 'Human',
        class: 'Fighter',
        level: 1,
        createdAt: new Date()
      };

      console.log('Creating test character...');
      const docRef = await addDoc(collection(db, 'characters'), testCharacter);
      console.log('Character created with ID:', docRef.id);
      
      // Character sheet'e git
      router.push(`/character/${docRef.id}`);
      
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Character</Text>
      <Text style={styles.subtitle}>Character creation wizard coming soon...</Text>
      
      <TouchableOpacity style={styles.button} onPress={createTestCharacter}>
        <Text style={styles.buttonText}>Create Test Character</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#404040',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});