import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../src/config/firebase-config';

export default function CharacterSheetScreen() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        console.log('Fetching character with ID:', id);
        const charDoc = await getDoc(doc(db, 'characters', id));
        
        if (charDoc.exists()) {
          setCharacter({ id: charDoc.id, ...charDoc.data() });
          console.log('Character loaded:', charDoc.data().name);
        } else {
          console.log('Character not found');
          Alert.alert('Error', 'Character not found');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching character:', error);
        Alert.alert('Error', 'Failed to load character');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCharacter();
    }
  }, [id]);

  const goBack = () => {
    router.back();
  };

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    Alert.alert('D20 Roll', `You rolled: ${roll}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading character...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Character not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{character.name}</Text>
      <Text style={styles.subtitle}>
        {character.race} {character.class} • Level {character.level || 1}
      </Text>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Character ID:</Text>
        <Text style={styles.characterId}>{id}</Text>
        
        <TouchableOpacity style={styles.diceButton} onPress={rollDice}>
          <Text style={styles.diceButtonText}>🎲 Roll D20</Text>
        </TouchableOpacity>
        
        <Text style={styles.placeholder}>
          Character sheet details coming soon...
        </Text>
      </View>
      
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Back to Characters</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  characterId: {
    fontSize: 14,
    color: '#cccccc',
    fontFamily: 'monospace',
    marginBottom: 30,
  },
  diceButton: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  diceButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: '#404040',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 100,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
});