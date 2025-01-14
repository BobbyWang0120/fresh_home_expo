/**
 * New Product Form Screen
 * 
 * This screen provides a form for suppliers to create new products.
 * Form fields match the products table schema.
 */

import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { router } from 'expo-router';

const UNITS = ['lb', 'kg', 'g', '500g', 'piece', 'box'] as const;
type UnitType = typeof UNITS[number];

export default function NewProductScreen() {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [unit, setUnit] = useState<UnitType>('kg');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');
  const [showUnitModal, setShowUnitModal] = useState(false);

  const selectUnit = (selectedUnit: UnitType) => {
    setUnit(selectedUnit);
    setShowUnitModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.title}>添加新商品</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>商品名称</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="请输入商品名称"
              placeholderTextColor={Colors.light.icon}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>产地</Text>
            <TextInput
              style={styles.input}
              value={origin}
              onChangeText={setOrigin}
              placeholder="请输入产地"
              placeholderTextColor={Colors.light.icon}
            />
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
            <Text style={styles.label}>单价</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="请输入单价"
              keyboardType="decimal-pad"
              placeholderTextColor={Colors.light.icon}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>库存数量</Text>
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              placeholder="请输入库存数量"
              keyboardType="number-pad"
              placeholderTextColor={Colors.light.icon}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>商品图片URL</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="请输入商品图片URL"
              placeholderTextColor={Colors.light.icon}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>商品描述</Text>
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

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>创建商品</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
});
