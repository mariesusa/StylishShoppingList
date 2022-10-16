import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Header, Icon } from'react-native-elements';
import { Input, Button } from'react-native-elements';
import { ListItem } from'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';

//import { initializeApp } from "firebase/app";

export default function App() {

  // Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP_5c4r4OoTEr8RMbH5-8mxsZ98cMaEt0",
  authDomain: "mobileprogrammingshoppin-ae73a.firebaseapp.com",
  databaseURL: "https://mobileprogrammingshoppin-ae73a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mobileprogrammingshoppin-ae73a",
  storageBucket: "mobileprogrammingshoppin-ae73a.appspot.com",
  messagingSenderId: "102492574472",
  appId: "1:102492574472:web:d3f9cbfc52a514be5512bd",
  measurementId: "G-0QCXZ9LLFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
//const analytics = getAnalytics(app);

const [product, setProduct] = useState('');
const [amount, setAmount] = useState('');
const [items, setItems] = useState([]);

useEffect(() => {
  const itemsRef = ref(database, 'items/');
  onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    const items = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
    setItems(items);
  });
}, []);

const saveProduct = () => {
  push(
    ref(database, 'items/'),
    { 'product': product, 'amount': amount }
  );
}

const deleteProduct = (key) => {
  remove(
    ref(database, 'items/' + key),
  )
}

const listSeparator = () => {
  return(
    <View
      style={{
        height: 5,
        width: '80%',
        backgroundColor: '#fff',
        marginLeft: '80%'
      }}
    />
  );
};

renderItem = ({ item }) => (
  <ListItem bottomDivider>
    <ListItem.Content>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 10 }}>
      <ListItem.Title>{ item.product }</ListItem.Title>
      <ListItem.Subtitle>{ item.amount }</ListItem.Subtitle>
      </View>
      <View style={{ flex: 1 }}>
      <MaterialCommunityIcons name="trash-can" size={ 30 } color="red"
            onPress={() => deleteProduct(item.key)} />
        </View>
      </View>
    </ListItem.Content>
  </ListItem>
)

  return (
    <View style={styles.container}>

      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
        containerStyle={{ justifyContent: 'space-around' }}
      />
      
      <Input
        placeholder='Product' label='PRODUCT'
        onChangeText={ product => setProduct(product) }
        value={ product }
      />

      <Input
        placeholder='Amount' label='AMOUNT'
        onChangeText={ amount => setAmount(amount) }
        value={ amount }
      />

      <Button 
        raised 
        containerStyle={{ width: '60%', marginBottom: 7}}
          icon={{ name: 'save', color: '#fff' }} 
          onPress={ saveProduct } 
          title='SAVE' />

      <FlatList
        data={ items }
        ItemSeparatorComponent={ listSeparator }
        renderItem={ renderItem }
        keyExtractor={ item => item.key }
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
  },
});
