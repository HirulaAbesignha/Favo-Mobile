import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import CustomInput from '../../components/CustomInput';
import { CheckCircle, XCircle, ShoppingBag } from 'lucide-react-native';

export default function ManageOrdersScreen() {
  const queryClient = useQueryClient();
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['all-orders'],
    queryFn: async () => {
      const res = await bookingApi.getAllBookings();
      // Filter for Item Orders (Any paid transaction is an order)
      return res.data.filter((b: any) => b.totalAmount > 0);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      bookingApi.updateStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update order');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Orders</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {bookings?.length === 0 ? (
          <EmptyState message="No orders found" />
        ) : (
          bookings?.map((booking: any) => (
            <View key={booking._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <ShoppingBag size={20} color={COLORS.champagneGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {booking.itemId?.itemName || 'Product'}
                  </Text>
                  <Text style={styles.customer}>{booking.userId?.name || 'Customer'}</Text>
                  <Text style={styles.date}>
                    Date: {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <StatusBadge status={booking.status} />
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                 <Text style={styles.total}>Rs. {booking.totalAmount}</Text>
                 {booking.itemId?.size && (
                   <Text style={styles.sizeText}>Size: {booking.itemId.size}</Text>
                 )}
              </View>

              {booking.status === 'Pending' && (
                <View style={styles.approvalSection}>
                  <Text style={styles.sectionLabel}>Order Processing</Text>
                  <CustomInput 
                    placeholder="Add a processing note..." 
                    value={adminNotes[booking._id] || ''} 
                    onChangeText={(text) => setAdminNotes(prev => ({ ...prev, [booking._id]: text }))}
                  />
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => updateMutation.mutate({ 
                        id: booking._id, 
                        status: 'Approved', 
                        note: adminNotes[booking._id] 
                      })}
                    >
                      <CheckCircle size={18} color={COLORS.white} />
                      <Text style={styles.approveText}>Approve Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => updateMutation.mutate({ 
                        id: booking._id, 
                        status: 'Rejected', 
                        note: adminNotes[booking._id] 
                      })}
                    >
                      <XCircle size={18} color={COLORS.errorRed} />
                      <Text style={styles.rejectText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {booking.adminNote && booking.status !== 'Pending' && (
                <View style={styles.adminNoteBox}>
                  <Text style={styles.notesTitle}>Admin Note:</Text>
                  <Text style={styles.notesText}>{booking.adminNote}</Text>
                </View>
              )}
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
  customer: {
    fontSize: 13,
    color: COLORS.mutedRose,
    marginTop: 1,
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
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.mutedRose,
  },
  sizeText: {
    fontSize: 13,
    color: COLORS.darkGrey,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepCharcoal,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  approvalSection: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  approveBtn: {
    flex: 2,
    backgroundColor: COLORS.successGreen,
    justifyContent: 'center',
  },
  approveText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: COLORS.errorRed + '12',
    justifyContent: 'center',
  },
  rejectText: {
    color: COLORS.errorRed,
    fontWeight: '700',
    fontSize: 14,
  },
  adminNoteBox: {
    backgroundColor: COLORS.successGreen + '08',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.successGreen,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.darkGrey,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.deepCharcoal,
    lineHeight: 18,
  },
});
