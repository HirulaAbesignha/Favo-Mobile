import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { COLORS } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { Calendar, ChevronLeft, User, Phone, Sparkles, Clock, ShieldCheck } from 'lucide-react-native';

export default function GeneralBookingScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [serviceName, setServiceName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirements, setRequirements] = useState('');

  const bookingMutation = useMutation({
    mutationFn: (data: any) => bookingApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      Alert.alert('Success', 'Your booking request has been sent!', [
        { text: 'View My Bookings', onPress: () => router.replace('/customer/my-bookings') },
        { text: 'Go Home', onPress: () => router.replace('/customer/home') }
      ]);
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create booking');
    }
  });

  const handleBooking = () => {
    if (!serviceName || !customerName || !phone) {
      Alert.alert('Required Fields', 'Please fill in the service name, your name, and phone number.');
      return;
    }

    bookingMutation.mutate({
      rentalStartDate: selectedDate.toISOString(),
      rentalEndDate: selectedDate.toISOString(),
      totalAmount: 0, // Inquiries don't have a fixed price upfront
      notes: `Service: ${serviceName}\nName: ${customerName}\nPhone: ${phone}\nRequirements: ${requirements}`
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.deepCharcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Expert Services</Text>
          <Text style={styles.introSub}>Tell us what you need, and we'll schedule a premium session for you.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color={COLORS.champagneGold} />
            <Text style={styles.sectionTitle}>What service do you need?</Text>
          </View>
          <CustomInput 
            placeholder="e.g. Wedding Grooming, Fashion Styling..." 
            value={serviceName} 
            onChangeText={setServiceName} 
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={COLORS.champagneGold} />
            <Text style={styles.sectionTitle}>Preferred Date</Text>
          </View>
          <View style={styles.datePickerStub}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={styles.dateSub}>Selected Date for Session</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={COLORS.champagneGold} />
            <Text style={styles.sectionTitle}>Your Details</Text>
          </View>
          <View style={styles.formCard}>
            <CustomInput 
              label="Full Name" 
              placeholder="Enter your name" 
              value={customerName} 
              onChangeText={setCustomerName} 
            />
            <CustomInput 
              label="Phone Number" 
              placeholder="07X XXX XXXX" 
              value={phone} 
              onChangeText={setPhone} 
              keyboardType="phone-pad"
            />
            <CustomInput 
              label="Additional Notes" 
              placeholder="Any specific requests or time preferences?" 
              value={requirements} 
              onChangeText={setRequirements} 
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Clock size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoText}>We will confirm the time with you</Text>
          </View>
          <View style={styles.infoRow}>
            <ShieldCheck size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoText}>Favo Certified Professionals</Text>
          </View>
        </View>

        <CustomButton
          title="Send Booking Request"
          onPress={handleBooking}
          loading={bookingMutation.isPending}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  backBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    marginBottom: 30,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 8,
  },
  introSub: {
    fontSize: 15,
    color: COLORS.darkGrey,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  datePickerStub: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.deepCharcoal,
  },
  dateSub: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.deepCharcoal,
  },
});
