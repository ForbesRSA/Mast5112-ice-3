// App.js - Restaurant Menu Manager (Part 2)
// Lets the chef add menu items and view all items that have been added.
// Two screens (switched with simple state, no extra libraries needed):
//   1. Menu screen - displays all menu items in a FlatList
//   2. Add screen  - form to capture a new menu item

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Course options shown in the Picker
const COURSES = ['Starter', 'Main Course', 'Dessert'];

/* ---------------------------- MENU SCREEN ---------------------------- */
// Shows every menu item added so far. Because the list comes from state,
// it updates automatically whenever a new item is added.
function MenuScreen({ menuItems, onAddPress }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemName}>{item.dishName}</Text>
        <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.itemCourse}>{item.course}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.flex}>
      <Text style={styles.sectionTitle}>Menu Items ({menuItems.length})</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No menu items yet. Tap the button below to add your first dish.
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <Button title="+ Add Menu Item" onPress={onAddPress} color="#B22222" />
      </View>
    </View>
  );
}

/* ----------------------------- ADD SCREEN ---------------------------- */
// Captures dish name, description, course and price, validates them,
// then passes the new item up to App through onSave.
function AddScreen({ onSave, onCancel }) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    // Validation: every field is required
    if (!dishName.trim() || !description.trim() || !course || !price.trim()) {
      Alert.alert('Missing information', 'Please fill in all fields.');
      return;
    }

    // Validation: price must be a positive number
    const priceNumber = parseFloat(price.replace(',', '.'));
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price, e.g. 65.00');
      return;
    }

    onSave({
      id: Date.now().toString(), // unique id used as the FlatList key
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: priceNumber,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Add Menu Item</Text>

        <Text style={styles.label}>Dish Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Chicken Wings"
          value={dishName}
          onChangeText={setDishName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="e.g. Spicy grilled chicken wings"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Course</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={course} onValueChange={(v) => setCourse(v)}>
            <Picker.Item label="Select Course" value="" />
            {COURSES.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Price (R)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 65.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <View style={styles.buttonWrapper}>
          <Button title="Save" onPress={handleSave} color="#B22222" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Cancel" onPress={onCancel} color="#777777" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* -------------------------------- APP -------------------------------- */
export default function App() {
  const [screen, setScreen] = useState('menu'); // 'menu' or 'add'
  const [menuItems, setMenuItems] = useState([]); // all menu items

  // Add the new item, then return to the menu so the chef sees it listed
  const handleSave = (newItem) => {
    setMenuItems((current) => [...current, newItem]);
    setScreen('menu');
    Alert.alert('Success', `${newItem.dishName} was added to the menu.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Clear application title shown on every screen */}
      <Text style={styles.appTitle}>Restaurant Menu Manager</Text>

      {screen === 'menu' ? (
        <MenuScreen menuItems={menuItems} onAddPress={() => setScreen('add')} />
      ) : (
        <AddScreen onSave={handleSave} onCancel={() => setScreen('menu')} />
      )}
    </SafeAreaView>
  );
}

/* ------------------------------- STYLES ------------------------------ */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: '#2E2E38',
    paddingVertical: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E2E38',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  multiline: {
    height: 90,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginBottom: 14,
  },
  buttonWrapper: {
    marginTop: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#B22222',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E2E38',
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B22222',
  },
  itemCourse: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 15,
    color: '#444444',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777777',
    marginTop: 10,
  },
});
