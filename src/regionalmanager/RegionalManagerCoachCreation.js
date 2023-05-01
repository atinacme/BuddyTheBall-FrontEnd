import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import buddy from '../assets/buddy.png';
import { GetRegionWiseSchools } from '../services/SchoolService';
import { SignUpService } from '../services/UserAuthService';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

export default function RegionalManagerCoachCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [coachData, setCoachData] = useState({
        email: "",
        password: "",
        coach_name: "",
        assigned_region: state.authPage.auth_data?.assigned_region,
        tennis_club: "",
        favorite_pro_player: "",
        handed: "",
        favorite_drill: ""
    });

    useEffect(() => {
        try {
            const getAllSchools = async () => {
                const data = { region: state.authPage.auth_data?.assigned_region };
                const result = await GetRegionWiseSchools(data);
                result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                setData(result);
            };
            getAllSchools();
        } catch (e) { }
    }, []);

    const handleSignUp = async () => {
        try {
            const data = {
                email: coachData.email,
                password: coachData.password,
                roles: ['coach'],
                coach_name: coachData.coach_name,
                assigned_region: state.authPage.auth_data?.assigned_region,
                assigned_schools: selected,
                assigned_by: 'Regional Manager',
                assigned_by_user_id: state.authPage.auth_data?.user_id,
                tennis_club: coachData.tennis_club,
                favorite_pro_player: coachData.favorite_pro_player,
                handed: coachData.handed,
                favorite_drill: coachData.favorite_drill
            };
            const result = await SignUpService(data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Coach Added Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Regional Manager Dashboard")
                        }
                    ]
                );
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Email is already in use!"
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
                    <Text style={styles.label}>Assigned Schools</Text>
                    <MultipleSelectList
                        setSelected={(val) => setSelected(val)}
                        data={data}
                        save="value"
                        onSelect={() => alert(selected)}
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
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.btnWrapper}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 15,
        marginTop: 60,
    },
    heading: {
        textAlign: "center",
        fontSize: 18,
        padding: 20
    },
    linearGradient: {
        flex: 1,
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
    scrollView: {
        marginHorizontal: 10
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
        backgroundColor: '#ed7d31'
    },
    plusButton: {
        borderRadius: 50,
        elevation: 2,
        width: 30,
        height: 30,
        alignItems: 'center',
        backgroundColor: '#ed7d31'
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
    }
});
