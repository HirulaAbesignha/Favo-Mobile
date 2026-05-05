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
import { Platform, Modal, FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

const CATEGORIES = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Shoes'];
const SIZES = ['S', 'M', 'L'];

export default function ManageItemsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [type] = useState<'Product'>('Product');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeStocks, setSizeStocks] = useState<{ [key: string]: string }>({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

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
        sizes: selectedSizes.map(s => ({ size: s, stock: Number(sizeStocks[s] || 0) })),
        color,
        price: Number(price),
        description: desc,
        itemType: type,
      } as any);
      
      const newItem = res.data;

      if (imageUri && newItem._id) {
        const formData = new FormData();
        console.log('Platform:', Platform.OS);
        console.log('Image URI:', imageUri);

        if (Platform.OS === 'web') {
          console.log('Fetching blob for web...');
          const response = await fetch(imageUri);
          const blob = await response.blob();
          console.log('Blob created:', blob.size, blob.type);
          formData.append('image', blob, 'item-image.jpg');
        } else {
          formData.append('image', {
            uri: imageUri,
            name: 'item-image.jpg',
            type: 'image/jpeg',
          } as any);
        }
        
        await itemApi.uploadImage(newItem._id, formData);
      }
      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setShowForm(false);
      resetForm();
      Alert.alert('Success', 'Item created successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await itemApi.updateItem(editingItem._id, {
        itemName: name,
        category,
        sizes: selectedSizes.map(s => ({ size: s, stock: Number(sizeStocks[s] || 0) })),
        color,
        price: Number(price),
        description: desc,
        itemType: type,
      } as any);

      if (imageUri && !imageUri.startsWith('http')) {
        const formData = new FormData();
        console.log('Update - Platform:', Platform.OS);
        console.log('Update - Image URI:', imageUri);

        if (Platform.OS === 'web') {
          console.log('Update - Fetching blob for web...');
          const response = await fetch(imageUri);
          const blob = await response.blob();
          console.log('Update - Blob created:', blob.size, blob.type);
          formData.append('image', blob, 'item-image.jpg');
        } else {
          formData.append('image', {
            uri: imageUri,
            name: 'item-image.jpg',
            type: 'image/jpeg',
          } as any);
        }

        await itemApi.uploadImage(editingItem._id, formData);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setShowForm(false);
      resetForm();
      Alert.alert('Success', 'Item updated successfully');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => itemApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      Alert.alert('Success', 'Item deleted');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to delete item');
    },
  });

  const resetForm = () => {
    setName('');
    setCategory('');
    setSelectedSizes([]);
    setSizeStocks({});
    setColor('');
    setPrice('');
    setDesc('');
    setImageUri(null);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.itemName);
    setCategory(item.category);
    
    const sizes = item.sizes || [];
    setSelectedSizes(sizes.map((s: any) => s.size));
    const stocks: { [key: string]: string } = {};
    sizes.forEach((s: any) => {
      stocks[s.size] = s.stock.toString();
    });
    setSizeStocks(stocks);

    setColor(item.color);
    setPrice(item.price.toString());
    setDesc(item.description || '');
    setImageUri(item.image || null);
    setShowForm(true);
  };

  const handleCreate = () => {
    if (!name || !category || selectedSizes.length === 0 || !color || !price) {
      Alert.alert('Error', 'Please fill all required fields and select at least one size');
      return;
    }
    if (editingItem) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Items</Text>
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
            <Text style={styles.formTitle}>{editingItem ? 'Edit Item' : 'Add New Item'}</Text>
            <CustomInput label="Item Name" placeholder="Elegant Evening Gown" value={name} onChangeText={setName} />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity 
                style={styles.dropdown} 
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.dropdownText, !category && { color: COLORS.darkGrey }]}>
                  {category || 'Select Category'}
                </Text>
                <ChevronDown size={20} color={COLORS.darkGrey} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Sizes & Stock</Text>
            <View style={styles.sizeSelector}>
              {SIZES.map(s => (
                <TouchableOpacity 
                  key={s} 
                  style={[styles.sizeBtn, selectedSizes.includes(s) && styles.sizeBtnActive]}
                  onPress={() => {
                    if (selectedSizes.includes(s)) {
                      setSelectedSizes(selectedSizes.filter(sz => sz !== s));
                    } else {
                      setSelectedSizes([...selectedSizes, s]);
                    }
                  }}
                >
                  <Text style={[styles.sizeBtnText, selectedSizes.includes(s) && styles.sizeBtnTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedSizes.map(s => (
              <CustomInput 
                key={s}
                label={`Stock for Size ${s}`}
                placeholder="0"
                value={sizeStocks[s] || ''}
                onChangeText={(val) => setSizeStocks({ ...sizeStocks, [s]: val })}
                keyboardType="numeric"
              />
            ))}

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <CustomInput label="Color" placeholder="Black" value={color} onChangeText={setColor} />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <CustomInput label="Price (Rs.)" placeholder="5000" value={price} onChangeText={setPrice} keyboardType="numeric" />
              </View>
            </View>
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

            <CustomButton 
              title={editingItem ? 'Update Item' : 'Create Item'} 
              onPress={handleCreate} 
              loading={createMutation.isPending || updateMutation.isPending} 
            />
            {editingItem && (
              <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                <Text style={styles.cancelText}>Cancel Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.list}>
          {items?.length === 0 ? (
            <EmptyState message="No items in inventory" />
          ) : (
            items?.map((item: any) => (
              <View key={item._id} style={styles.itemWrapper}>
                <ItemCard item={item} onPress={() => handleEdit(item)} />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    Alert.alert('Delete', 'Are you sure?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(item._id) },
                    ]);
                  }}
                >
                  <Trash2 size={16} color={COLORS.errorRed} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.categoryItem} 
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={[styles.categoryText, category === item && styles.categoryTextSelected]}>
                    {item}
                  </Text>
                  {category === item && <Check size={20} color={COLORS.champagneGold} />}
                </TouchableOpacity>
              )}
            />
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
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.deepCharcoal,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: COLORS.softIvory,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.lightGrey + '40',
  },
  dropdownText: {
    fontSize: 15,
    color: COLORS.deepCharcoal,
  },
  sizeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sizeBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.softIvory,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey + '40',
  },
  sizeBtnActive: {
    backgroundColor: COLORS.champagneGold,
    borderColor: COLORS.champagneGold,
  },
  sizeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.deepCharcoal,
  },
  sizeBtnTextActive: {
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 400,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.softIvory,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.deepCharcoal,
  },
  doneText: {
    color: COLORS.champagneGold,
    fontWeight: '700',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.softIvory,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.darkGrey,
  },
  categoryTextSelected: {
    color: COLORS.champagneGold,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
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
