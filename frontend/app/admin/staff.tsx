import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../../api/staffApi';
import { COLORS } from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Plus, Trash2, Users } from 'lucide-react-native';

export default function ManageStaffScreen() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const res = await staffApi.getAllStaff();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      staffApi.createStaff({
        staffName: name,
        email,
        phone,
        position,
        assignedDepartment: department,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setShowForm(false);
      resetForm();
      Alert.alert('Success', 'Staff member added');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add staff');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      staffApi.updateStaff(editingStaff._id, {
        staffName: name,
        email,
        phone,
        position,
        assignedDepartment: department,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setShowForm(false);
      resetForm();
      Alert.alert('Success', 'Staff member updated');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update staff');
    },
  });

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPosition('');
    setDepartment('');
    setEditingStaff(null);
  };

  const handleEdit = (s: any) => {
    setEditingStaff(s);
    setName(s.staffName);
    setEmail(s.email);
    setPhone(s.phone);
    setPosition(s.position);
    setDepartment(s.assignedDepartment);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!name || !email || !phone || !position || !department) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (editingStaff) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to delete staff');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Staff</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          <Plus size={20} color={COLORS.white} style={{ transform: [{ rotate: showForm ? '45deg' : '0deg' }] }} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</Text>
            <CustomInput label="Name" placeholder="John Smith" value={name} onChangeText={setName} />
            <CustomInput label="Email" placeholder="john@favo.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <CustomInput label="Phone" placeholder="+1 234 567 890" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <CustomInput label="Position" placeholder="Sales Manager" value={position} onChangeText={setPosition} />
            <CustomInput label="Department" placeholder="Operations" value={department} onChangeText={setDepartment} />
            <CustomButton 
              title={editingStaff ? 'Update Staff' : 'Add Staff'} 
              onPress={handleSubmit} 
              loading={createMutation.isPending || updateMutation.isPending} 
            />
            {editingStaff && (
              <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                <Text style={styles.cancelText}>Cancel Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.list}>
          {staff?.length === 0 ? (
            <EmptyState message="No staff members found" />
          ) : (
            staff?.map((s: any) => (
              <TouchableOpacity key={s._id} style={styles.card} onPress={() => handleEdit(s)}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <Users size={20} color={COLORS.champagneGold} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{s.staffName}</Text>
                    <Text style={styles.position}>{s.position} · {s.assignedDepartment}</Text>
                    <Text style={styles.contact}>{s.email}</Text>
                  </View>
                  <StatusBadge status={s.availabilityStatus} />
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    Alert.alert('Delete', 'Are you sure?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(s._id) },
                    ]);
                  }}
                >
                  <Trash2 size={16} color={COLORS.errorRed} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: COLORS.deepCharcoal,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.champagneGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
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
  position: {
    fontSize: 12,
    color: COLORS.mutedRose,
    marginTop: 1,
  },
  contact: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  deleteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.errorRed + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    marginTop: 12,
    alignItems: 'center',
    padding: 8,
  },
  cancelText: {
    color: COLORS.errorRed,
    fontSize: 14,
    fontWeight: '600',
  },
});
// Favo file
