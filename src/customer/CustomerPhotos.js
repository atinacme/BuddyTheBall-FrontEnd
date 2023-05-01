import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from "react-redux";
import { GetParticularCustomerPhotosService } from '../services/CustomerService';
import LinearGradient from 'react-native-linear-gradient';

export default function CustomerPhotos({ navigation }) {
    const state = useSelector((state) => state);
    const [customerPhotos, setCustomerPhotos] = useState([]);

    useEffect(() => {
        try {
            const getCustomerPhotos = async () => {
                const result = await GetParticularCustomerPhotosService(state.authPage.auth_data?._id);
                if (result) {
                    setCustomerPhotos(result);
                }
            };
            getCustomerPhotos();
        } catch (e) { }
    }, [navigation]);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView>
                {/* <Text style={styles.label}>{state.authPage.auth_data?.school.school_name}</Text> */}
                <View style={styles.imgWrap}>
                    <ScrollView style={styles.scrollView}>
                        {customerPhotos.map(item => {
                            return (
                                <TouchableOpacity key={item._id} onPress={() => navigation.navigate("Customer Particular Photo", { photo: item })}>
                                    <Image key={item._id} source={{ uri: item.url }} style={{ height: 300, width: 300, marginTop: 10, marginBottom: 10 }} />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center'
    },
    scrollView: {
        marginHorizontal: 20,
    },
    imgWrap: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    linearGradient: {
        flex: 1,
    },
});