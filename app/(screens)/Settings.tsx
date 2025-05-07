import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSecureData, logoutUser } from '../../storage/secureStore';

export default function Settings() {
  const router = useRouter();

  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

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

      setFullName(storedFullName || 'No Full Name Available');
      setEmail(storedEmail || 'No Email Available');
      setProfileImage(storedProfileImage || 'https://randomuser.me/api/portraits/men/44.jpg');
      setCoverImage(storedCoverImage || 'https://picsum.photos/seed/picsum/200/300');
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logoutUser();
          router.push('/(screens)/Login');
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/EditProfile');
  };

  type Routes = 
  | "/YourActivity"
  | "/PasswordSecurity"
  | "/ThemeSettings"
  | "/Notifications"
  | "/PrivacySettings"
  | "/LanguageSettings"
  | "/Help";

const settingsItems = [
  { label: 'Your Activity', icon: <MaterialIcons name="insert-chart" size={20} />, screen: '/YourActivity' as Routes },
  { label: 'Password and Security', icon: <Feather name="lock" size={20} />, screen: '/PasswordSecurity' as Routes },
  { label: 'Theme', icon: <Ionicons name="color-palette-outline" size={20} />, screen: '/ThemeSettings' as Routes },
  { label: 'Notifications', icon: <Ionicons name="notifications-outline" size={20} />, screen: '/Notifications' as Routes },
  { label: 'Privacy', icon: <FontAwesome5 name="user-shield" size={18} />, screen: '/PrivacySettings' as Routes },
  { label: 'Language', icon: <Entypo name="language" size={20} />, screen: '/LanguageSettings' as Routes },
  { label: 'Help', icon: <Feather name="help-circle" size={20} />, screen: '/Help' as Routes },
];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/Home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: coverImage || undefined }} style={styles.coverPhoto} />
        </View>

        <View style={styles.profileContainer}>
          <Image source={{ uri: profileImage || undefined }} style={styles.avatar} />
          <Text style={styles.name}>{fullName || 'Loading...'}</Text>
          <Text style={styles.email}>{email || 'Loading...'}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => router.push(item.screen)}>
              <View style={styles.iconLabel}>
                {item.icon}
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#555" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  header: {
    flexDirection: 'row',   
    alignItems: 'center',
    backgroundColor: '#0a3d62',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { color: '#fff', fontSize: 18, marginLeft: 10, fontWeight: 'bold' },

  scrollContainer: {
    paddingBottom: 30,
  },
  coverContainer: {
    width: '100%',
    height: 120,
  },
  coverPhoto: {
    width: '100%',
    height: 120,
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
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  editButton: {
    marginTop: 6,
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },

  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  logoutText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
