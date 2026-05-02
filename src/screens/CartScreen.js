import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import { CartContext } from '../context/CartContext';
import { theme } from '../theme/theme';
import { theme } from '../theme/theme';

const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, checkout, loading } = useContext(CartContext);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }
    // Simulate shipping info
    const result = await checkout({ address: '123 Main St' });
    if (result.success) {
      Alert.alert('Success', 'Order placed successfully!');
      navigation.navigate('Orders'); // assuming there's an Orders screen
    } else {
      Alert.alert('Checkout Failed', result.error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={{ color: '#aaa', fontSize: 10 }}>No Img</Text>
        </View>
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>${Number(item.price || 0).toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
        <Text style={styles.removeBtnText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalAmount}>${getCartTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutBtn, loading && styles.disabledBtn]} 
              onPress={handleCheckout}
              disabled={loading}
            >
              <Text style={styles.checkoutBtnText}>
                {loading ? 'Processing...' : 'Checkout'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mauve,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cream,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    resizeMode: 'cover',
    marginRight: 12,
  },
  placeholderImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: theme.colors.sand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: theme.fonts.sans,
    color: theme.colors.ink,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    backgroundColor: theme.colors.sand,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  qtyBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    color: theme.colors.ink,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    color: theme.colors.ink,
  },
  removeBtn: {
    padding: 10,
  },
  removeBtnText: {
    color: theme.colors.error,
    fontFamily: theme.fonts.sans,
    fontSize: 14,
  },
  footer: {
    backgroundColor: theme.colors.cream,
    padding: 24,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mauve,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  checkoutBtn: {
    backgroundColor: theme.colors.ink,
    padding: 16,
    borderRadius: 30, // pill shape
    alignItems: 'center',
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledBtn: {
    backgroundColor: theme.colors.mauve,
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutBtnText: {
    color: theme.colors.cream,
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default CartScreen;
