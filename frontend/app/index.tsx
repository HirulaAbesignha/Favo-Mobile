import { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

export default function SplashScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      if (user) {
        if (user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/customer/home');
        }
      } else {
        router.replace('/auth/login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [loading, user, router]);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>F</Text>
        </View>
        <Text style={styles.brand}>FAVO</Text>
        <Text style={styles.tagline}>Rent Fashion. Own The Moment.</Text>
        <View style={styles.line} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17,17,17,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.champagneGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: COLORS.white,
  },
  brand: {
    fontSize: 42,
    fontWeight: '300' as const,
    color: COLORS.white,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.warmBeige,
    marginTop: 12,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  line: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.champagneGold,
    marginTop: 24,
    borderRadius: 1,
  },
});
// Favo file
