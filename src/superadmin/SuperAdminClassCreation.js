import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Alert, TouchableOpacity, Text, View, Image, TextInput } from 'react-native';
import buddy from '../assets/buddy.png';
import { useSelector } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import { GetSchedulesService } from '../services/SessionService';
import { CreateClassService } from '../services/ClassService';
import { GetSchoolsService } from '../services/SchoolService';

export default function SuperAdminClassCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [sessionsList, setSessionsList] = useState([])
    const [sessions, setSessions] = useState([])
    const [schoolsList, setSchoolsList] = useState([])
    const [selectedSchool, setSelectedSchool] = useState()
    const [topic, setTopic] = useState();

    useEffect(() => {
        try {
            const getSessions = async () => {
                const result = await GetSchedulesService();
                if (result) {
                    setSessionsList(result.map(v => Object.assign(v, { key: v._id, value: `${v.date} (${v.start_time} to ${v.end_time}) By ${v.coaches.map(u => u.coach_name)}` })));
                }
            };
            getSessions();

            const getSchools = async () => {
                const result = await GetSchoolsService()
                if (result) {
                    const schoolData = result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                    setSchoolsList(schoolData);
                }
            }
            getSchools()
        } catch (e) { }
    }, []);

    const handleCreateClass = async () => {
        if (sessions.length > 0 && selectedSchool && topic) {
            const data = {
                created_by: "superadmin",
                created_by_name: "Super Admin",
                created_by_user_id: state.authPage?._id,
                schedules: sessions,
                school: selectedSchool,
                topic: topic
            }
            const result = await CreateClassService(data)
            if (result) {
                Alert.alert(
                    "Alert",
                    "Class Added Successfully",
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

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                <View>
                    <Text style={styles.label}>Topic :</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => setTopic(val)}
                        value={topic}
                        placeholder='Topic'
                    />
                </View>
                {!topic &&
                    <Text style={{ fontSize: 10, color: 'red' }}>Topic is Required</Text>
                }
                <Text style={styles.label}>Sessions :</Text>
                <MultipleSelectList
                    setSelected={(val) => setSessions(val)}
                    data={sessionsList}
                    save="key"
                    label="Selected Sessions"
                />
                {sessions.length === 0 &&
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
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Classes")}>
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