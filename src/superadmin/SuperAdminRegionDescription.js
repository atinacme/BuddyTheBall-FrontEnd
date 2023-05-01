import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Button, Image, Alert, ScrollView, View, TouchableOpacity, Pressable } from "react-native";
import buddy from '../assets/buddy.png';
import { SelectList } from 'react-native-dropdown-select-list';
import { GetParticularSchoolService, SchoolUpdationService } from '../services/SchoolService';
import { GetParticularRegionService, RegionUpdateService } from '../services/RegionService';

export default function SuperAdminRegionDescription({ navigation, route }) {
    const [regionData, setRegionData] = useState({
        region_name: "",
        cities: []
    });

    useEffect(() => {
        try {
            const getParticularRegion = async () => {
                const result = await GetParticularRegionService(route.params.regionData._id);
                if (result) {
                    setRegionData({
                        region_name: result.region_name,
                        cities: result.cities
                    });
                }
            };
            getParticularRegion();
        } catch (e) { }
    }, []);

    const handleUpdateSchool = async () => {
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
                            onPress: () => navigation.navigate("SuperAdmin Settings")
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

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView style={styles.scrollView}>
                <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                <Text style={styles.label}>Region Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setRegionData({ ...regionData, region_name: e })}
                    value={regionData.region_name}
                />
                <Text style={styles.label}>Cities</Text>
                <TouchableOpacity onPress={() => setRegionData({ ...regionData, cities: [...regionData.cities, { name: '' }] })}>
                    <Text style={styles.label}>+</Text>
                </TouchableOpacity>
                {regionData.cities.length > 0 && regionData.cities.map((item, index) => {
                    return (
                        <View key={index}>
                            <TextInput
                                onChangeText={(e) => {
                                    let newArr = [...regionData.cities];
                                    newArr[index].name = e;
                                    setRegionData({ ...regionData, cities: newArr });
                                }}
                                value={item.name}
                                style={styles.input}
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
                <View style={{ marginTop: 20 }}>
                    <Button
                        title="Submit"
                        color="#000"
                        onPress={handleUpdateSchool}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
    },
    scrollView: {
        marginHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10
    },
    label: {
        fontSize: 18,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 0
    }
});
