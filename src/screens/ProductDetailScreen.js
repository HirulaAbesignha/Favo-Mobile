import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Dimensions } from 'react-native';
import { CartContext } from '../context/CartContext';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext) || {};
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    if (!addToCart) {
      Alert.alert('Error', 'Cart context not configured properly.');
      return;
    }
    setAdding(true);
    addToCart(product, 1);
    setAdding(false);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {product.images && product.images.length > 0 ? (
          <Image source={{ uri: product.images[0] }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={{ color: '#aaa' }}>No Image</Text>
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={styles.category}>{product.category_name || 'General'}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>${Number(product.price || 0).toFixed(2)}</Text>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description || 'No description available for this product.'}
          </Text>

          {product.stock_quantity !== undefined && (
            <Text style={[styles.stock, product.stock_quantity > 0 ? styles.inStock : styles.outOfStock]}>
              {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, product.stock_quantity === 0 && styles.buttonDisabled]} 
          onPress={handleAddToCart}
          disabled={adding || product.stock_quantity === 0}
        >
          <Text style={styles.buttonText}>
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  image: {
    width: width,
    height: width, // Square image, very standard for mobile
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: width,
    height: width,
    backgroundColor: theme.colors.sand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center', // Center aligned text
  },
  category: {
    fontSize: 12,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mauve,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 34,
    fontWeight: '700',
  },
  price: {
    fontSize: 18,
    fontFamily: theme.fonts.sans,
    color: theme.colors.ink,
    marginBottom: 32,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    marginBottom: 12,
    alignSelf: 'flex-start',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    fontSize: 15,
    fontFamily: theme.fonts.sans,
    color: theme.colors.ink,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'justify',
  },
  stock: {
    fontSize: 13,
    fontFamily: theme.fonts.sans,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inStock: {
    color: theme.colors.camel,
  },
  outOfStock: {
    color: theme.colors.error,
  },
  footer: {
    padding: 20,
    backgroundColor: theme.colors.cream,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    backgroundColor: theme.colors.ink,
    paddingVertical: 16,
    borderRadius: 30, // Pill shaped button
    alignItems: 'center',
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.mauve,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: theme.colors.cream,
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ProductDetailScreen;
