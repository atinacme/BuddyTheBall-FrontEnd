import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, View, Pressable, Modal } from "react-native";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import buddy from '../assets/buddy.png';
import { CoachUpdateService, DeleteCoachService, GetParticularCoachService } from '../services/CoachService';
import { GetRegionWiseSchools } from '../services/SchoolService';
import { GetAllRegionsService } from '../services/RegionService';

export default function SuperAdminCoachDescription({ navigation, route }) {
    const [coachData, setCoachData] = useState({
        coach_id: "",
        user_id: "",
        email: "",
        password: "",
        coach_name: "",
        assigned_region: "",
        tennis_club: "",
        favorite_pro_player: "",
        handed: "",
        favorite_drill: ""
    });
    const [data, setData] = useState([]);
    const [regions, setRegions] = useState([]);
    const [coachSchools, setCoachSchools] = useState([]);
    const [assignedSchools, setAssignedSchools] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        try {
            const getParticularCoach = async () => {
                const result = await GetParticularCoachService(route.params.coach._id);
                if (result) {
                    setCoachData({
                        coach_id: result._id,
                        user_id: result.user_id,
                        email: result.email,
                        password: result.password,
                        coach_name: result.coach_name,
                        assigned_region: result.assigned_region,
                        tennis_club: result.tennis_club,
                        favorite_pro_player: result.favorite_pro_player,
                        handed: result.handed,
                        favorite_drill: result.favorite_drill
                    });
                    setCoachSchools(result.assigned_schools.map(v => v.school_name));
                    setAssignedSchools(result.assigned_schools.map(v => { return { ...v, key: v._id, value: v.school_name }; }));
                    const data = { region: result.assigned_region }
                    const result1 = await GetRegionWiseSchools(data);
                    result1.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                    var c = result1.filter(function (objFromA) {
                        return assignedSchools.find(function (objFromB) {
                            return objFromA.key === objFromB.key
                        })
                    })
                    setData(c);
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
        } catch (e) { }
    }, []);

    const handleCoachUpdate = async () => {
        try {
            const data = {
                email: coachData.email,
                password: coachData.password,
                coach_name: coachData.coach_name,
                assigned_region: coachData.assigned_region,
                assigned_schools: coachSchools.concat(selected),
                tennis_club: coachData.tennis_club,
                favorite_pro_player: coachData.favorite_pro_player,
                handed: coachData.handed,
                favorite_drill: coachData.favorite_drill
            };
            const result = await CoachUpdateService(coachData.user_id, coachData.coach_id, data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Coach Updated Successfully",
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
                "Failed! Can't Update Coach!"
            );
        }
    };

    const handleCoachDelete = async () => {
        try {
            Alert.alert(
                "Alert",
                "Do You Want to Delete the Coach ?",
                [
                    {
                        text: "YES",
                        onPress: async () => {
                            const data = { id: route.params.coach._id, user_id: coachData.user_id }
                            const result = await DeleteCoachService(data)
                            if (result) {
                                Alert.alert(
                                    "Alert",
                                    "Coach Deleted Successfully",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => navigation.navigate("SuperAdmin Dashboard")
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
                "Failed! Can't Update Coach!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, email: e })}
                        value={coachData.email}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, password: e })}
                        value={coachData.password}
                    />
                    <Text style={styles.label}>Coach Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, coach_name: e })}
                        value={coachData.coach_name}
                    />
                    <Text style={styles.label}>Assigned Region</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={regions}
                        search
                        maxHeight={300}
                        labelField="value"
                        valueField="key"
                        searchPlaceholder="Search..."
                        value={coachData.assigned_region}
                        onChange={async (val) => {
                            setCoachData({ ...coachData, assigned_region: val.region_name })
                            const data = { region: val.region_name }
                            const result = await GetRegionWiseSchools(data);
                            result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                            var c = result.filter(function (objFromA) {
                                return !assignedSchools.find(function (objFromB) {
                                    return objFromA.key === objFromB.key
                                })
                            })
                            setData(c);
                            setAssignedSchools([])
                            setCoachSchools([])
                        }}
                    />
                    <Text style={styles.label}>Assigned Schools</Text>
                    {assignedSchools.length > 0 && assignedSchools.map((item) => {
                        return (
                            <>
                                {item.region === coachData.assigned_region && (
                                    <View key={item.key} style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text>{item.value}</Text>
                                        </View>
                                        <Pressable
                                            style={[styles.agendaButton, styles.buttonClose]}
                                            onPress={() => {
                                                setAssignedSchools(assignedSchools.filter((school) => school.key !== item.key));
                                                setCoachSchools(coachSchools.filter((school) => school !== item.value));
                                                setData(prevState => [...prevState, item])
                                            }}>
                                            <Text style={styles.agendaCrossBtn}>X</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </>
                        );
                    })}
                    <MultipleSelectList
                        setSelected={(val) => setSelected(val)}
                        data={data}
                        save="value"
                        label="Selected Schools"
                    />
                    <Text style={styles.label}>Tennis Club</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, tennis_club: e })}
                        value={coachData.tennis_club}
                    />
                    <Text style={styles.label}>Favourite Pro Player</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, favorite_pro_player: e })}
                        value={coachData.favorite_pro_player}
                    />
                    <Text style={styles.label}>Handed</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, handed: e })}
                        value={coachData.handed}
                    />
                    <Text style={styles.label}>Favourite Drill</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, favorite_drill: e })}
                        value={coachData.favorite_drill}
                    />
                    <TouchableOpacity onPress={handleCoachUpdate}>
                        <Text style={styles.submit}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCoachDelete}>
                        <Text style={styles.submit}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Coaches")}>
                        <Text style={styles.submit}>Back</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
    },
    scrollView: {
        marginHorizontal: 20,
    },
    submit: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 5,
        display: 'flex',
        justifyContent: 'flex-end'
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
    linearGradient: {
        flex: 1,
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
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 5
    },
    agendaButton: {
        borderRadius: 50,
        elevation: 2,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    agendaCrossBtn: {
        fontSize: 15,
    },
    buttonOpen: {
        backgroundColor: '#2196F3'
    },
    plusButton: {
        borderRadius: 50,
        elevation: 2,
        width: 30,
        height: 30,
        alignItems: 'center'
    },
    textPlus: {
        fontSize: 20,
    },
    buttonClose: {
        backgroundColor: 'red'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    schoolList: {
        width: 225,
        marginTop: 10,
        marginBottom: 10
    },
    dropdown: {
        margin: 16,
        height: 40,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        height: 40
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});