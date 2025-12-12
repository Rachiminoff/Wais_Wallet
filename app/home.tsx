import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles/HomeScreenStyles';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>        
        <View style={styles.userInfo}>          
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.helloText}>HELLO, USER!</Text>
            <Text style={styles.emailText}>user@gmail.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.balanceCard}>        
        <Text style={styles.safeLabel}>Safe Balance:</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>₱5,300.00</Text>
          <TouchableOpacity style={styles.addBtn}><Text style={styles.addText}>+</Text></TouchableOpacity>
        </View> 

        <Text style={styles.totalLabel}>Total Balance:</Text>
      </View>

      <View style={styles.pocketsCard}>        
        <Text style={styles.pocketsTitle}>Pockets:</Text>
        {[
          ['Rent', '₱0.00'],
          ['Bills', '₱0.00'],
          ['Grocery', '₱1,000.00'],
          ['Pang-Gala', '₱0.00'],
          ['Transportation', '₱700.00'],
          ['Savings', '₱3,000.00'],
        ].map((item, index) => (
          <View key={index} style={styles.row}>            
            <Text style={styles.label}>{item[0]}</Text>
            <Text style={styles.value}>{item[1]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.navbar}>        
        <Text style={styles.navIcon}>⚙️</Text>
        <Text style={styles.navIconActive}>🏠</Text>
        <Text style={styles.navIcon}>👤</Text>
      </View>
    </View>
  );
}
