import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import firebase from '@/db/firebase';

type Props = {};

const Order = (props: Props) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if(orders.length>0){
            setOrders([]);
        }
        // Get a reference to the orders collection
        const ordersRef = firebase.firestore().collection('orders');

        // Listen for changes to the orders collection
        const unsubscribe = ordersRef.onSnapshot(snapshot => {
            // Get the new orders
            const newOrders = snapshot.docChanges().filter(change => change.type === 'added').map(change => change.doc.data());
            console.log(newOrders);
            // Update the UI with the new orders
            setOrders(prevOrders => [...prevOrders, ...newOrders]);
        });

        return () => unsubscribe(); 
    }, []);

    // Render item for FlatList
    const renderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.text}>Payment Method: {item.paymentMethod}</Text>
            <Text style={styles.text}>Price: {item.price}</Text>
            <Text style={styles.text}>User ID: {item.userId}</Text>
            <Text style={styles.text}>User Address: {item.useraddress}</Text>
            <Text style={styles.text}>Food Confirm Status: {item.orderStatus ? "Completed" : "Pending"}</Text>
            <Text style={styles.text}>Deliver Status: {item.deliverStatus ? "Delivered" : "Not Delivered"}</Text>
            {
                item.orderStatus === false ? (
                    <TouchableOpacity style={{
                        backgroundColor:"#fff",
                        padding:20,
                        alignItems:"center",
                        justifyContent:"center",
                        margin:10,
                        borderRadius:20,
                    }}>
                        <Text style={{
                            fontSize:18,
                            fontWeight:"bold",
                            textTransform:"uppercase",
                        }}>Check And Confirm</Text>
                    </TouchableOpacity>
                ) : null
            }
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Orders:</Text>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

export default Order;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    text:{
        color:"#fff",
    }
});
