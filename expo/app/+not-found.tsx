import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function FavoNotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Lost in Style?</Text>
        <Text style={styles.subtitle}>This page does not exist in Favo.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.softIvory,
  },
  code: {
    fontSize: 64,
    fontWeight: '200',
    color: COLORS.champagneGold,
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.deepCharcoal,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginTop: 8,
  },
  link: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: COLORS.champagneGold,
    borderRadius: 14,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
  },
});
