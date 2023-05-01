import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Button, Image, Alert, ScrollView, View } from "react-native";
import buddy from '../assets/buddy.png';
import { SelectList } from 'react-native-dropdown-select-list';
import { GetParticularRegionalManagerService, RegionalManagerUpdateService } from '../services/RegionalManagerService';

export default function SuperAdminRegionalManagerDescription({ navigation, route }) {
    const [regionalManagerData, setRegionalManagerData] = useState({
        regional_manager_user_id: "",
        email: "",
        password: "",
        regional_manager_name: "",
        assigned_region: ""
    });
    const regionList = [
        {
            key: "Region1",
            value: "Region1"
        },
        {
            key: "Region2",
            value: "Region2"
        },
        {
            key: "Region3",
            value: "Region3"
        },
        {
            key: "Region4",
            value: "Region4"
        }
    ];

    useEffect(() => {
        try {
            const getParticularRegionalManager = async () => {
                const result = await GetParticularRegionalManagerService(route.params.regional_manager._id);
                if (result) {
                    setRegionalManagerData({
                        regional_manager_user_id: result.user_id,
                        email: result.email,
                        password: result.password,
                        regional_manager_name: result.regional_manager_name,
                        assigned_region: result.assigned_region
                    });
                }
            };
            getParticularRegionalManager();
        } catch (e) { }
    }, []);

    const handleUpdateRegionalManager = async () => {
        try {
            const data = {
                email: regionalManagerData.email,
                password: regionalManagerData.password,
                regional_manager_name: regionalManagerData.regional_manager_name,
                assigned_region: regionalManagerData.assigned_region
            };
            console.log("route---->", data, regionalManagerData.regional_manager_user_id);
            const result = await RegionalManagerUpdateService(regionalManagerData.regional_manager_user_id, route.params.regional_manager._id, data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Regional Manager Updated Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("SuperAdmin Dashboard")
                        }
                    ]
                );
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't update Regional Manager!"
            );
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView style={styles.scrollView}>
                <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setRegionalManagerData({ ...regionalManagerData, email: e })}
                    value={regionalManagerData.email}
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setRegionalManagerData({ ...regionalManagerData, password: e })}
                    value={regionalManagerData.password}
                />
                <Text style={styles.label}>Regional Manager Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setRegionalManagerData({ ...regionalManagerData, regional_manager_name: e })}
                    value={regionalManagerData.regional_manager_name}
                />
                <Text style={styles.label}>Assigned Region</Text>
                <SelectList
                    setSelected={(val) => setRegionalManagerData({ ...regionalManagerData, assigned_region: val })}
                    data={regionList}
                    save="key"
                    defaultOption={{ key: regionalManagerData.assigned_region, value: regionalManagerData.assigned_region }}
                />
                <View style={{ marginTop: 20 }}>
                    <Button
                        title="Submit"
                        color="#000"
                        onPress={handleUpdateRegionalManager}
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
