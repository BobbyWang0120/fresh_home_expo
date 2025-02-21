/**
 * New Product Form Screen
 * 
 * This screen provides a form for suppliers to create new products.
 * Form fields match the products table schema.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { router, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

// Hide the header for this screen
export const unstable_settings = {
  initialRouteName: 'new',
};

const UNITS = ['lb', 'kg', 'g', '500g', 'piece', 'box'] as const;
type UnitType = typeof UNITS[number];

interface Category {
  id: string;
  name: string;
}

interface FormErrors {
  name?: string;
  origin?: string;
  price?: string;
  stock?: string;
  category?: string;
}

export default function NewProductScreen() {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [unit, setUnit] = useState<UnitType>('kg');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stock, setStock] = useState('');
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data);
    } catch (error) {
      Alert.alert('错误', '获取分类列表失败');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const selectUnit = (selectedUnit: UnitType) => {
    setUnit(selectedUnit);
    setShowUnitModal(false);
  };

  const selectCategory = (category: Category | 'new') => {
    if (category === 'new') {
      setShowNewCategoryInput(true);
    } else {
      setSelectedCategory(category);
      setShowCategoryModal(false);
      setShowNewCategoryInput(false);
      setErrors({ ...errors, category: undefined });
    }
  };

  const handleNewCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      const newCategoryObj = {
        id: data.id,
        name: data.name,
      };

      setCategories([...categories, newCategoryObj]);
      setSelectedCategory(newCategoryObj);
      setNewCategory('');
      setShowNewCategoryInput(false);
      setShowCategoryModal(false);
      setErrors({ ...errors, category: undefined });
    } catch (error) {
      Alert.alert('错误', '创建新分类失败');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片时出错');
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      const ext = uri.substring(uri.lastIndexOf('.') + 1);
      const fileName = `${Date.now()}.${ext}`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const base64Data = base64.split(',')[1];
            const { data, error } = await supabase.storage
              .from('product-images')
              .upload(fileName, decode(base64Data), {
                contentType: `image/${ext}`,
              });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(fileName);

            resolve(publicUrl);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('上传图片失败');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = '请输入商品名称';
    }

    if (!origin.trim()) {
      newErrors.origin = '请输入产地';
    }

    if (!selectedCategory) {
      newErrors.category = '请选择商品分类';
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = '请输入有效的价格';
    }

    const stockNum = parseInt(stock);
    if (!stock || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = '请输入有效的库存数量';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('错误', '请检查表单填写是否正确');
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('未登录或会话已过期');
      }

      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const priceValue = parseFloat(price);
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name: name.trim(),
          origin: origin.trim(),
          unit,
          price: priceValue,
          discounted_price: priceValue, // 初始折扣价等于原价
          stock: parseInt(stock),
          description: description.trim() || null,
          image_url: imageUrl,
          supplier_id: user.id,
          is_active: true,
          category: selectedCategory?.name, // 使用分类名称
        });

      if (insertError) {
        throw insertError;
      }

      Alert.alert(
        '成功',
        '商品创建成功',
        [
          {
            text: '确定',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        '错误',
        error.message || '创建商品失败，请稍后重试'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (error?: string) => {
    if (!error) return null;
    return <Text style={styles.errorText}>{error}</Text>;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.title}>添加新商品</Text>
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView 
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>商品名称</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="请输入商品名称"
                  placeholderTextColor={Colors.light.icon}
                />
                {renderError(errors.name)}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>产地</Text>
                <TextInput
                  style={[styles.input, errors.origin && styles.inputError]}
                  value={origin}
                  onChangeText={(text) => {
                    setOrigin(text);
                    setErrors({ ...errors, origin: undefined });
                  }}
                  placeholder="请输入产地"
                  placeholderTextColor={Colors.light.icon}
                />
                {renderError(errors.origin)}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>计量单位</Text>
                <TouchableOpacity 
                  style={styles.unitSelector}
                  onPress={() => setShowUnitModal(true)}
                >
                  <Text style={styles.unitText}>{unit}</Text>
                  <Text style={styles.unitSelectorIcon}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>商品分类</Text>
                <TouchableOpacity 
                  style={[styles.input, errors.category && styles.inputError]}
                  onPress={() => setShowCategoryModal(true)}
                >
                  <Text style={[
                    styles.categoryText,
                    !selectedCategory && styles.placeholderText
                  ]}>
                    {selectedCategory?.name || '请选择商品分类'}
                  </Text>
                </TouchableOpacity>
                {renderError(errors.category)}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>单价</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  value={price}
                  onChangeText={(text) => {
                    setPrice(text);
                    setErrors({ ...errors, price: undefined });
                  }}
                  placeholder="请输入单价"
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.light.icon}
                />
                {renderError(errors.price)}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>库存数量</Text>
                <TextInput
                  style={[styles.input, errors.stock && styles.inputError]}
                  value={stock}
                  onChangeText={(text) => {
                    setStock(text);
                    setErrors({ ...errors, stock: undefined });
                  }}
                  placeholder="请输入库存数量"
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.light.icon}
                />
                {renderError(errors.stock)}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>商品图片（可选）</Text>
                <TouchableOpacity 
                  style={styles.imageUploadButton} 
                  onPress={pickImage}
                >
                  {selectedImage ? (
                    <Image 
                      source={{ uri: selectedImage }} 
                      style={styles.previewImage} 
                    />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Text style={styles.uploadText}>点击选择图片</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>商品描述（可选）</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="请输入商品描述"
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={Colors.light.icon}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.submitButtonContainer}>
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>创建商品</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal
          visible={showUnitModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUnitModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择计量单位</Text>
                <TouchableOpacity 
                  onPress={() => setShowUnitModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.unitList}>
                {UNITS.map((unitOption) => (
                  <TouchableOpacity
                    key={unitOption}
                    style={[
                      styles.unitOption,
                      unit === unitOption && styles.unitOptionSelected
                    ]}
                    onPress={() => selectUnit(unitOption)}
                  >
                    <Text style={[
                      styles.unitOptionText,
                      unit === unitOption && styles.unitOptionTextSelected
                    ]}>
                      {unitOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showCategoryModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择商品分类</Text>
                <TouchableOpacity 
                  onPress={() => {
                    setShowCategoryModal(false);
                    setShowNewCategoryInput(false);
                    setNewCategory('');
                  }}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              {isLoadingCategories ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#000" />
                </View>
              ) : (
                <View style={styles.categoryList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryOption,
                        selectedCategory?.id === cat.id && styles.categoryOptionSelected
                      ]}
                      onPress={() => selectCategory(cat)}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        selectedCategory?.id === cat.id && styles.categoryOptionTextSelected
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  
                  <TouchableOpacity
                    style={styles.newCategoryButton}
                    onPress={() => selectCategory('new')}
                  >
                    <Text style={styles.newCategoryButtonText}>+ 新建分类</Text>
                  </TouchableOpacity>

                  {showNewCategoryInput && (
                    <View style={styles.newCategoryInputContainer}>
                      <TextInput
                        style={styles.newCategoryInput}
                        value={newCategory}
                        onChangeText={setNewCategory}
                        placeholder="请输入新分类名称"
                        placeholderTextColor="#666"
                        autoFocus
                      />
                      <TouchableOpacity
                        style={[
                          styles.newCategorySubmitButton,
                          !newCategory.trim() && styles.newCategorySubmitButtonDisabled
                        ]}
                        onPress={handleNewCategory}
                        disabled={!newCategory.trim()}
                      >
                        <Text style={styles.newCategorySubmitButtonText}>确定</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUploadButton: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadText: {
    color: '#666666',
    fontSize: 16,
  },
  submitButtonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  submitButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 20,
    color: '#000000',
  },
  unitList: {
    padding: 16,
  },
  unitOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  unitOptionSelected: {
    backgroundColor: '#000000',
  },
  unitOptionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  unitOptionTextSelected: {
    color: '#FFFFFF',
  },
  categoryText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    color: '#666666',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  categoryList: {
    padding: 16,
  },
  categoryOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  categoryOptionSelected: {
    backgroundColor: '#000000',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
  },
  newCategoryButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'dashed',
  },
  newCategoryButtonText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '600',
  },
  newCategoryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  newCategoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    marginRight: 8,
  },
  newCategorySubmitButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  newCategorySubmitButtonDisabled: {
    opacity: 0.5,
  },
  newCategorySubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  unitSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  unitText: {
    fontSize: 16,
    color: '#000000',
  },
  unitSelectorIcon: {
    fontSize: 12,
    color: '#666666',
  },
});
