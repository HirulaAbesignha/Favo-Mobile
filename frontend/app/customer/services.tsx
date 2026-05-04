import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { itemApi } from '../../api/itemApi';
import { COLORS } from '../../constants/colors';
import ItemCard from '../../components/ItemCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Search, SlidersHorizontal, ChevronLeft } from 'lucide-react-native';

export default function ServicesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data: items, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await itemApi.getItems({ availabilityStatus: 'Available' });
      // Filter for Services only
      return res.data.filter((i: any) => i.itemType === 'Service');
    },
  });

  const filtered = items?.filter((item: any) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.deepCharcoal} />
        </TouchableOpacity>
        <Text style={styles.title}>Book a Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={COLORS.darkGrey} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Favo Experiences</Text>
          <Text style={styles.introSub}>Book a session with our experts for grooming, styling, and more.</Text>
        </View>

        {filtered?.length === 0 ? (
          <EmptyState message="No services found" />
        ) : (
          filtered?.map((item: any) => (
            <ItemCard
              key={item._id}
              item={item}
              onPress={() => router.push(`/customer/book-service/${item._id}`)}
            />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  backBtn: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.deepCharcoal,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  intro: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 8,
  },
  introSub: {
    fontSize: 14,
    color: COLORS.darkGrey,
    lineHeight: 20,
  },
});
