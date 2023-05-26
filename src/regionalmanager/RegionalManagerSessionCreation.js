import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, Text, Alert, View, Image, TextInput, ScrollView, Platform } from 'react-native';
import { useSelector } from "react-redux";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import moment from 'moment';
import buddy from '../assets/buddy.png';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CreateScheduleService } from '../services/SessionService';
import { GetCoachesOfParticularRegionalManager } from '../services/RegionalManagerService';

export default function RegionalManagerSessionCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [coachList, setCoachList] = useState([]);
    const [time, setTime] = useState({ start: new Date(), end: new Date() });
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [showType, setShowType] = useState({
        date: false,
        startTime: false,
        endTime: false
    });
    const [topic, setTopic] = useState();
    const [coach, setCoach] = useState([]);

    useEffect(() => {
        try {
            const getRegionalManagerCoaches = async () => {
                const result = await GetCoachesOfParticularRegionalManager(state.authPage.auth_data?.user_id);
                if (result) {
                    setCoachList(result.map(v => Object.assign(v, { key: v._id, value: v.coach_name })));
                }
            };
            getRegionalManagerCoaches();
        } catch (e) { }
    }, []);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        if (showType.date) {
            setDate(currentDate);
        } else if (showType.startTime) {
            setTime({ ...time, start: currentDate });
        } else {
            setTime({ ...time, end: currentDate });
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

    const showEndTimepicker = () => {
        showMode('time');
        setShow(true);
        setShowType({ ...show, endTime: true });
    };

    const handleCreateSchedule = async () => {
        if (coach.length > 0 && topic) {
            const data = {
                created_by: "regionalmanager",
                created_by_name: state.authPage.auth_data?.regional_manager_name,
                created_by_user_id: state.authPage.auth_data?.user_id,
                coaches: coach,
                date: moment(date).format("YYYY-MM-DD"),
                start_time: moment(time.start).format('h:mm A'),
                end_time: moment(time.end).format('h:mm A'),
                topic: topic
            };
            const result = await CreateScheduleService(data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Schedule Added Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Regional Manager Dashboard")
                        }
                    ]
                );
            }
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
                    <TouchableOpacity onPress={showEndTimepicker}>
                        <Text style={styles.btnWrapper}>Select End Time</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>Date : {moment(date).format("YYYY-MM-DD")}</Text>
                    <Text style={styles.label}>Start Time : {moment(time.start).format('h:mm A')}</Text>
                    <Text style={styles.label}>End Time : {moment(time.end).format('h:mm A')}</Text>
                    <Text style={styles.label}>Coach :</Text>
                    <MultipleSelectList
                        setSelected={(val) => setCoach(val)}
                        data={coachList}
                        save="key"
                        label="Selected Coaches"
                    />
                    {coach.length === 0 &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Coach is Required</Text>
                    }
                    <Text style={styles.label}>Topic :</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => setTopic(val)}
                        value={topic}
                    />
                    {!topic &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Topic is Required</Text>
                    }
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            onChange={onChange}
                        />
                    )}
                    <TouchableOpacity onPress={handleCreateSchedule}>
                        <Text style={styles.btnWrapper}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Sessions")}>
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