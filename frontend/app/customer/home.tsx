import { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { itemApi } from '../../api/itemApi';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import ItemCard from '../../components/ItemCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TrendingUp, Sparkles, Clock, Menu } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await itemApi.getItems();
      return res.data;
    },
  });

  const categories = ['Dresses', 'Suits', 'Accessories', 'Shoes', 'Traditional'];

  const featured = items?.slice(0, 4) || [];

  const navigateToItem = useCallback(
    (id: string) => {
      router.push(`/customer/item/${id}`);
    },
    [router]
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Fashionista'}</Text>
            <Text style={styles.subGreeting}>Discover your next statement look</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/customer/menu')} style={styles.menuBtn}>
            <Menu size={24} color={COLORS.deepCharcoal} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={styles.catPill}
            onPress={() => router.push({ pathname: '/customer/items', params: { category: cat } })}
          >
            <Text style={styles.catText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: COLORS.champagneGold + '15' }]}>
          <Sparkles size={20} color={COLORS.champagneGold} />
          <Text style={styles.statNumber}>{items?.length || 0}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.mutedRose + '12' }]}>
          <TrendingUp size={20} color={COLORS.mutedRose} />
          <Text style={styles.statNumber}>New</Text>
          <Text style={styles.statLabel}>Arrivals</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.deepCharcoal + '08' }]}>
          <Clock size={20} color={COLORS.deepCharcoal} />
          <Text style={styles.statNumber}>24h</Text>
          <Text style={styles.statLabel}>Support</Text>
        </View>
      </View>

      {/* Featured */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Looks</Text>
        <TouchableOpacity onPress={() => router.push('/customer/items')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {featured.map((item: any) => (
          <View key={item._id} style={styles.gridItem}>
            <ItemCard item={item} onPress={() => navigateToItem(item._id)} />
          </View>
        ))}
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
  greeting: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginTop: 4,
  },
  menuBtn: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 12,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  catRow: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  catPill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  catText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: COLORS.deepCharcoal,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.champagneGold,
    fontWeight: '700' as const,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  gridItem: {
    marginBottom: 8,
  },
});
// Favo file
