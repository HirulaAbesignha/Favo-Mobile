import { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../../api/paymentApi';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { CreditCard, CheckCircle } from 'lucide-react-native';

export default function ManagePaymentsScreen() {
  const queryClient = useQueryClient();

  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ['all-payments'],
    queryFn: async () => {
      const res = await paymentApi.getAllPayments();
      return res.data;
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      paymentApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-payments'] });
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update payment');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Payments</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {payments?.length === 0 ? (
          <EmptyState message="No payment records found" />
        ) : (
          payments?.map((payment: any) => (
            <View key={payment._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <CreditCard size={20} color={COLORS.champagneGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.method}>{payment.paymentMethod}</Text>
                  <Text style={styles.customer}>{payment.userId?.name || 'User'}</Text>
                  <Text style={styles.transaction}>{payment.transactionId}</Text>
                </View>
                <StatusBadge status={payment.paymentStatus} />
              </View>
              <View style={styles.divider} />
              <View style={styles.cardFooter}>
                <Text style={styles.amount}>Rs. {payment.amount}</Text>
                {payment.paymentStatus === 'Pending' && (
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => updateMutation.mutate({ id: payment._id, status: 'Paid' })}
                  >
                    <CheckCircle size={16} color={COLORS.successGreen} />
                    <Text style={styles.actionText}>Mark Paid</Text>
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
  method: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  customer: {
    fontSize: 13,
    color: COLORS.mutedRose,
    marginTop: 1,
  },
  transaction: {
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
  amount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.mutedRose,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successGreen + '12',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: COLORS.successGreen,
  },
});
// Favo file
