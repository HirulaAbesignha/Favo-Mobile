import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Calendar, ShoppingBag, XCircle } from 'lucide-react-native';

export default function MyBookingsScreen() {
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await bookingApi.getMyBookings();
      return res.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      Alert.alert('Success', 'Booking cancelled successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          setCancellingId(id);
          cancelMutation.mutate(id, { onSettled: () => setCancellingId(null) });
        },
      },
    ]);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {bookings?.length === 0 ? (
          <EmptyState message="You have no bookings yet" />
        ) : (
          bookings?.map((booking: any) => (
            <View key={booking._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <ShoppingBag size={20} color={COLORS.champagneGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{booking.itemId?.itemName || 'Item'}</Text>
                  <Text style={styles.date}>
                    {new Date(booking.rentalStartDate).toLocaleDateString()} —{' '}
                    {new Date(booking.rentalEndDate).toLocaleDateString()}
                  </Text>
                </View>
                <StatusBadge status={booking.status} />
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={styles.total}>Total: ${booking.totalAmount}</Text>
                {booking.status === 'Pending' && (
                  <TouchableOpacity
                    onPress={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id}
                    style={styles.cancelBtn}
                  >
                    <XCircle size={16} color={COLORS.errorRed} />
                    <Text style={styles.cancelText}>
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softIvory,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.champagneGold + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  date: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGrey,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: COLORS.mutedRose,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelText: {
    fontSize: 13,
    color: COLORS.errorRed,
    fontWeight: '600' as const,
  },
});
// Favo file
