import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, View, TouchableOpacity, Pressable } from "react-native";
import buddy from '../assets/buddy.png';
import LinearGradient from 'react-native-linear-gradient';
import { DeleteRegionService, GetParticularRegionService, RegionUpdateService } from '../services/RegionService';

export default function SuperAdminRegionDescription({ navigation, route }) {
    const [regionData, setRegionData] = useState({
        region_name: "",
        cities: []
    });

    useEffect(() => {
        const getParticularRegion = async () => {
            try {
                const result = await GetParticularRegionService(route.params.regionData._id);
                if (result) {
                    setRegionData({
                        region_name: result.region_name,
                        cities: result.cities
                    });
                }
            } catch (e) { }
        };
        getParticularRegion();
    }, []);

    const handleUpdateRegion = async () => {
        try {
            const data = {
                region_name: regionData.region_name,
                cities: regionData.cities
            };
            const result = await RegionUpdateService(route.params.regionData._id, data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Region Updated Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Super Admin Settings")
                        }
                    ]
                );
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't update Region!"
            );
        }
    };

    const handleRegionDelete = async () => {
        try {
            Alert.alert(
                "Alert",
                "Do You Want to Delete the Region ?",
                [
                    {
                        text: "YES",
                        onPress: async () => {
                            const data = { id: route.params.regionData._id };
                            const result = await DeleteRegionService(data);
                            if (result) {
                                Alert.alert(
                                    "Alert",
                                    "Region Deleted Successfully",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => navigation.navigate("Super Admin Settings")
                                        }
                                    ]
                                );
                            }
                        }
                    }
                ]
            );
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't Update Region!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <Text style={styles.label}>Region Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setRegionData({ ...regionData, region_name: e })}
                        value={regionData.region_name}
                    />
                    <View style={styles.cities}>
                        <Text style={styles.label}>Cities</Text>
                        <TouchableOpacity onPress={() => setRegionData({ ...regionData, cities: [...regionData.cities, { name: '' }] })}>
                            <Text style={styles.plusBtn} >+</Text>
                        </TouchableOpacity>
                    </View>
                    {regionData.cities.length > 0 && regionData.cities.map((item, index) => {
                        return (
                            <View key={index} style={styles.cities}>
                                <TextInput
                                    onChangeText={(e) => {
                                        let newArr = [...regionData.cities];
                                        newArr[index].name = e;
                                        setRegionData({ ...regionData, cities: newArr });
                                    }}
                                    value={item.name}
                                    style={styles.cityInput}
                                />
                                <Pressable
                                    style={[styles.agendaButton, styles.buttonClose]}
                                    onPress={() => {
                                        var array = [...regionData.cities];
                                        var indexData = array.indexOf(item);
                                        if (indexData !== -1) {
                                            array.splice(indexData, 1);
                                            setRegionData({ ...regionData, cities: array });
                                        }
                                    }}>
                                    <Text style={styles.agendaCrossBtn}>X</Text>
                                </Pressable>
                            </View>
                        );
                    })}
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleUpdateRegion}>
                        <Text style={styles.btnWrapper}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 80 }}>
                    <TouchableOpacity onPress={handleRegionDelete}>
                        <Text style={styles.deletebtn}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Regions")}>
                        <Text style={styles.backbtn}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative',
        padding: 15
    },
    deletebtn: {
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
        left: 0,
        width: 100,
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 10
    },
    plusBtn: {
        borderColor: "#fff",
        padding: 3,
        textAlign: "center",
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 50,
        width: 30,
        height: 30
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
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 10
    },
    linearGradient: {
        flex: 1,
        borderRadius: 5
    },
    scrollView: {
        marginHorizontal: 5,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10
    },
    label: {
        fontSize: 16,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 5
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
        marginTop: 10
    },
    agendaButton: {
        borderRadius: 50,
        elevation: 2,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonClose: {
        backgroundColor: 'red'
    },
    agendaCrossBtn: {
        fontSize: 15,
    },
    cities: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cityInput: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10,
        width: 270
    }
});