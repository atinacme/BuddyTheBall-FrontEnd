import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Button, Image, Alert, ScrollView, View } from "react-native";
import buddy from '../assets/buddy.png';
import { SelectList } from 'react-native-dropdown-select-list';
import { GetParticularSchoolService, SchoolUpdationService } from '../services/SchoolService';
import { GetAllRegionsService } from '../services/RegionService';

export default function SuperAdminSchoolDescription({ navigation, route }) {
    const [schoolData, setSchoolData] = useState({
        school_id: "",
        school_name: "",
        region: "",
        assigned_day: "",
        address: ""
    });
    const [regions, setRegions] = useState([]);
    const regionList = [
        {
            key: "Kanpur",
            value: "Kanpur"
        },
        {
            key: "Lucknow",
            value: "Lucknow"
        },
        {
            key: "Allahabad",
            value: "Allahabad"
        },
        {
            key: "Banaras",
            value: "Banaras"
        }
    ];
    const dayList = [
        {
            key: "Monday",
            value: "Monday"
        },
        {
            key: "Tuesday",
            value: "Tuesday"
        },
        {
            key: "Wednesday",
            value: "Wednesday"
        },
        {
            key: "Thursday",
            value: "Thursday"
        },
        {
            key: "Friday",
            value: "Friday"
        },
        {
            key: "Saturday",
            value: "Saturday"
        },
        {
            key: "Sunday",
            value: "Sunday"
        }
    ];

    useEffect(() => {
        try {
            const getParticularCoach = async () => {
                const result = await GetParticularSchoolService(route.params.school._id);
                if (result) {
                    setSchoolData({
                        school_id: result._id,
                        school_name: result.school_name,
                        region: result.region,
                        assigned_day: result.assigned_day,
                        address: result.address
                    });
                }
            };
            getParticularCoach();
        } catch (e) { }
        try {
            const getRegions = async () => {
                const result = await GetAllRegionsService();
                if (result) {
                    result.map(v => Object.assign(v, { key: v.region_name, value: v.region_name }));
                    setRegions(result);
                }
            };
            getRegions();
        } catch (e) { }
    }, []);

    const handleUpdateSchool = async () => {
        try {
            const data = {
                school_name: schoolData.school_name,
                region: schoolData.region,
                assigned_day: schoolData.assigned_day,
                address: schoolData.address
            };
            const result = await SchoolUpdationService(schoolData.school_id, data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "School Updated Successfully",
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
                "Failed! Can't update School!"
            );
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView style={styles.scrollView}>
                <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                <Text style={styles.label}>School Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setSchoolData({ ...schoolData, school_name: e })}
                    value={schoolData.school_name}
                />
                <Text style={styles.label}>Region</Text>
                <SelectList
                    setSelected={(val) => setSchoolData({ ...schoolData, region: val })}
                    data={regions}
                    save="key"
                    defaultOption={{ key: schoolData.region, value: schoolData.region }}
                />
                <Text style={styles.label}>Assigned Day</Text>
                <SelectList
                    setSelected={(val) => setSchoolData({ ...schoolData, assigned_day: val })}
                    data={dayList}
                    save="key"
                    defaultOption={{ key: schoolData.assigned_day, value: schoolData.assigned_day }}
                />
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setSchoolData({ ...schoolData, address: e })}
                    value={schoolData.address}
                />
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
