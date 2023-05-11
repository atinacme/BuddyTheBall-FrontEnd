import React, { useEffect, useState } from 'react';
import {
    SafeAreaView, StyleSheet, Alert, Text, Image, TouchableOpacity, View
} from 'react-native';
import buddy from '../assets/buddy.png';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from "react-redux";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import { GetSchedulesService } from '../services/ScheduleService';
import { CreateClassService } from '../services/ClassService';

export default function CoachClassCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [sessionsList, setSessionsList] = useState([])
    const [sessions, setSessions] = useState([])
    const schoolsList = state.authPage.auth_data?.assigned_schools.map(v => Object.assign(v, { key: v._id, value: v.school_name }))
    const [selectedSchool, setSelectedSchool] = useState()

    useEffect(() => {
        try {
            const getSchedules = async () => {
                const result = await GetSchedulesService();
                if (result) {
                    result.map(v => {
                        if (v?.coaches?.some(element => element._id === state.authPage.auth_data?._id) === true) {
                            Object.assign(v, { key: v._id, value: `${v.date} (${v.start_time} to ${v.end_time})` })
                        }
                    });
                    setSessionsList(result)
                }
            };
            getSchedules();
        } catch (e) { }
    }, []);

    const handleCreateClass = async () => {
        if (sessions !== undefined && sessions.length > 0 && selectedSchool) {
            const data = {
                created_by: "coach",
                created_by_name: state.authPage.auth_data?.coach_name,
                created_by_user_id: state.authPage.auth_data?.user_id,
                schedules: sessions,
                school: selectedSchool
            }
            const result = await CreateClassService(data)
            if (result) {
                Alert.alert(
                    "Alert",
                    "Class Added Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Coach Dashboard")
                        }
                    ]
                );
            }
        }
    }

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                <Text style={styles.label}>Schedules :</Text>
                <MultipleSelectList
                    setSelected={(val) => setSessions(val)}
                    data={sessionsList}
                    save="key"
                    label="Selected Sessions"
                />
                {(sessions == undefined || sessions?.length === 0) &&
                    <Text style={{ fontSize: 10, color: 'red' }}>Session is Required</Text>
                }
                <Text style={styles.label}>School :</Text>
                <SelectList
                    setSelected={(val) => setSelectedSchool(val)}
                    data={schoolsList}
                    save="key"
                />
                {!selectedSchool &&
                    <Text style={{ fontSize: 10, color: 'red' }}>School is Required</Text>
                }
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleCreateClass}>
                        <Text style={styles.btnWrapper}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Classes")}>
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
        padding: 15
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
    }
});