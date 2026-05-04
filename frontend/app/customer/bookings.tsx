import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Calendar, ShoppingBag, XCircle, CreditCard, CheckCircle2 } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { paymentApi } from '../../api/paymentApi';
import { Modal } from 'react-native';

export default function MyOrdersScreen() {
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('Card');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await bookingApi.getMyBookings();
      // Filter for Product type items
      return res.data.filter((b: any) => b.itemId?.itemType !== 'Service');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      Alert.alert('Success', 'Order cancelled successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (data: any) => paymentApi.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
      setShowPaymentModal(false);
      Alert.alert('Success', 'Payment processed successfully (Mock)');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Payment failed');
    },
  });

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
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

  const handlePay = (booking: any) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!selectedBooking) return;
    paymentMutation.mutate({
      bookingId: selectedBooking._id,
      amount: selectedBooking.totalAmount,
      paymentMethod,
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {bookings?.length === 0 ? (
          <EmptyState message="You have no orders yet" />
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
                    Order Date: {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                {booking.status !== 'Pending' && (
                  <StatusBadge status={booking.status === 'Approved' ? 'Confirmed' : booking.status} />
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={styles.total}>Total: Rs. {booking.totalAmount}</Text>
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
                {booking.status === 'Approved' && (
                  <TouchableOpacity
                    onPress={() => handlePay(booking)}
                    style={styles.payBtn}
                  >
                    <CreditCard size={16} color={COLORS.successGreen} />
                    <Text style={styles.payText}>Pay Now</Text>
                  </TouchableOpacity>
                )}
                {booking.status === 'Completed' && (
                  <View style={styles.completedBadge}>
                    <CheckCircle2 size={14} color={COLORS.successGreen} />
                    <Text style={styles.completedText}>Paid & Completed</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showPaymentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Payment</Text>
            <Text style={styles.modalSubtitle}>
              Item: {selectedBooking?.itemId?.itemName}
            </Text>
            <Text style={styles.modalAmount}>Total: Rs. {selectedBooking?.totalAmount}</Text>

            <Text style={styles.label}>Select Payment Method</Text>
            <View style={styles.methodRow}>
              {['Card', 'Bank Transfer', 'Cash'].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.methodBtn,
                    paymentMethod === m && styles.activeMethodBtn,
                  ]}
                  onPress={() => setPaymentMethod(m)}
                >
                  <Text
                    style={[
                      styles.methodText,
                      paymentMethod === m && styles.activeMethodText,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {paymentMethod === 'Card' && (
              <View style={styles.cardStub}>
                <CustomInput label="Card Number" placeholder="**** **** **** 4242" value="**** **** **** 4242" editable={false} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <CustomInput label="Expiry" placeholder="12/28" value="12/28" editable={false} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CustomInput label="CVV" placeholder="***" value="***" secureTextEntry editable={false} />
                  </View>
                </View>
              </View>
            )}

            <CustomButton
              title="Confirm Payment"
              onPress={processPayment}
              loading={paymentMutation.isPending}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successGreen + '12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  payText: {
    fontSize: 13,
    color: COLORS.successGreen,
    fontWeight: '700' as const,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: COLORS.successGreen,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginBottom: 8,
  },
  modalAmount: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.mutedRose,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 10,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  methodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    alignItems: 'center',
  },
  activeMethodBtn: {
    borderColor: COLORS.champagneGold,
    backgroundColor: COLORS.champagneGold + '10',
  },
  methodText: {
    fontSize: 13,
    color: COLORS.darkGrey,
    fontWeight: '600' as const,
  },
  activeMethodText: {
    color: COLORS.champagneGold,
  },
  cardStub: {
    marginBottom: 20,
  },
  closeBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.darkGrey,
    fontSize: 14,
  },
});
// Favo file
