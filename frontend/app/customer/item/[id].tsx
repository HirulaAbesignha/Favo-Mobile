import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemApi } from '../../../api/itemApi';
import { bookingApi } from '../../../api/bookingApi';
import { COLORS } from '../../../constants/colors';
import CustomButton from '../../../components/CustomButton';
import StatusBadge from '../../../components/StatusBadge';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useCart } from '../../../context/CartContext';
import { Calendar, Ruler, Palette, ShieldCheck, Banknote } from 'lucide-react-native';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const res = await itemApi.getItemById(id as string);
      return res.data;
    },
  });

  const handleAddToCart = () => {
    if (item?.availabilityStatus !== 'Available') {
      Alert.alert('Unavailable', 'This item is currently not available.');
      return;
    }

    if (!selectedSize) {
      Alert.alert('Selection Required', 'Please select a size before adding to cart.');
      return;
    }
    
    addToCart({
      _id: item._id,
      itemName: item.itemName,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: selectedSize,
      color: item.color,
    });
    
    Alert.alert('Success', 'Added to cart!', [
      { text: 'View Cart', onPress: () => router.push('/customer/cart') },
      { text: 'Continue Shopping' }
    ]);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!item) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={
          item.image
            ? { uri: item.image }
            : { uri: 'https://via.placeholder.com/600x800/111111/C9A66B?text=FAVO' }
        }
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.category}>{item.category}</Text>
          <StatusBadge status={item.availabilityStatus} />
        </View>

        <Text style={styles.name}>{item.itemName}</Text>
        <Text style={styles.desc}>{item.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Palette size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoLabel}>Color</Text>
            <Text style={styles.infoValue}>{item.color}</Text>
          </View>
          <View style={styles.infoItem}>
            <ShieldCheck size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoLabel}>Total Stock</Text>
            <Text style={styles.infoValue}>{item.sizes?.reduce((acc: number, s: any) => acc + s.stock, 0) || 0}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Size</Text>
        <View style={styles.sizeRow}>
          {item.sizes?.map((s: any) => (
            <TouchableOpacity 
              key={s.size} 
              style={[
                styles.sizeChip, 
                selectedSize === s.size && styles.sizeChipActive,
                s.stock === 0 && styles.sizeChipDisabled
              ]}
              onPress={() => s.stock > 0 && setSelectedSize(s.size)}
              disabled={s.stock === 0}
            >
              <Text style={[
                styles.sizeText, 
                selectedSize === s.size && styles.sizeTextActive,
                s.stock === 0 && styles.sizeTextDisabled
              ]}>
                {s.size}
              </Text>
              {s.stock > 0 && s.stock < 5 && (
                <View style={styles.lowStockBadge}>
                  <Text style={styles.lowStockText}>{s.stock} left</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Banknote size={20} color={COLORS.mutedRose} />
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>Rs. {item.price?.toLocaleString()}</Text>
          </View>
        </View>

        <CustomButton
          title={item.availabilityStatus === 'Available' ? 'Add to Cart' : 'Sold Out'}
          onPress={handleAddToCart}
          disabled={item.availabilityStatus !== 'Available'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softIvory,
  },
  image: {
    width: '100%',
    height: 420,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: COLORS.champagneGold,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: COLORS.darkGrey,
    lineHeight: 22,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  infoItem: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: 90,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.darkGrey,
    marginTop: 6,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginTop: 2,
  },
  priceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGrey,
    marginVertical: 12,
  },
  priceLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.mutedRose,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  sizeChip: {
    minWidth: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey + '40',
    position: 'relative',
  },
  sizeChipActive: {
    backgroundColor: COLORS.champagneGold,
    borderColor: COLORS.champagneGold,
  },
  sizeChipDisabled: {
    backgroundColor: COLORS.softIvory,
    opacity: 0.5,
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.deepCharcoal,
  },
  sizeTextActive: {
    color: COLORS.white,
  },
  sizeTextDisabled: {
    color: COLORS.darkGrey,
    textDecorationLine: 'line-through',
  },
  lowStockBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.mutedRose,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  lowStockText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.white,
  },
});
// Favo file
