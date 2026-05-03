import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemApi } from '../../../api/itemApi';
import { bookingApi } from '../../../api/bookingApi';
import { COLORS } from '../../../constants/colors';
import CustomButton from '../../../components/CustomButton';
import StatusBadge from '../../../components/StatusBadge';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Calendar, Ruler, Palette, ShieldCheck, DollarSign } from 'lucide-react-native';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [bookingLoading, setBookingLoading] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const res = await itemApi.getItemById(id as string);
      return res.data;
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: () =>
      bookingApi.createBooking({
        itemId: id as string,
        rentalStartDate: new Date().toISOString(),
        rentalEndDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        totalAmount: item?.rentalPrice * 3 + item?.depositAmount || 0,
        notes: 'Booked from mobile app',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      Alert.alert('Success', 'Booking request submitted!', [
        { text: 'OK', onPress: () => router.push('/customer/bookings') },
      ]);
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create booking');
    },
  });

  const handleBook = () => {
    if (item?.availabilityStatus !== 'Available') {
      Alert.alert('Unavailable', 'This item is currently not available for booking.');
      return;
    }
    setBookingLoading(true);
    createBookingMutation.mutate();
    setBookingLoading(false);
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
            <Ruler size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoLabel}>Size</Text>
            <Text style={styles.infoValue}>{item.size}</Text>
          </View>
          <View style={styles.infoItem}>
            <Palette size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoLabel}>Color</Text>
            <Text style={styles.infoValue}>{item.color}</Text>
          </View>
          <View style={styles.infoItem}>
            <ShieldCheck size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoLabel}>Stock</Text>
            <Text style={styles.infoValue}>{item.stockQuantity}</Text>
          </View>
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <DollarSign size={18} color={COLORS.mutedRose} />
            <Text style={styles.priceLabel}>Rental Price</Text>
            <Text style={styles.priceValue}>${item.rentalPrice} / day</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <DollarSign size={18} color={COLORS.mutedRose} />
            <Text style={styles.priceLabel}>Deposit</Text>
            <Text style={styles.priceValue}>${item.depositAmount}</Text>
          </View>
        </View>

        <CustomButton
          title={item.availabilityStatus === 'Available' ? 'Book Now' : 'Not Available'}
          onPress={handleBook}
          disabled={item.availabilityStatus !== 'Available'}
          loading={bookingLoading}
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
});
// Favo file
