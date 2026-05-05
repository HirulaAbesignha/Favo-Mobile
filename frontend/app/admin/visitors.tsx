import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitorApi } from '../../api/visitorApi';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { CalendarClock, CheckCircle } from 'lucide-react-native';

export default function ManageVisitorsScreen() {
  const queryClient = useQueryClient();

  const { data: visitors, isLoading } = useQuery({
    queryKey: ['all-visitors'],
    queryFn: async () => {
      const res = await visitorApi.getAllVisitors();
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      visitorApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-visitors'] });
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update visitor');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Visitors</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {visitors?.length === 0 ? (
          <EmptyState message="No visitor records found" />
        ) : (
          visitors?.map((v: any) => (
            <View key={v._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <CalendarClock size={20} color={COLORS.champagneGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{v.visitorName}</Text>
                  <Text style={styles.purpose}>{v.purpose}</Text>
                  <Text style={styles.date}>
                    {new Date(v.visitDate).toLocaleDateString()} at {v.visitTime}
                  </Text>
                </View>
                <StatusBadge status={v.status} />
              </View>
              {(v.status === 'Scheduled' || v.status === 'Checked-In') && (
                <View style={styles.actions}>
                  {v.status === 'Scheduled' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: COLORS.successGreen + '12' }]}
                      onPress={() => updateMutation.mutate({ id: v._id, status: 'Checked-In' })}
                    >
                      <CheckCircle size={16} color={COLORS.successGreen} />
                      <Text style={[styles.actionText, { color: COLORS.successGreen }]}>Check In</Text>
                    </TouchableOpacity>
                  )}
                  {v.purpose === 'Pickup' ? (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: COLORS.successGreen + '12' }]}
                      onPress={() => updateMutation.mutate({ id: v._id, status: 'Done' })}
                    >
                      <CheckCircle size={16} color={COLORS.successGreen} />
                      <Text style={[styles.actionText, { color: COLORS.successGreen }]}>Pickup Completed</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: COLORS.champagneGold + '12' }]}
                      onPress={() => updateMutation.mutate({ id: v._id, status: 'Completed' })}
                    >
                      <CheckCircle size={16} color={COLORS.champagneGold} />
                      <Text style={[styles.actionText, { color: COLORS.champagneGold }]}>Complete</Text>
                    </TouchableOpacity>
                  )}
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
  name: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  purpose: {
    fontSize: 13,
    color: COLORS.mutedRose,
    marginTop: 1,
  },
  date: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
});
// Favo file
