import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, Text, Alert, View, Button } from 'react-native';
import { useSelector } from "react-redux";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import { GetScheduleByCoachService, GetScheduleCreatedByUserIdService } from '../services/ScheduleService';
import { GetCoachClassesService, UpdateClassService } from '../services/ClassService';

export default function CoachClassDescription({ navigation, route }) {
    const state = useSelector((state) => state);
    const [sessionsList, setSessionsList] = useState([])
    const [sessions, setSessions] = useState([])
    const [selectedSessions, setSelectedSessions] = useState(route.params.classData.schedules)
    const schoolsList = state.authPage.auth_data?.assigned_schools.map(v => Object.assign(v, { key: v._id, value: v.school_name }))
    const [selectedSchool, setSelectedSchool] = useState()

    useEffect(() => {
        try {
            const getCoachSessions = async () => {
                const data = { coach_id: state.authPage.auth_data?.user_id, regional_manager_id: state.authPage.auth_data?.assigned_by_user_id }
                const result = await GetScheduleByCoachService(data);
                if (result) {
                    const arr = result.map(v => Object.assign(v, { key: v._id, value: `${v.date} (${v.start_time} to ${v.end_time})` }));
                    var newArr = arr.filter(function (objFromA) {
                        return !route.params.classData.schedules.find(function (objFromB) {
                            return objFromA._id === objFromB._id
                        })
                    })
                    setSessionsList(newArr)
                }
            };
            getCoachSessions();
        } catch (e) { }
    }, []);

    const handleUpdateClass = async () => {
        const selectedSessionsId = selectedSessions.map(v => { return v._id })
        const data = {
            schedules: selectedSessionsId.concat(sessions),
            school: selectedSchool
        };
        const result = await UpdateClassService(route.params.classData._id, data);
        if (result) {
            Alert.alert(
                "Alert",
                "Class Updated Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Coach Dashboard")
                    }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            {selectedSessions.map(v => {
                return (
                    <View>
                        <Text style={styles.label}>Schedules :</Text>
                        <Text>{v.date} ({v.start_time} to {v.end_time}) By {v.coaches.map(u => u.coach_name)}</Text>
                        <TouchableOpacity onPress={() => {
                            v.key = v._id;
                            v.value = `${v.date} (${v.start_time} to ${v.end_time})`
                            var array = [...selectedSessions];
                            var indexData = array.indexOf(v);
                            if (indexData !== -1) {
                                array.splice(indexData, 1);
                                setSelectedSessions(array);
                            }
                            setSessionsList(prevState => [...prevState, v]);
                        }}>
                            <Text>X</Text>
                        </TouchableOpacity>
                    </View>
                )
            })}
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
                defaultOption={{ key: route.params.classData.school._id, value: route.params.classData.school.school_name }}
            />
            <Button onPress={handleUpdateClass} title="Update Class" />
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