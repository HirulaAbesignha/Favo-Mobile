import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}: Props) {
  const btnStyle =
    variant === 'primary'
      ? styles.primary
      : variant === 'secondary'
      ? styles.secondary
      : variant === 'danger'
      ? styles.danger
      : styles.outline;

  const textStyle =
    variant === 'outline' ? styles.outlineText : styles.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.base, btnStyle, (disabled || loading) && styles.disabled]}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.champagneGold : COLORS.white} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.champagneGold,
  },
  secondary: {
    backgroundColor: COLORS.deepCharcoal,
  },
  danger: {
    backgroundColor: COLORS.errorRed,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.champagneGold,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  outlineText: {
    color: COLORS.champagneGold,
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
});
