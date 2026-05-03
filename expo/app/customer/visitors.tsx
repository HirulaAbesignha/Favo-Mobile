import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitorApi } from '../../api/visitorApi';
import { COLORS } from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { CalendarClock } from 'lucide-react-native';

export default function VisitorsScreen() {
  const queryClient = useQueryClient();
  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('Pickup');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { data: visitors, isLoading } = useQuery({
    queryKey: ['my-visitors'],
    queryFn: async () => {
      const res = await visitorApi.getAllVisitors();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      visitorApi.createVisitor({
        visitorName,
        phone,
        email,
        purpose,
        visitDate,
        visitTime,
        notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-visitors'] });
      setVisitorName('');
      setPhone('');
      setEmail('');
      setVisitDate('');
      setVisitTime('');
      setNotes('');
      Alert.alert('Success', 'Visit scheduled successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to schedule visit');
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!visitorName.trim()) e.visitorName = 'Name is required';
    if (!phone.trim()) e.phone = 'Phone is required';
    if (!visitDate.trim()) e.visitDate = 'Visit date is required';
    if (!visitTime.trim()) e.visitTime = 'Visit time is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    createMutation.mutate(undefined, { onSettled: () => setSubmitting(false) });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule Visit</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>New Appointment</Text>
          <CustomInput
            label="Full Name"
            placeholder="Jane Doe"
            value={visitorName}
            onChangeText={setVisitorName}
            error={errors.visitorName}
          />
          <CustomInput
            label="Phone"
            placeholder="+1 234 567 890"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <CustomInput
            label="Email (optional)"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            label="Visit Date"
            placeholder="YYYY-MM-DD"
            value={visitDate}
            onChangeText={setVisitDate}
            error={errors.visitDate}
          />
          <CustomInput
            label="Visit Time"
            placeholder="10:00 AM"
            value={visitTime}
            onChangeText={setVisitTime}
            error={errors.visitTime}
          />
          <CustomInput
            label="Notes (optional)"
            placeholder="Any special requests..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />
          <CustomButton title="Schedule Visit" onPress={handleSubmit} loading={submitting} />
        </View>

        <Text style={styles.sectionTitle}>My Visits</Text>

        {visitors?.length === 0 ? (
          <EmptyState message="No visits scheduled yet" />
        ) : (
          visitors?.map((v: any) => (
            <View key={v._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <CalendarClock size={20} color={COLORS.champagneGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{v.visitorName}</Text>
                  <Text style={styles.purpose}>{v.purpose}</Text>
                </View>
                <StatusBadge status={v.status} />
              </View>
              <View style={styles.divider} />
              <Text style={styles.detail}>
                {new Date(v.visitDate).toLocaleDateString()} at {v.visitTime}
              </Text>
              {v.notes ? <Text style={styles.notes}>{v.notes}</Text> : null}
            </View>
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
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: COLORS.darkGrey,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.champagneGold + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  purpose: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGrey,
    marginVertical: 10,
  },
  detail: {
    fontSize: 13,
    color: COLORS.darkGrey,
  },
  notes: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
// Favo file
