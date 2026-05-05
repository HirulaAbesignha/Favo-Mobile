import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../../api/complaintApi';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { MessageSquare, CheckCircle, XCircle, Send } from 'lucide-react-native';
import { Modal } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function ManageComplaintsScreen() {
  const queryClient = useQueryClient();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminResponse, setAdminResponse] = useState('');

  const { data: complaints, isLoading, refetch } = useQuery({
    queryKey: ['all-complaints'],
    queryFn: async () => {
      const res = await complaintApi.getAllComplaints();
      return res.data;
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const updateMutation = useMutation({
    mutationFn: ({ id, status, response }: { id: string; status: string; response: string }) =>
      complaintApi.updateStatus(id, status, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-complaints'] });
      setShowResponseModal(false);
      setAdminResponse('');
      Alert.alert('Success', 'Complaint updated');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update complaint');
    },
  });

  const handleAction = (complaint: any, status: string) => {
    setSelectedComplaint(complaint);
    setNewStatus(status);
    setShowResponseModal(true);
  };

  const submitResponse = () => {
    if (!adminResponse.trim()) {
      Alert.alert('Error', 'Please provide a response');
      return;
    }
    updateMutation.mutate({
      id: selectedComplaint._id,
      status: newStatus,
      response: adminResponse,
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Complaints</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {complaints?.length === 0 ? (
          <EmptyState message="No complaints found" />
        ) : (
          complaints?.map((c: any) => (
            <View key={c._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MessageSquare size={20} color={COLORS.champagneGold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject}>{c.subject}</Text>
                  <Text style={styles.customer}>{c.userId?.name || 'User'}</Text>
                  <Text style={styles.date}>{new Date(c.createdAt).toLocaleDateString()}</Text>
                </View>
                <StatusBadge status={c.status} />
              </View>
              <Text style={styles.desc}>{c.description}</Text>
              {c.status === 'Open' && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.successGreen + '12' }]}
                    onPress={() => handleAction(c, 'Resolved')}
                  >
                    <CheckCircle size={16} color={COLORS.successGreen} />
                    <Text style={[styles.actionText, { color: COLORS.successGreen }]}>Resolve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.errorRed + '12' }]}
                    onPress={() => handleAction(c, 'Rejected')}
                  >
                    <XCircle size={16} color={COLORS.errorRed} />
                    <Text style={[styles.actionText, { color: COLORS.errorRed }]}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
              {c.adminResponse && (
                <View style={styles.responseBox}>
                  <Text style={styles.responseLabel}>Response: {c.adminResponse}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showResponseModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{newStatus} Complaint</Text>
            <Text style={styles.modalSubtitle}>Subject: {selectedComplaint?.subject}</Text>
            
            <CustomInput
              label="Admin Response"
              placeholder="Explain the resolution or reason for rejection..."
              value={adminResponse}
              onChangeText={setAdminResponse}
              multiline
              numberOfLines={4}
            />

            <CustomButton
              title={`Submit as ${newStatus}`}
              onPress={submitResponse}
              loading={updateMutation.isPending}
            />
            
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setShowResponseModal(false)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  list: {
    flex: 1,
    paddingHorizontal: 16,
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
  customer: {
    fontSize: 13,
    color: COLORS.mutedRose,
    marginTop: 1,
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
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  responseBox: {
    marginTop: 12,
    backgroundColor: COLORS.softIvory,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.champagneGold,
  },
  responseLabel: {
    fontSize: 12,
    color: COLORS.darkGrey,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.mutedRose,
    marginBottom: 20,
  },
  closeBtn: {
    marginTop: 12,
    alignItems: 'center',
    padding: 10,
  },
  closeText: {
    color: COLORS.darkGrey,
    fontSize: 14,
  },
});
// Favo file
