import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, Text, Alert, View, Button, TextInput, Platform
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UpdateScheduleService } from '../services/ScheduleService';

export default function RegionalManagerScheduleDescription({ navigation, route }) {
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
            setInitialScheduleData({ ...initialScheduleData, start: true });
            setScheduleData({ ...scheduleData, start: currentDate });
        } else {
            setInitialScheduleData({ ...initialScheduleData, end: true });
            setScheduleData({ ...scheduleData, end: currentDate });
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

    const handleUpdateSchedule = async () => {
        const data = {
            date: initialScheduleData.date ? moment(scheduleData.date).format("YYYY-MM-DD") : date,
            start_time: initialScheduleData.start ? moment(scheduleData.start).format('h:mm A') : time.start,
            end_time: initialScheduleData.end ? moment(scheduleData.end).format('h:mm A') : time.end,
            topic: topic
        };
        const result = await UpdateScheduleService(route.params.scheduleData._id, data);
        if (result) {
            Alert.alert(
                "Alert",
                "Schedule Updated Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Regional Manager Dashboard")
                    }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Button onPress={showDatepicker} title="Update Date" />
            <Button onPress={showStartTimepicker} title="Update Start Time" />
            <Button onPress={showEndTimepicker} title="Update End Time" />
            <Text style={styles.label}>Date : {initialScheduleData.date ? moment(scheduleData.date).format("YYYY-MM-DD") : date}</Text>
            <Text style={styles.label}>Start Time : {initialScheduleData.start ? moment(scheduleData.start).format('h:mm A') : time.start}</Text>
            <Text style={styles.label}>End Time :{initialScheduleData.end ? moment(scheduleData.end).format('h:mm A') : time.end}</Text>
            {route.params.scheduleData.coaches.map((v, i) => {
                return <Text style={styles.label}>Coach {i + 1}  : {v.coach_name}</Text>
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
            <Button onPress={handleUpdateSchedule} title="Update Schedule" />
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