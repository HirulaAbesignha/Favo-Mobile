import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import api from '../services/api';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 16;

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      // Adjust according to your backend data structure
      setProducts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={{ color: '#aaa' }}>No Image</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>${Number(item.price || 0).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.camel} style={{ marginTop: 50 }} />
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  listContainer: {
    padding: 8,
    paddingBottom: 30,
  },
  card: {
    width: cardWidth,
    margin: 8,
    backgroundColor: theme.colors.cream,
    borderRadius: 16, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.sand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
    alignItems: 'center', // Center align for fashion editorial look
  },
  productName: {
    fontSize: 14,
    fontFamily: theme.fonts.serif,
    fontWeight: '600',
    color: theme.colors.ink,
    marginBottom: 6,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mauve,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mauve,
  },
});

export default ProductsScreen;
