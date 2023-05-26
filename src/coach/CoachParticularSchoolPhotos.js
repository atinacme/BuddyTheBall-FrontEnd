import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { GetParticularSchoolPhotosService } from '../services/SchoolService';
import LinearGradient from 'react-native-linear-gradient';

export default function CoachParticularSchoolPhotos({ navigation, route }) {
    const [customerData, setCustomerData] = useState([]);

    useEffect(() => {
        try {
            const getCustomers = async () => {
                const result = await GetParticularSchoolPhotosService(route.params.schoolItem._id);
                if (result) {
                    setCustomerData(result);
                }
            };
            getCustomers();
        } catch (e) { }
    }, [navigation]);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Photo Creation", { schoolId: route.params.schoolItem._id })}>
                        <Text style={styles.cta}>Create Customer Photo</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>{route.params.schoolItem.school_name}</Text>
                    <View style={styles.imgWrap}>
                        {customerData.length > 0 && customerData.map((item) => {
                            return (
                                <TouchableOpacity key={item._id} onPress={() => navigation.navigate("Parent Particular Photo", { photo: item })}>
                                    <Image key={item._id} source={{ uri: item.url }} style={{ height: 300, width: 300, marginBottom: 10 }} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("Coach Schools Photos")}>
                    <Text style={styles.backbtn}>Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 20,
    },
    label: {
        fontSize: 20,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        // fontFamily: 'LemonJuice'
    },
    imgWrap: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    cta: {
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#ed7d31',
        fontFamily: 'LemonJuice',
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        padding: 20
    },
    linearGradient: {
        flex: 1,
    },
    wrapper: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        marginBottom: 56,
        marginTop: 60
    },
    backbtn: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 5,
        position: 'absolute',
        display: 'flex',
        right: 0,
        width: 100,
        justifyContent: 'flex-end'
    },
});