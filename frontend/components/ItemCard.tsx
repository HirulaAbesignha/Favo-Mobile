import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import StatusBadge from './StatusBadge';

interface Props {
  item: {
    _id: string;
    itemName: string;
    category: string;
    price: number;
    availabilityStatus: string;
    image?: string;
    size?: string;
    color?: string;
  };
  onPress: () => void;
}

export default function ItemCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
      <Image
        source={
          item.image
            ? { uri: item.image }
            : { uri: 'https://via.placeholder.com/300x400/111111/C9A66B?text=FAVO' }
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <StatusBadge status={item.availabilityStatus} />
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name}>{item.itemName}</Text>
        <Text style={styles.meta}>
          {item.size} · {item.color}
        </Text>
        <Text style={styles.price}>Rs. {(item.price || (item as any).rentalPrice || 0).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  info: {
    padding: 14,
  },
  category: {
    fontSize: 11,
    color: COLORS.champagneGold,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: COLORS.darkGrey,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.mutedRose,
  },
});
