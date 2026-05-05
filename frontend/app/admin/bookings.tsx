import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import CustomInput from '../../components/CustomInput';
import { CheckCircle, XCircle, ShoppingBag, MessageCircle } from 'lucide-react-native';

export default function ManageBookingsScreen() {
  const queryClient = useQueryClient();
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['all-bookings'],
    queryFn: async () => {
      const res = await bookingApi.getAllBookings();
      // Filter for Service Bookings (Inquiries have totalAmount 0 and no itemId)
      return res.data.filter((b: any) => !b.itemId && b.totalAmount === 0);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, adminNote }: { id: string; status: string; adminNote?: string }) =>
      bookingApi.updateStatus(id, status, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
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
        <Text style={styles.title}>Manage Bookings</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {bookings?.length === 0 ? (
          <EmptyState message="No bookings found" />
        ) : (
          bookings?.map((booking: any) => (
            <View key={booking._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MessageCircle size={20} color={COLORS.champagneGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemName}>
                      {booking.notes?.split('\n')[0]?.replace('Service: ', '') || 'General Inquiry'}
                    </Text>
                  </View>
                  <Text style={styles.customer}>{booking.userId?.name || 'Customer'}</Text>
                  <Text style={styles.date}>
                    Date: {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <StatusBadge status={booking.status} />
              </View>

              <View style={styles.divider} />

              {booking.notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesTitle}>Inquiry Details:</Text>
                  <Text style={styles.notesText}>{booking.notes}</Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                 <Text style={styles.total}>Rs. {booking.totalAmount}</Text>
              </View>

              {booking.status === 'Pending' && (
                <View style={styles.approvalSection}>
                  <Text style={styles.sectionLabel}>Approval Details</Text>
                  <CustomInput 
                    placeholder="Add a confirmation note for the client..." 
                    value={adminNotes[booking._id] || ''} 
                    onChangeText={(text) => setAdminNotes(prev => ({ ...prev, [booking._id]: text }))}
                    multiline
                    numberOfLines={2}
                  />
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => updateMutation.mutate({ 
                        id: booking._id, 
                        status: 'Approved', 
                        adminNote: adminNotes[booking._id] 
                      })}
                    >
                      <CheckCircle size={18} color={COLORS.white} />
                      <Text style={styles.approveText}>Approve Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => updateMutation.mutate({ 
                        id: booking._id, 
                        status: 'Rejected', 
                        adminNote: adminNotes[booking._id] 
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
                  <Text style={styles.notesTitle}>Admin Confirmation Note:</Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: COLORS.mutedRose + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.mutedRose + '30',
  },
  serviceTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.mutedRose,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepCharcoal,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  approveBtn: {
    flex: 1.5,
    backgroundColor: COLORS.successGreen,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: COLORS.errorRed + '12',
    borderWidth: 1,
    borderColor: COLORS.errorRed + '20',
  },
  approveText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
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
});
// Favo file
