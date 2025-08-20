import { router } from 'expo-router';
import { signInAnonymously } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../src/config/firebase-config';

export default function HomeScreen() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Anonymous authentication
    const authenticateUser = async () => {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
          console.log('User authenticated anonymously');
        }
        loadCharacters();
      } catch (error) {
        console.error('Auth error:', error);
        Alert.alert('Error', 'Failed to authenticate user');
      }
    };

    authenticateUser();
  }, []);

  const loadCharacters = () => {
    if (!auth.currentUser) {
      console.log('No authenticated user');
      return;
    }

    console.log('Loading characters for user:', auth.currentUser.uid);

    const q = query(
      collection(db, 'characters'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const charactersData = [];
      querySnapshot.forEach((doc) => {
        charactersData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log('Characters loaded:', charactersData.length);
      setCharacters(charactersData);
      setLoading(false);
    });

    return unsubscribe;
  };

  const onCreateCharacter = () => {
    router.push('/create');
  };

  const onCharacterPress = (characterId) => {
    router.push(`/character/${characterId}`);
  };

  const renderCharacterCard = ({ item }) => (
    <TouchableOpacity
      style={styles.characterCard}
      onPress={() => onCharacterPress(item.id)}
    >
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>?</Text>
      </View>
      
      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{item.name || 'Unnamed Character'}</Text>
        <Text style={styles.characterDetails}>
          {item.race} {item.class} • Level {item.level || 1}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>D&D Characters</Text>
      
      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading characters...</Text>
        </View>
      ) : characters.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No characters yet</Text>
          <Text style={styles.emptySubtext}>Create your first character!</Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacterCard}
          keyExtractor={(item) => item.id}
          style={styles.characterList}
        />
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={onCreateCharacter}
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#cccccc',
  },
  emptyText: {
    fontSize: 18,
    color: '#cccccc',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888888',
  },
  characterList: {
    flex: 1,
  },
  characterCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666666',
    borderStyle: 'dashed',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    color: '#888888',
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  characterDetails: {
    fontSize: 14,
    color: '#cccccc',
  },
  createButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a9eff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});