import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../constants/colors';
import { Trash2, Plus, Minus, ChevronRight, ShoppingBag } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';
import EmptyState from '../../components/EmptyState';

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon={<ShoppingBag size={48} color={COLORS.champagneGold} />}
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet."
          buttonTitle="Start Shopping"
          onButtonPress={() => router.push('/customer/items')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.subtitle}>{cart.length} items</Text>
      </View>

      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
        {cart.map((item) => (
          <View key={item._id} style={styles.cartItem}>
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/100' }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.itemName}</Text>
              <Text style={styles.itemMeta}>{item.size} · {item.color}</Text>
              <Text style={styles.itemPrice}>Rs. {(item.price || 0).toLocaleString()}</Text>
              
              <View style={styles.quantityRow}>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    onPress={() => updateQuantity(item._id, item.quantity - 1)}
                    style={styles.qtyBtn}
                  >
                    <Minus size={16} color={COLORS.deepCharcoal} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity 
                    onPress={() => updateQuantity(item._id, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >
                    <Plus size={16} color={COLORS.deepCharcoal} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item._id)}>
                  <Trash2 size={18} color={COLORS.mutedRose} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>Rs. {(total || 0).toLocaleString()}</Text>
        </View>
        <CustomButton
          title="Checkout"
          onPress={() => router.push('/customer/checkout')}
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softIvory,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.softIvory,
    justifyContent: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  cartList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.lightGrey,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.deepCharcoal,
  },
  itemMeta: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softIvory,
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600' as const,
    paddingHorizontal: 10,
    color: COLORS.deepCharcoal,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  checkoutBtn: {
    width: '100%',
  },
});
