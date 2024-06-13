import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [items, setItems] = useState([]);
  const [Todo, setTodo] = useState("");
  const [priority, setPriority] = useState(null);
  const [Date, setDate] = useState("");

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    const URL = "https://my-backend-eta-nine.vercel.app/items";

    fetch(URL)
      .then(res => res.json())
      .then(data => {
        setItems(data);
      })
      .catch(error => {
        console.error("Error fetching items:", error);
      });
  };

  const handleAddItem = () => {
    const URL = "https://my-backend-eta-nine.vercel.app/items";
    const newItem = { task: Todo, priority: priority, due_date: Date };

    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then(res => res.json())
      .then(data => {
        setItems(prevItems => [...prevItems, data]);
        setTodo(""); // Clear the input field
        setPriority(null); // Clear the priority field
        setDate(""); // Clear the date field
        Alert.alert("Success", "Item added successfully!");
      })
      .catch(error => {
        console.error("Error adding item:", error);
        Alert.alert("Error", "Failed to add item.");
      });
  };

  const handleDelete = (id) => {
    const URL = `https://my-backend-eta-nine.vercel.app/items/${id}`;
    
    fetch(URL, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        Alert.alert("Success", "Item deleted successfully!");
      })
      .catch(error => {
        console.error("Error deleting item:", error);
        Alert.alert("Error", "Failed to delete item.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>To Do List</Text>

      {/* TextInput for task */}
      <TextInput
        style={styles.TextInput}
        placeholder="Add an item"
        value={Todo}
        onChangeText={setTodo}
      />

      {/* TextInput for priority */}
      <TextInput
        style={styles.TextInput}
        placeholder="Add a priority"
        value={priority ? priority.toString() : ''}
        onChangeText={(text) => setPriority(parseInt(text))}
        keyboardType="numeric"
      />

      {/* TextInput for date */}
      <TextInput
        style={styles.TextInput}
        placeholder="Add a date"
        value={Date}
        onChangeText={setDate}
      />

      <Button title="Add Item" onPress={handleAddItem} />

      <FlatList
        data={items}
      
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 5 }}>
                <Text style={styles.name}>{item?.task}</Text>
                <Text style={{ fontSize: 8, color: 'blue' }}>
                  To be done before {item?.due_date}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: 999,
                  borderColor: 'blue',
                  borderWidth: 2,
                  paddingHorizontal: 2,
                  paddingVertical: 8,
                }}
              >
                <Text style={styles.name}>{item?.priority}</Text>
              </View>
            </View>
            <Ionicons onPress={()=>handleDelete(item._id)} name="trash-bin" size={14} color="black" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    width: 300,
    padding: 15,
    margin: 18,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    color: '#555',
  },
  TextInput: {
    width: 350,
    borderColor: "#ccc",
    borderRadius: 2,
    borderWidth: 2,
    marginBottom: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});
