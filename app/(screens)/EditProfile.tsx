import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getSecureData, saveSecureData } from '../../storage/secureStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfile() {
  const router = useRouter();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [profileUpdated, setProfileUpdated] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUsername = await getSecureData('username');
      if (!loggedInUsername) {
        router.push('/(screens)/Login');
        return;
      }

      setUsername(loggedInUsername);

      const storedFullName = await getSecureData(`${loggedInUsername}_fullName`);
      const storedEmail = await getSecureData(`${loggedInUsername}_email`);
      const storedProfileImage = await getSecureData(`${loggedInUsername}_profileImage`);
      const storedCoverImage = await getSecureData(`${loggedInUsername}_coverImage`);

      setFullName(storedFullName || '');
      setEmail(storedEmail || '');
      setProfileImage(storedProfileImage || 'https://randomuser.me/api/portraits/men/44.jpg');
      setCoverImage(storedCoverImage || 'https://picsum.photos/seed/picsum/200/300');
    };

    fetchUserData();
  }, [router]);

  const pickImage = async (isProfile: boolean) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      if (isProfile) {
        setProfileImage(uri);
        await saveSecureData(`${username}_profileImage`, uri);
      } else {
        setCoverImage(uri);
        await saveSecureData(`${username}_coverImage`, uri);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (fullName.trim() === '' || email.trim() === '') {
      Alert.alert('Error', 'Full Name and Email are required!');
      return;
    }

    await saveSecureData(`${username}_fullName`, fullName);
    await saveSecureData(`${username}_email`, email);

    setProfileUpdated(true);

    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.push('/(screens)/Settings') },
    ]);
  };

  const handleBack = () => {
    if (profileUpdated) {
      Alert.alert('Changes Saved', 'Your profile changes have been saved.', [
        { text: 'OK', onPress: () => router.push('/(screens)/Settings') },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.coverContainer}>
          <Image source={{ uri: coverImage || undefined }} style={styles.coverPhoto} />
          <TouchableOpacity style={styles.changeCoverButton} onPress={() => pickImage(false)}>
            <Text style={styles.buttonText}>Change Cover Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <Image source={{ uri: profileImage || undefined }} style={styles.avatar} />
          <TouchableOpacity style={styles.changeProfileButton} onPress={() => pickImage(true)}>
            <Text style={styles.buttonText}>Change Profile Photo</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a3d62',
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'absolute',  
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  coverContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
    position: 'relative',
    marginTop: 50,  
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  changeCoverButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -45,
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 8,
  },
  changeProfileButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
