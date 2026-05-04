import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { CheckCircle2, CreditCard, MapPin, User, ChevronLeft } from 'lucide-react-native';

type Step = 'billing' | 'payment' | 'confirmation';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const [step, setStep] = useState<Step>('billing');

  // Billing Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const handleNext = () => {
    if (step === 'billing') {
      if (!name || !address || !phone || !city) {
        Alert.alert('Error', 'Please fill in all billing details');
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      // Simulate payment processing
      setTimeout(() => {
        setStep('confirmation');
        clearCart();
      }, 1500);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => step === 'billing' ? router.back() : setStep('billing')} style={styles.backBtn}>
        <ChevronLeft size={24} color={COLORS.deepCharcoal} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Checkout</Text>
      <View style={{ width: 24 }} />
    </View>
  );

  const renderStepper = () => (
    <View style={styles.stepper}>
      <View style={[styles.stepDot, step !== 'billing' && styles.stepDone]} />
      <View style={[styles.stepLine, step !== 'billing' && styles.stepLineDone]} />
      <View style={[styles.stepDot, step === 'confirmation' && styles.stepDone, step === 'billing' && styles.stepPending]} />
      <View style={[styles.stepLine, step === 'confirmation' && styles.stepLineDone]} />
      <View style={[styles.stepDot, step === 'confirmation' ? styles.stepDone : styles.stepPending]} />
    </View>
  );

  if (step === 'confirmation') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <CheckCircle2 size={80} color={COLORS.champagneGold} />
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successMsg}>
            Thank you for your purchase. Your order has been received and is being processed.
          </Text>
          <CustomButton 
            title="Back to Home" 
            onPress={() => router.replace('/customer/home')}
            style={styles.homeBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderStepper()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'billing' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color={COLORS.champagneGold} />
              <Text style={styles.sectionTitle}>Billing Information</Text>
            </View>
            <CustomInput label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" />
            <CustomInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="077 123 4567" keyboardType="phone-pad" />
            <CustomInput label="Delivery Address" value={address} onChangeText={setAddress} placeholder="No. 123, Galle Road" multiline />
            <CustomInput label="City" value={city} onChangeText={setCity} placeholder="Colombo" />
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CreditCard size={20} color={COLORS.champagneGold} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentCardTitle}>Simulated Payment Gateway</Text>
              <Text style={styles.paymentCardText}>
                Total to pay: <Text style={{fontWeight: 'bold'}}>Rs. {(total || 0).toLocaleString()}</Text>
              </Text>
              <Text style={styles.paymentCardSub}>
                This is a secure mock payment environment.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {cart.map(item => (
            <View key={item._id} style={styles.summaryItem}>
              <Text style={styles.summaryItemName}>{item.itemName} x{item.quantity}</Text>
              <Text style={styles.summaryItemPrice}>Rs. {((item.price || 0) * item.quantity).toLocaleString()}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>Rs. {(total || 0).toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton 
          title={step === 'billing' ? 'Proceed to Payment' : 'Complete Purchase'} 
          onPress={handleNext} 
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
  header: {
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.champagneGold,
  },
  stepDone: {
    backgroundColor: COLORS.champagneGold,
  },
  stepPending: {
    borderColor: COLORS.lightGrey,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.lightGrey,
  },
  stepLineDone: {
    backgroundColor: COLORS.champagneGold,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.champagneGold + '40',
  },
  paymentCardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 8,
  },
  paymentCardText: {
    fontSize: 15,
    color: COLORS.deepCharcoal,
    marginBottom: 4,
  },
  paymentCardSub: {
    fontSize: 12,
    color: COLORS.darkGrey,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItemName: {
    fontSize: 14,
    color: COLORS.darkGrey,
    flex: 1,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.deepCharcoal,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGrey,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.champagneGold,
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginTop: 24,
  },
  successMsg: {
    fontSize: 16,
    color: COLORS.darkGrey,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  homeBtn: {
    marginTop: 40,
    width: '100%',
  },
});
