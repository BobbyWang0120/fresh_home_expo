/**
 * New Product Form Screen
 * 
 * This screen provides a form for suppliers to create new products.
 * Form fields match the products table schema.
 */

import { useState, useEffect } from 'react';
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
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
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
        .from('products')
        .select('category')
        .not('category', 'eq', '')
        .order('category');

      if (error) throw error;

      // 获取唯一的分类列表
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      setCategories(uniqueCategories);
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

  const selectCategory = (selectedCategory: string) => {
    if (selectedCategory === 'new') {
      setShowNewCategoryInput(true);
    } else {
      setCategory(selectedCategory);
      setShowCategoryModal(false);
      setShowNewCategoryInput(false);
      setErrors({ ...errors, category: undefined });
    }
  };

  const handleNewCategory = () => {
    if (!newCategory.trim()) {
      return;
    }
    setCategory(newCategory.trim());
    setCategories([...categories, newCategory.trim()]);
    setNewCategory('');
    setShowNewCategoryInput(false);
    setShowCategoryModal(false);
    setErrors({ ...errors, category: undefined });
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
      // 获取文件扩展名
      const ext = uri.substring(uri.lastIndexOf('.') + 1);
      
      // 创建唯一的文件名
      const fileName = `${Date.now()}.${ext}`;
      
      // 获取图片的base64数据
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

    if (!category.trim()) {
      newErrors.category = '请选择或输入分类';
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

      // 获取当前登录用户
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('未登录或会话已过期');
      }

      // 如果有选择图片，先上传图片
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      // 创建新商品
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name: name.trim(),
          origin: origin.trim(),
          unit,
          price: parseFloat(price),
          stock: parseInt(stock),
          description: description.trim() || null,
          image_url: imageUrl,
          supplier_id: user.id,
          is_active: true,
          category: category.trim(),
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
                    !category && styles.placeholderText
                  ]}>
                    {category || '请选择商品分类'}
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
                  <ActivityIndicator size="large" color={Colors.light.tint} />
                </View>
              ) : (
                <View style={styles.categoryList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        category === cat && styles.categoryOptionSelected
                      ]}
                      onPress={() => selectCategory(cat)}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        category === cat && styles.categoryOptionTextSelected
                      ]}>
                        {cat}
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
                        placeholderTextColor={Colors.light.icon}
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
    backgroundColor: Colors.light.background,
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
    borderBottomColor: '#E5E7EB',
    backgroundColor: Colors.light.background,
    zIndex: 1,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  form: {
    padding: 16,
    paddingBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: Colors.light.text,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
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
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F9FAFB',
  },
  uploadText: {
    color: Colors.light.icon,
    fontSize: 16,
  },
  submitButtonContainer: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  unitSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  unitText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  unitSelectorIcon: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 20,
    color: Colors.light.icon,
  },
  unitList: {
    padding: 16,
  },
  unitOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  unitOptionSelected: {
    backgroundColor: Colors.light.tint + '15',
  },
  unitOptionText: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
  unitOptionTextSelected: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  placeholderText: {
    color: Colors.light.icon,
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
    backgroundColor: '#F9FAFB',
  },
  categoryOptionSelected: {
    backgroundColor: Colors.light.tint + '15',
  },
  categoryOptionText: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
  categoryOptionTextSelected: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
  newCategoryButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.light.tint + '15',
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderStyle: 'dashed',
  },
  newCategoryButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
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
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: Colors.light.text,
    marginRight: 8,
  },
  newCategorySubmitButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  newCategorySubmitButtonDisabled: {
    opacity: 0.7,
  },
  newCategorySubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
