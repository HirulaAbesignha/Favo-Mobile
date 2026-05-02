import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../theme/theme';

const ProfileScreen = () => {
  const { logout, userInfo } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{userInfo?.name || 'User'}</Text>
        <Text style={styles.email}>{userInfo?.email || 'email@example.com'}</Text>
      </View>
      
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  header: {
    backgroundColor: theme.colors.cream,
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.sand,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.camel,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: theme.colors.cream,
    fontSize: 32,
    fontFamily: theme.fonts.serif,
  },
  name: {
    fontSize: 22,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    letterSpacing: 1,
  },
  email: {
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mauve,
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    padding: 20,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.ink,
    padding: 16,
    borderRadius: 30, // pill shape
    alignItems: 'center',
  },
  logoutText: {
    color: theme.colors.ink,
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;
