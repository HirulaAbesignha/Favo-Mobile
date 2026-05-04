import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';
import { COLORS } from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!validateEmail(email)) e.email = 'Please enter a valid email';
    if (!validatePassword(password)) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/customer/home');
      }
    } catch (err: any) {
      setApiError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your fashion journey</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          <CustomInput
            label="Password"
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

          <CustomButton title="Sign In" onPress={handleLogin} loading={loading} />

          <Text style={styles.switchText}>
            Don&apos;t have an account?{' '}
            <Text style={styles.switchLink} onPress={() => router.push('/auth/register')}>
              Register
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.softIvory,
    justifyContent: 'center',
    padding: 28,
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginTop: 8,
  },
  form: {
    gap: 4,
  },
  apiError: {
    color: COLORS.errorRed,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  switchText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  switchLink: {
    color: COLORS.champagneGold,
    fontWeight: '700' as const,
  },
});
// Favo file
