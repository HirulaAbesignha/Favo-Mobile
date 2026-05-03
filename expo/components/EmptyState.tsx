import { View, Text, StyleSheet } from 'react-native';
import { PackageOpen } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

interface Props {
  message?: string;
}

export default function EmptyState({ message = 'No items found' }: Props) {
  return (
    <View style={styles.container}>
      <PackageOpen size={48} color={COLORS.champagneGold} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.darkGrey,
    textAlign: 'center',
  },
});
