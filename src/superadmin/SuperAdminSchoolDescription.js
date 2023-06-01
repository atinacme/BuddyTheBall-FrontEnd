import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, View, TouchableOpacity } from "react-native";
import buddy from '../assets/buddy.png';
import { SelectList } from 'react-native-dropdown-select-list';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { DeleteSchoolService, GetParticularSchoolService, SchoolUpdationService } from '../services/SchoolService';
import { GetAllRegionsService } from '../services/RegionService';

export default function SuperAdminSchoolDescription({ navigation, route }) {
    const [schoolData, setSchoolData] = useState({
        school_id: "",
        school_name: "",
        region: "",
        director_name: "",
        director_email: "",
        director_phone: "",
        address: "",
        time: ""
    });
    const [regions, setRegions] = useState([]);
    const [classesId, setClassesId] = useState([]);
    const [schedulesId, setSchedulesId] = useState([]);

    useEffect(() => {
        try {
            const getParticularCoach = async () => {
                const result = await GetParticularSchoolService(route.params.school._id);
                if (result) {
                    setSchoolData({
                        school_id: result._id,
                        school_name: result.school_name,
                        region: result.region,
                        director_name: result.director_name,
                        director_email: result.director_email,
                        director_phone: result.director_phone,
                        address: result.address,
                        time: result.time
                    });
                }
            };
            getParticularCoach();

            const getRegions = async () => {
                const result = await GetAllRegionsService();
                if (result) {
                    result.map(v => Object.assign(v, { key: v.region_name, value: v.region_name }));
                    setRegions(result);
                }
            };
            getRegions();

            var arr1 = []
            route.params.school.classes.forEach(v => {
                const arr = [...v.schedules]
                arr1.push(arr)
                setClassesId(prevState => [...prevState, v._id])
            })
            const arrOfObj = arr1.reduce((acc, curr) => {
                return [...acc, ...curr];
            }, []);
            var ids = [];
            arrOfObj.forEach(v => ids.push(v._id))
            setSchedulesId([...new Set(ids)])
        } catch (e) { }
    }, []);

    const handleUpdateSchool = async () => {
        try {
            if (schoolData.school_name && schoolData.region && schoolData.director_name && schoolData.director_email && schoolData.director_phone && schoolData.address) {
                const data = {
                    school_name: schoolData.school_name,
                    region: schoolData.region,
                    director_name: schoolData.director_name,
                    director_email: schoolData.director_email,
                    director_phone: schoolData.director_phone,
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
                                onPress: () => navigation.navigate("Super Admin Dashboard")
                            }
                        ]
                    );
                }
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't update School!"
            );
        }
    };

    const handleSchoolDelete = async () => {
        try {
            Alert.alert(
                "Alert",
                "Do You Want to Delete the School ?",
                [
                    {
                        text: "YES",
                        onPress: async () => {
                            const data = { id: schoolData.school_id, classes: classesId, schedules: schedulesId }
                            const result = await DeleteSchoolService(data)
                            if (result) {
                                Alert.alert(
                                    "Alert",
                                    "School Deleted Successfully",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => navigation.navigate("Super Admin Dashboard")
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
                "Failed! Can't Update School!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <Text style={styles.label}>School Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setSchoolData({ ...schoolData, school_name: e })}
                        value={schoolData.school_name}
                    />
                    {!schoolData.school_name &&
                        <Text style={{ fontSize: 10, color: 'red' }}>School Name is Required</Text>
                    }
                    <Text style={styles.label}>Region</Text>
                    <SelectList
                        setSelected={(val) => setSchoolData({ ...schoolData, region: val })}
                        data={regions}
                        save="key"
                        defaultOption={{ key: schoolData.region, value: schoolData.region }}
                    />
                    {!schoolData.region &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Region is Required</Text>
                    }
                    <Text style={styles.label}>Director Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setSchoolData({ ...schoolData, director_name: e })}
                        value={schoolData.director_name}
                    />
                    {!schoolData.director_name &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Director Name is Required</Text>
                    }
                    <Text style={styles.label}>Director Email</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setSchoolData({ ...schoolData, director_email: e })}
                        value={schoolData.director_email}
                    />
                    {!schoolData.director_email &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Director Email is Required</Text>
                    }
                    <Text style={styles.label}>Director Phone</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setSchoolData({ ...schoolData, director_phone: e })}
                        value={schoolData.director_phone}
                    />
                    {!schoolData.director_phone &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Director Phone is Required</Text>
                    }
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setSchoolData({ ...schoolData, address: e })}
                        value={schoolData.address}
                    />
                    {!schoolData.address &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Address is Required</Text>
                    }
                    <Text style={styles.label}>Registered On</Text>
                    <TextInput
                        style={styles.input}
                        value={moment(schoolData.time).format("YYYY-MM-DD h:mm A")}
                    />
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity onPress={handleUpdateSchool}>
                            <Text style={styles.btnWrapper}>Update</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 80 }}>
                        <TouchableOpacity onPress={handleSchoolDelete}>
                            <Text style={styles.deletebtn}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Schools")}>
                            <Text style={styles.backbtn}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative',
        padding: 15,
        justifyContent: 'flex-end'
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
});
