import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, View } from "react-native";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import buddy from '../assets/buddy.png';
import { GetRegionWiseSchools } from '../services/SchoolService';
import { SignUpService } from '../services/UserAuthService';
import LinearGradient from 'react-native-linear-gradient';
import { GetAllRegionsService } from '../services/RegionService';
import { useSelector } from 'react-redux';

export default function SuperAdminCoachCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [regions, setRegions] = useState([]);
    const [coachData, setCoachData] = useState({
        email: "",
        password: "",
        coach_name: "",
        assigned_region: "",
        tennis_club: "",
        favorite_pro_player: "",
        handed: "",
        favorite_drill: ""
    });

    useEffect(() => {
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

    const handleSignUp = async () => {
        try {
            if (coachData.email && coachData.password && coachData.coach_name && coachData.assigned_region && selected.length > 0 && coachData.tennis_club && coachData.favorite_pro_player && coachData.handed && coachData.favorite_drill) {
                const data = {
                    email: coachData.email,
                    password: coachData.password,
                    roles: ['coach'],
                    coach_name: coachData.coach_name,
                    assigned_region: coachData.assigned_region,
                    assigned_schools: selected,
                    assigned_by: 'Super Admin',
                    assigned_by_user_id: state.authPage?.id,
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
                                onPress: () => navigation.navigate("SuperAdmin Dashboard")
                            }
                        ]
                    );
                }
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
                    {!coachData.email &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Email is Required</Text>
                    }
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, password: e })}
                        value={coachData.password}
                    />
                    {!coachData.password &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Password is Required</Text>
                    }
                    <Text style={styles.label}>Coach Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, coach_name: e })}
                        value={coachData.coach_name}
                    />
                    {!coachData.coach_name &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Coach Name is Required</Text>
                    }
                    <Text style={styles.label}>Assigned Region</Text>
                    <SelectList
                        setSelected={async (val) => {
                            setCoachData({ ...coachData, assigned_region: val })
                            try {
                                const data = { region: val }
                                const result = await GetRegionWiseSchools(data);
                                result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                                setData(result);
                            } catch (e) { }
                        }}
                        data={regions}
                        save="value"
                    />
                    {!coachData.assigned_region &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Assigned Region is Required</Text>
                    }
                    <Text style={styles.label}>Assigned Schools</Text>
                    <MultipleSelectList
                        setSelected={(val) => setSelected(val)}
                        data={data}
                        save="value"
                    />
                    {selected.length === 0 &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Assigned Schools is Required</Text>
                    }
                    <Text style={styles.label}>Tennis Club</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, tennis_club: e })}
                        value={coachData.tennis_club}
                    />
                    {!coachData.tennis_club &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Tennis Club is Required</Text>
                    }
                    <Text style={styles.label}>Favourite Pro Player</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, favorite_pro_player: e })}
                        value={coachData.favorite_pro_player}
                    />
                    {!coachData.favorite_pro_player &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Favorite Pro Player is Required</Text>
                    }
                    <Text style={styles.label}>Handed</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, handed: e })}
                        value={coachData.handed}
                    />
                    {!coachData.handed &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Handed is Required</Text>
                    }
                    <Text style={styles.label}>Favourite Drill</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, favorite_drill: e })}
                        value={coachData.favorite_drill}
                    />
                    {!coachData.favorite_drill &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Favorite Drill is Required</Text>
                    }
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.btnWrapper}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Coaches")}>
                        <Text style={styles.btnWrapper}>Back</Text>
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
        padding: 15,
        justifyContent: 'flex-end'
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
