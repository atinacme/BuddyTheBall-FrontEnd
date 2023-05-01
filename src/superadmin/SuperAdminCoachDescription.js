import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Button, Image, Alert, ScrollView, View, Pressable, Modal } from "react-native";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import buddy from '../assets/buddy.png';
import { CoachUpdateService, GetParticularCoachService } from '../services/CoachService';
import { GetSchoolsService } from '../services/SchoolService';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

export default function SuperAdminCoachDescription({ navigation, route }) {
    const [coachData, setCoachData] = useState({
        coach_id: "",
        user_id: "",
        email: "",
        password: "",
        coach_name: "",
        assigned_territory: "",
        tennis_club: "",
        favorite_pro_player: "",
        handed: "",
        favorite_drill: ""
    });
    const [data, setData] = useState([]);
    const [coachSchools, setCoachSchools] = useState([]);
    const [assignedSchools, setAssignedSchools] = useState([]);
    const [assignedSlots, setAssignedSlots] = useState([]);
    const [selected, setSelected] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
    const [isStartDatePicked, setIsStartDatePicked] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [assignCal, setAssignCal] = useState({
        timePeriod: '',
        startDate: '',
        endDate: '',
        school: ''
    });
    console.log("xds--->", route.params.coach)
    const territoryList = [
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
                        assigned_territory: result.assigned_territory,
                        tennis_club: result.tennis_club,
                        favorite_pro_player: result.favorite_pro_player,
                        handed: result.handed,
                        favorite_drill: result.favorite_drill
                    });
                    setCoachSchools(result.assigned_schools.map(v => v.school_name));
                    setAssignedSchools(result.assigned_schools.map(v => { return { key: v._id, value: v.school_name }; }));
                    setAssignedSlots(result.assign_slot);
                }
            };
            getParticularCoach();
        } catch (e) { }
    }, []);

    useEffect(() => {
        try {
            const getAllSchools = async () => {
                const result = await GetSchoolsService();
                result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                var res = result.filter(function (item) {
                    return !assignedSchools.find(function (school) {
                        return item.key === school.key;
                    });
                });
                setData(res);
            };
            getAllSchools();
        } catch (e) { }
    }, [assignedSchools]);

    useEffect(() => {
        try {
            const getAllSlots = async () => {
                const result = await GetSchoolsService();
                result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                var res = result.filter(function (item) {
                    return !assignedSchools.find(function (school) {
                        return item.key === school.key;
                    });
                });
                setData(res);
            };
            getAllSlots();
        } catch (e) { }
    }, [assignedSchools]);

    function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
            let dateNew = moment(new Date(currentDate)).format('YYYY-MM-DD');
            dateArray.push(dateNew);
            currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
        dateArray.shift();
        return dateArray;
    }

    const onDayPress = (day) => {
        if (isStartDatePicked == false) {
            let markedDates = {};
            markedDates[day.dateString] = { startingDay: true, color: '#00B0BF', textColor: '#FFFFFF' };
            setMarkedDates(markedDates);
            setIsStartDatePicked(true);
            setStartDate(day.dateString);
            setAssignCal({ ...assignCal, startDate: day.dateString });
        } else {
            let endDate = moment(day.dateString);
            let range = endDate.diff(startDate, 'days');
            let allRange = dateRange(startDate, endDate);
            let currentDate = new Date(endDate);
            let utcEndDate = currentDate.setUTCDate(currentDate.getUTCDate());
            let newDate = moment(new Date(utcEndDate)).format('YYYY-MM-DD');
            allRange.push(newDate);
            if (range > 0) {
                for (let i = 0; i <= allRange.length - 1; i++) {
                    markedDates[allRange[i]] = { color: '#50cebb', textColor: '#FFFFFF' };
                }
                markedDates[Object.keys(markedDates)[Object.keys(markedDates).length - 1]] = { endingDay: true, color: '#00B0BF', textColor: '#FFFFFF' };
                setMarkedDates(markedDates);
                setIsStartDatePicked(false);
                setStartDate('');
                setAssignCal({ ...assignCal, timePeriod: markedDates, endDate: day.dateString });
            } else {
                alert('Select an upcomming date!');
            }
        }
    };

    const handleCreate = () => {
        setAssignedSlots(prevState => [...prevState, assignCal]);
        setModalVisible(!modalVisible);
        setMarkedDates([]);
        setAssignCal({
            timePeriod: '',
            startDate: '',
            endDate: '',
            school: ''
        });
    };

    const handleCoachUpdate = async () => {
        try {
            const data = {
                email: coachData.email,
                password: coachData.password,
                coach_name: coachData.coach_name,
                tennis_club: coachData.tennis_club,
                assigned_territory: coachData.assigned_territory,
                assigned_schools: coachSchools.concat(selected),
                assign_slot: assignedSlots,
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

    return (
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
                <Text style={styles.label}>Assigned Territory</Text>
                <SelectList
                    setSelected={(val) => setCoachData({ ...coachData, assigned_territory: val })}
                    data={territoryList}
                    save="key"
                    defaultOption={{ key: coachData.assigned_territory, value: coachData.assigned_territory }}
                />
                <Text style={styles.label}>Assigned Schools</Text>
                {assignedSchools.length > 0 && assignedSchools.map((item) => {
                    return (
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
                                }}>
                                <Text style={styles.agendaCrossBtn}>X</Text>
                            </Pressable>
                        </View>
                    );
                })}
                <MultipleSelectList
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save="value"
                    onSelect={() => alert(selected)}
                    label="Selected Schools"
                />
                <View style={{ flexDirection: 'row', textAlign: 'center', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.label}>Assign Period</Text>
                    <Pressable
                        style={[styles.plusButton, styles.buttonOpen]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textPlus}>+</Text>
                    </Pressable>
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <ScrollView style={styles.scrollView}>
                                    <View>
                                        <View style={styles.schoolList}>
                                            <SelectList
                                                setSelected={(val) => setAssignCal({ ...assignCal, school: val })}
                                                data={data}
                                                save="value"
                                            />
                                        </View>
                                        <View style={styles.container}>
                                            <Calendar
                                                minDate={Date()}
                                                monthFormat={"MMMM yyyy"}
                                                markedDates={markedDates}
                                                markingType="period"
                                                hideExtraDays={true}
                                                hideDayNames={true}
                                                onDayPress={onDayPress}
                                            />
                                        </View>
                                    </View>
                                    <Pressable
                                        style={[styles.button, styles.buttonOpen]}
                                        onPress={handleCreate}>
                                        <Text style={styles.textStyle}>Create</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => {
                                            setModalVisible(!modalVisible);
                                        }}>
                                        <Text style={styles.textStyle}>Don't Create !!</Text>
                                    </Pressable>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View>
                {assignedSlots.length > 0 && assignedSlots.map((item) => {
                    return (
                        <View style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text>{item.school}</Text>
                                <Text>{item.startDate} to {item.endDate}</Text>
                            </View>
                            <Pressable
                                style={[styles.agendaButton, styles.buttonClose]}
                                onPress={() => {
                                    setAssignedSlots(assignedSlots.filter((slot) => slot.startDate !== item.startDate));
                                }}>
                                <Text style={styles.agendaCrossBtn}>X</Text>
                            </Pressable>
                        </View>
                    );
                })}
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
                <Button
                    title="Update"
                    color="#000"
                    style={{ marginTop: 40, marginBottom: 40 }}
                    onPress={handleCoachUpdate}
                />
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
    }
});