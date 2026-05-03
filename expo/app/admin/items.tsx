import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemApi } from '../../api/itemApi';
import { COLORS } from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import ItemCard from '../../components/ItemCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import * as ImagePicker from 'expo-image-picker';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react-native';

export default function ManageItemsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [stock, setStock] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await itemApi.getItems();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await itemApi.createItem({
        itemName: name,
        category,
        size,
        color,
        rentalPrice: Number(price),
        depositAmount: Number(deposit),
        description: desc,
        stockQuantity: Number(stock),
      });
      
      const newItem = res.data;

      if (imageUri && newItem._id) {
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          name: 'item-image.jpg',
          type: 'image/jpeg',
        } as any);
        await itemApi.uploadImage(newItem._id, formData);
      }
      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setShowForm(false);
      setName(''); setCategory(''); setSize(''); setColor(''); setPrice(''); setDeposit(''); setStock(''); setDesc(''); setImageUri(null);
      Alert.alert('Success', 'Item created successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => itemApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to delete item');
    },
  });

  const handleCreate = () => {
    if (!name || !category || !size || !color || !price || !deposit || !stock) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    createMutation.mutate();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Items</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Plus size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Item</Text>
            <CustomInput label="Item Name" placeholder="Elegant Evening Gown" value={name} onChangeText={setName} />
            <CustomInput label="Category" placeholder="Dresses" value={category} onChangeText={setCategory} />
            <CustomInput label="Size" placeholder="M" value={size} onChangeText={setSize} />
            <CustomInput label="Color" placeholder="Black" value={color} onChangeText={setColor} />
            <CustomInput label="Rental Price" placeholder="50" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <CustomInput label="Deposit" placeholder="100" value={deposit} onChangeText={setDeposit} keyboardType="numeric" />
            <CustomInput label="Stock" placeholder="5" value={stock} onChangeText={setStock} keyboardType="numeric" />
            <CustomInput label="Description" placeholder="Description..." value={desc} onChangeText={setDesc} multiline numberOfLines={3} />
            
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <ImageIcon size={24} color={COLORS.darkGrey} />
                  <Text style={styles.imageText}>Upload Item Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <CustomButton title="Create Item" onPress={handleCreate} loading={createMutation.isPending} />
          </View>
        )}

        <View style={styles.list}>
          {items?.length === 0 ? (
            <EmptyState message="No items in inventory" />
          ) : (
            items?.map((item: any) => (
              <View key={item._id} style={styles.itemWrapper}>
                <ItemCard item={item} onPress={() => {}} />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteMutation.mutate(item._id)}
                >
                  <Trash2 size={16} color={COLORS.errorRed} />
                </TouchableOpacity>
              </View>
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
  imagePicker: {
    height: 120,
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  itemWrapper: {
    position: 'relative',
  },
  deleteBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
// Favo file
