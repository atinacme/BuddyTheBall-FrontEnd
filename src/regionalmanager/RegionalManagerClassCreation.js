import React, { useEffect, useState } from 'react';
import {
    SafeAreaView, StyleSheet, Alert, Button, Text
} from 'react-native';
import { useSelector } from "react-redux";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import { GetScheduleCreatedByUserIdService } from '../services/ScheduleService';
import { CreateClassService } from '../services/ClassService';
import { GetRegionWiseSchools } from '../services/SchoolService';

export default function RegionalManagerClassCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [sessionsList, setSessionsList] = useState([])
    const [sessions, setSessions] = useState([])
    const [schoolsList, setSchoolsList] = useState([])
    const [selectedSchool, setSelectedSchool] = useState()

    useEffect(() => {
        try {
            const getRegionalManagerSessions = async () => {
                const result = await GetScheduleCreatedByUserIdService(state.authPage.auth_data?.user_id);
                if (result) {
                    setSessionsList(result.map(v => Object.assign(v, { key: v._id, value: `${v.date} (${v.start_time} to ${v.end_time}) By ${v.coaches.map(u => u.coach_name)}` })));
                }
            };
            getRegionalManagerSessions();

            const getRegionWiseSchools = async () => {
                const data = { region: state.authPage.auth_data?.assigned_region };
                const result = await GetRegionWiseSchools(data)
                if (result) {
                    const schoolData = result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                    setSchoolsList(schoolData);
                }
            }
            getRegionWiseSchools()
        } catch (e) { }
    }, []);

    const handleCreateClass = async () => {
        const data = {
            created_by: "regionalmanager",
            created_by_name: state.authPage.auth_data?.regional_manager_name,
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
                        onPress: () => navigation.navigate("Regional Manager Dashboard")
                    }
                ]
            );
        }
    }

    return (
        <SafeAreaView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text style={styles.label}>Schedules :</Text>
            <MultipleSelectList
                setSelected={(val) => setSessions(val)}
                data={sessionsList}
                save="key"
                label="Selected Sessions"
            />
            <Text style={styles.label}>School :</Text>
            <SelectList
                setSelected={(val) => setSelectedSchool(val)}
                data={schoolsList}
                save="key"
            />
            <Button onPress={handleCreateClass} title="Create Class" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    scrollView: {
        marginHorizontal: 20,
        marginVertical: 20,
        maxHeight: 190
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10,
        width: 180
    },
    item: {
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    itemText: {
        color: '#888',
        fontSize: 16,
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
    mainText: {
        marginRight: 40
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
    modalText: {
        marginBottom: 15,
        flexDirection: 'row'
    },
    schoolList: {
        width: 225,
        marginTop: 10,
        marginBottom: 10
    },
    itemTextFirst: {
        color: 'black'
    }
});