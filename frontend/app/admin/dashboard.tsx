import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { itemApi } from '../../api/itemApi';
import { bookingApi } from '../../api/bookingApi';
import { complaintApi } from '../../api/complaintApi';
import { paymentApi } from '../../api/paymentApi';
import { COLORS } from '../../constants/colors';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Package, CalendarDays, AlertCircle, DollarSign, TrendingUp, Users } from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await itemApi.getItems();
      return res.data;
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ['all-bookings'],
    queryFn: async () => {
      const res = await bookingApi.getAllBookings();
      return res.data;
    },
  });

  const { data: complaints } = useQuery({
    queryKey: ['all-complaints'],
    queryFn: async () => {
      const res = await complaintApi.getAllComplaints();
      return res.data;
    },
  });

  const { data: payments } = useQuery({
    queryKey: ['all-payments'],
    queryFn: async () => {
      const res = await paymentApi.getAllPayments();
      return res.data;
    },
  });

  const pendingBookings = bookings?.filter((b: any) => b.status === 'Pending').length || 0;
  const openComplaints = complaints?.filter((c: any) => c.status === 'Open').length || 0;
  const totalRevenue = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

  const stats = [
    { label: 'Total Items', value: items?.length || 0, icon: <Package size={22} color={COLORS.champagneGold} />, bg: COLORS.champagneGold + '15' },
    { label: 'Bookings', value: bookings?.length || 0, icon: <CalendarDays size={22} color={COLORS.mutedRose} />, bg: COLORS.mutedRose + '12' },
    { label: 'Pending', value: pendingBookings, icon: <TrendingUp size={22} color={COLORS.deepCharcoal} />, bg: COLORS.deepCharcoal + '08' },
    { label: 'Complaints', value: openComplaints, icon: <AlertCircle size={22} color={COLORS.errorRed} />, bg: COLORS.errorRed + '10' },
  ];

  if (!items || !bookings) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Overview of your fashion rental business</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
            {s.icon}
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
          <DollarSign size={20} color={COLORS.white} />
          <Text style={styles.revenueTitle}>Total Revenue</Text>
        </View>
        <Text style={styles.revenueValue}>${totalRevenue.toLocaleString()}</Text>
        <Text style={styles.revenueSub}>From all payment records</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityRow}>
            <Users size={16} color={COLORS.darkGrey} />
            <Text style={styles.activityText}>
              {bookings?.length || 0} total bookings across the platform
            </Text>
          </View>
          <View style={styles.activityRow}>
            <Package size={16} color={COLORS.darkGrey} />
            <Text style={styles.activityText}>
              {items?.length || 0} fashion items in inventory
            </Text>
          </View>
          <View style={styles.activityRow}>
            <AlertCircle size={16} color={COLORS.darkGrey} />
            <Text style={styles.activityText}>
              {openComplaints} complaints need attention
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  revenueCard: {
    backgroundColor: COLORS.deepCharcoal,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  revenueTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.warmBeige,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  revenueValue: {
    fontSize: 36,
    fontWeight: '300' as const,
    color: COLORS.white,
  },
  revenueSub: {
    fontSize: 13,
    color: COLORS.lightGrey,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.darkGrey,
  },
});
// Favo file
