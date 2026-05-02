import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import api from '../services/api';
import { theme } from '../theme/theme';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Favo backend usually has /api/user/orders or /api/orders for the user's order history
      const response = await api.get('/orders');
      
      if (response.data.ok) {
        setOrders(response.data.data || []);
      } else {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id || item._id}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {item.status || 'Pending'}
        </Text>
      </View>
      <Text style={styles.orderDate}>
        {new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString()}
      </Text>
      <Text style={styles.orderTotal}>Total: ${(item.total_amount || item.totalPrice || 0).toFixed(2)}</Text>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.camel} style={{ marginTop: 50 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => (item.id || item._id || Math.random()).toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContainer}
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
    padding: 16,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: theme.colors.cream,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 14,
    fontFamily: theme.fonts.serif,
    color: theme.colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orderStatus: {
    fontSize: 12,
    fontFamily: theme.fonts.sans,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.sand,
    borderRadius: 8,
    overflow: 'hidden',
  },
  orderDate: {
    fontSize: 13,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mauve,
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 15,
    fontFamily: theme.fonts.sans,
    color: theme.colors.ink,
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

export default OrdersScreen;
