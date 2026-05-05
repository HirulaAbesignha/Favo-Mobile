import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Calendar, ChevronLeft, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function MyBookingsScreen() {
  const router = useRouter();
  const { data: bookings, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await bookingApi.getMyBookings();
      // Filter for Service type items OR items without an ID (general inquiries)
      return res.data.filter((b: any) => !b.itemId || b.itemId?.itemType === 'Service');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const renderBooking = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.dateBox}>
          <Calendar size={16} color={COLORS.champagneGold} />
          <Text style={styles.dateText}>
            {new Date(item.rentalStartDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <Text style={styles.serviceName}>
        {item.itemId?.itemName || 
         item.notes?.split('\n')[0]?.replace('Service: ', '') || 
         'Service Inquiry'}
      </Text>
      <Text style={styles.category}>
        {item.itemId?.category || 'Custom Service'}
      </Text>

      {item.adminNote && (
        <View style={styles.adminNoteBox}>
          <Text style={styles.adminNoteLabel}>Admin Note:</Text>
          <Text style={styles.adminNoteText}>{item.adminNote}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.location}>
          <MapPin size={14} color={COLORS.darkGrey} />
          <Text style={styles.locationText}>Favo Studio, Colombo</Text>
        </View>
        <Text style={styles.price}>Rs. {item.totalAmount?.toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.deepCharcoal} />
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={renderBooking}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <EmptyState message="No service bookings found" />
        }
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  backBtn: {
    padding: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.softIvory,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.deepCharcoal,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: COLORS.darkGrey,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.softIvory,
    paddingTop: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.darkGrey,
  },
  price: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.mutedRose,
  },
  adminNoteBox: {
    backgroundColor: COLORS.champagneGold + '10',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.champagneGold,
  },
  adminNoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.champagneGold,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  adminNoteText: {
    fontSize: 13,
    color: COLORS.deepCharcoal,
    fontStyle: 'italic',
  },
});
