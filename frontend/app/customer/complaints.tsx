import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../../api/complaintApi';
import { COLORS } from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { MessageSquare, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image, TouchableOpacity } from 'react-native';

export default function ComplaintsScreen() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: async () => {
      const res = await complaintApi.getMyComplaints();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => complaintApi.createComplaint({ 
      subject, 
      description,
      image: imageUri || '' // Passing URI as string for now, or handle as FormData if backend supports it
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
      setSubject('');
      setDescription('');
      setImageUri(null);
      Alert.alert('Success', 'Complaint submitted successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to submit complaint');
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!subject.trim()) e.subject = 'Subject is required';
    if (!description.trim()) e.description = 'Description is required';
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
        <Text style={styles.title}>Complaints</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>New Complaint</Text>
          <CustomInput
            label="Subject"
            placeholder="What is this about?"
            value={subject}
            onChangeText={setSubject}
            error={errors.subject}
          />
          <CustomInput
            label="Description"
            placeholder="Describe your issue in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            error={errors.description}
          />
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImageIcon size={24} color={COLORS.darkGrey} />
                <Text style={styles.imageText}>Add photo evidence (optional)</Text>
              </View>
            )}
          </TouchableOpacity>
          <CustomButton title="Submit Complaint" onPress={handleSubmit} loading={submitting} />
        </View>

        <Text style={styles.sectionTitle}>History</Text>

        {complaints?.length === 0 ? (
          <EmptyState message="No complaints submitted yet" />
        ) : (
          complaints?.map((c: any) => (
            <View key={c._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MessageSquare size={20} color={COLORS.champagneGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject}>{c.subject}</Text>
                  <Text style={styles.date}>{new Date(c.createdAt).toLocaleDateString()}</Text>
                </View>
                <StatusBadge status={c.status} />
              </View>
              <Text style={styles.desc}>{c.description}</Text>
              {c.adminResponse ? (
                <View style={styles.responseBox}>
                  <Text style={styles.responseLabel}>Admin Response:</Text>
                  <Text style={styles.responseText}>{c.adminResponse}</Text>
                </View>
              ) : null}
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
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.champagneGold + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subject: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  date: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  desc: {
    fontSize: 14,
    color: COLORS.darkGrey,
    lineHeight: 20,
  },
  responseBox: {
    marginTop: 12,
    backgroundColor: COLORS.champagneGold + '10',
    borderRadius: 10,
    padding: 10,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: COLORS.champagneGold,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 13,
    color: COLORS.darkGrey,
  },
  imagePicker: {
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    borderStyle: 'dashed',
    marginBottom: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.softIvory,
  },
  imageText: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 8,
  },
});
// Favo file
