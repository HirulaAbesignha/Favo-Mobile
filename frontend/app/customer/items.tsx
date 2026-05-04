import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { itemApi } from '../../api/itemApi';
import { COLORS } from '../../constants/colors';
import ItemCard from '../../components/ItemCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';

export default function ItemListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState((params.category as string) || '');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Dresses', 'Suits', 'Accessories', 'Shoes', 'Traditional'];

  const { data: items, isLoading } = useQuery({
    queryKey: ['items', selectedCategory],
    queryFn: async () => {
      const res = await itemApi.getItems(
        selectedCategory && selectedCategory !== 'All' ? { category: selectedCategory } : {}
      );
      // Filter for Products only
      return res.data.filter((i: any) => i.itemType !== 'Service');
    },
  });

  const filtered = items?.filter((item: any) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Collection</Text>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={COLORS.darkGrey} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={18} color={COLORS.darkGrey} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterPill,
                selectedCategory === cat && styles.filterPillActive,
              ]}
              onPress={() => setSelectedCategory(cat === 'All' ? '' : cat)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === cat && styles.filterTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered?.length === 0 ? (
          <EmptyState message="No items match your search" />
        ) : (
          filtered?.map((item: any) => (
            <ItemCard
              key={item._id}
              item={item}
              onPress={() => router.push(`/customer/item/${item._id}`)}
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
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
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
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.deepCharcoal,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  filterPillActive: {
    backgroundColor: COLORS.champagneGold,
    borderColor: COLORS.champagneGold,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: COLORS.darkGrey,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
// Favo file
