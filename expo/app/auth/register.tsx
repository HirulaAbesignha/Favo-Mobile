import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, validatePhone, validateRequired } from '../../utils/validators';
import { COLORS } from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!validateRequired(name)) e.name = 'Name is required';
    if (!validateEmail(email)) e.email = 'Please enter a valid email';
    if (!validatePassword(password)) e.password = 'Password must be at least 6 characters';
    if (!validatePhone(phone)) e.phone = 'Please enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const user = await register({ name, email, password, phone });
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/customer/home');
      }
    } catch (err: any) {
      setApiError(err?.response?.data?.message || 'Registration failed. Please try again.');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Favo and rent premium fashion</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          <CustomInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          <CustomInput
            label="Phone"
            placeholder="+1 234 567 890"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
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

          <CustomButton title="Create Account" onPress={handleRegister} loading={loading} />

          <Text style={styles.switchText}>
            Already have an account?{' '}
            <Text style={styles.switchLink} onPress={() => router.push('/auth/login')}>
              Sign In
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
