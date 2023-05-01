import React, { useEffect, useState } from 'react';
import {
    SafeAreaView, StyleSheet, Text, Alert, View, Button, TextInput, Platform
} from 'react-native';
import { useSelector } from "react-redux";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CreateScheduleService } from '../services/ScheduleService';
import { GetAllCoachesService } from '../services/CoachService';

export default function SuperAdminScheduleCreation({ navigation }) {
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
            const getCoaches = async () => {
                const result = await GetAllCoachesService();
                if (result) {
                    setCoachList(result.map(v => Object.assign(v, { key: v._id, value: v.coach_name })));
                }
            };
            getCoaches();
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
        const data = {
            created_by: "superadmin",
            created_by_name: "Super Admin",
            created_by_user_id: state.authPage?.id,
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
                        onPress: () => navigation.navigate("SuperAdmin Dashboard")
                    }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Button onPress={showDatepicker} title="Select Date" />
            <Button onPress={showStartTimepicker} title="Select Start Time" />
            <Button onPress={showEndTimepicker} title="Select End Time" />
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
                    value={date}
                    mode={mode}
                    onChange={onChange}
                />
            )}
            <Button onPress={handleCreateSchedule} title="Create Schedule" />
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