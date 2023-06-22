import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Alert, View, TouchableOpacity, TextInput, Platform, Image, ScrollView } from 'react-native';
import moment from 'moment';
import buddy from '../assets/buddy.png';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DeleteSessionService, UpdateSessionService } from '../services/SessionService';

export default function SuperAdminSessionDescription({ navigation, route }) {
    function add(date) {
        let dt = date === undefined ? new Date() : new Date(date);
        dt.setHours(dt.getHours() + 1);
        let endTime = dt;
        return endTime
    }
    const time = { start: route.params.scheduleData.start_time, end: route.params.scheduleData.end_time };
    const date = route.params.scheduleData.date;
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [showType, setShowType] = useState({
        date: false,
        startTime: false,
        endTime: false
    });
    const [scheduleData, setScheduleData] = useState({
        date: new Date(),
        start: new Date(),
        end: new Date()
    });
    const [initialScheduleData, setInitialScheduleData] = useState({
        date: false,
        start: false,
        end: false
    });
    const [topic, setTopic] = useState(route.params.scheduleData.topic);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        if (showType.date) {
            setInitialScheduleData({ ...initialScheduleData, date: true });
            setScheduleData({ ...scheduleData, date: currentDate });
        } else if (showType.startTime) {
            setInitialScheduleData({ ...initialScheduleData, start: true, end: true });
            const endTime = add(currentDate);
            setScheduleData({ ...scheduleData, start: currentDate, end: endTime });
        }
    };

    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(false);
            // for iOS, add a button that closes the picker
        }
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
        setShow(true);
        setShowType({ ...show, date: true });
    };

    const showStartTimepicker = () => {
        showMode('time');
        setShow(true);
        setShowType({ ...show, startTime: true });
    };

    // const showEndTimepicker = () => {
    //     showMode('time');
    //     setShow(true);
    //     setShowType({ ...show, endTime: true });
    // };

    const handleUpdateSchedule = async () => {
        if (topic) {
            const data = {
                date: initialScheduleData.date ? moment(scheduleData.date).format("YYYY-MM-DD") : date,
                start_time: initialScheduleData.start ? moment(scheduleData.start).format('h:mm A') : time.start,
                end_time: initialScheduleData.end ? moment(scheduleData.end).format('h:mm A') : time.end,
                topic: topic
            };
            const result = await UpdateSessionService(route.params.scheduleData._id, data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Session Updated Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Super Admin Dashboard")
                        }
                    ]
                );
            }
        }
    };

    const handleScheduleDelete = async () => {
        try {
            Alert.alert(
                "Alert",
                "Do You Want to Delete the Session ?",
                [
                    {
                        text: "YES",
                        onPress: async () => {
                            const data = { id: route.params.scheduleData._id }
                            const result = await DeleteSessionService(data)
                            if (result) {
                                Alert.alert(
                                    "Alert",
                                    "Session Deleted Successfully",
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
                "Failed! Can't Update Session!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <TouchableOpacity onPress={showDatepicker}>
                        <Text style={styles.btnWrapper}>Select Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showStartTimepicker}>
                        <Text style={styles.btnWrapper}>Select Start Time</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={showEndTimepicker}>
                        <Text style={styles.btnWrapper}>Select End Time</Text>
                    </TouchableOpacity> */}
                    <Text style={styles.label}>Date : {initialScheduleData.date ? moment(scheduleData.date).format("YYYY-MM-DD") : date}</Text>
                    <Text style={styles.label}>Start Time : {initialScheduleData.start ? moment(scheduleData.start).format('h:mm A') : time.start}</Text>
                    <Text style={styles.label}>End Time : {initialScheduleData.end ? moment(scheduleData.end).format('h:mm A') : time.end}</Text>
                    <Text style={styles.label}>Coach Names:</Text>
                    {route.params.scheduleData.coaches.map((v, i) => {
                        return <Text style={styles.label}>{v.coach_name}</Text>
                    })}
                    <View>
                        <Text style={styles.label}>Topic :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(val) => setTopic(val)}
                            value={topic}
                        />
                    </View>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={scheduleData.date}
                            mode={mode}
                            onChange={onChange}
                        />
                    )}
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleUpdateSchedule}>
                        <Text style={styles.btnWrapper}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 80 }}>
                    <TouchableOpacity onPress={handleScheduleDelete}>
                        <Text style={styles.deletebtn}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Sessions")}>
                        <Text style={styles.backbtn}>Back</Text>
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
    }
});