import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemApi } from '../../../api/itemApi';
import { bookingApi } from '../../../api/bookingApi';
import { COLORS } from '../../../constants/colors';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Calendar, ChevronLeft, Clock, ShieldCheck, Info, User, Phone, ClipboardList } from 'lucide-react-native';

export default function BookServiceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirements, setRequirements] = useState('');

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const res = await itemApi.getItemById(id as string);
      return res.data;
    },
  });

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
    if (!customerName || !phone) {
      Alert.alert('Required Fields', 'Please provide your name and phone number.');
      return;
    }

    bookingMutation.mutate({
      itemId: item._id,
      rentalStartDate: selectedDate.toISOString(),
      rentalEndDate: selectedDate.toISOString(),
      totalAmount: item.price,
      notes: `Name: ${customerName}\nPhone: ${phone}\nRequirements: ${requirements}`
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!item) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.deepCharcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image
        source={
          item.image
            ? { uri: item.image }
            : { uri: 'https://via.placeholder.com/600x800/111111/C9A66B?text=SERVICE' }
        }
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.category}>{item.category}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.priceValue}>Rs. {item.price?.toLocaleString()}</Text>
          </View>
        </View>

        <Text style={styles.name}>{item.itemName}</Text>
        <Text style={styles.desc}>{item.description}</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={COLORS.champagneGold} />
            <Text style={styles.sectionTitle}>Select Date</Text>
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
            <Text style={styles.sectionTitle}>Your Information</Text>
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
              label="Special Requirements" 
              placeholder="Any specific requests?" 
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
            <Text style={styles.infoText}>Duration: 1.5 - 2 Hours</Text>
          </View>
          <View style={styles.infoRow}>
            <ShieldCheck size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoText}>Favo Certified Professionals</Text>
          </View>
          <View style={styles.infoRow}>
            <Info size={18} color={COLORS.champagneGold} />
            <Text style={styles.infoText}>Please arrive 15 mins early</Text>
          </View>
        </View>

        <CustomButton
          title="Confirm Booking Request"
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
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: COLORS.champagneGold,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  priceTag: {
    backgroundColor: COLORS.mutedRose + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.mutedRose,
  },
  name: {
    fontSize: 26,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    color: COLORS.darkGrey,
    lineHeight: 24,
    marginBottom: 24,
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
