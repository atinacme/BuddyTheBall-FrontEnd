import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from "react-redux";
import { GetParticularCustomerPhotosService } from '../services/ParentService';
import LinearGradient from 'react-native-linear-gradient';

export default function ParentPhotos({ navigation }) {
    const state = useSelector((state) => state);
    const [customerPhotos, setCustomerPhotos] = useState([]);

    useEffect(() => {
        const getCustomerPhotos = async () => {
            try {
                const result = await GetParticularCustomerPhotosService(state.authPage.auth_data?._id);
                if (result) {
                    setCustomerPhotos(result);
                }
            } catch (e) { }
        };
        getCustomerPhotos();
    }, [navigation]);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.imgWrap}>
                    <ScrollView style={styles.scrollView}>
                        {customerPhotos.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => navigation.navigate("Parent Particular Photo", { photo: item })}>
                                    <Image key={item._id} source={{ uri: item.url }} style={{ height: 300, width: 300, marginTop: 10, marginBottom: 10 }} />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Parent Dashboard")}>
                        <Text style={styles.btnWrapper}>Back</Text>
                    </TouchableOpacity>
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
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative',
        padding: 15,
        justifyContent: 'flex-end'
    },
    btnWrapper: {
        borderColor: "#fff",
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 10,
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