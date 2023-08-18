import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, View } from 'react-native';
import { useSelector } from "react-redux";
import { DataTable } from 'react-native-paper';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { GetClassesService } from '../services/ClassService';

export default function CoachSchoolList({ navigation }) {
    const state = useSelector((state) => state);
    const [schedules, setSchedules] = useState([]);
    function getYear(timestamp) {
        return (new Date(timestamp * 1000)).getFullYear();
    }
    function getMon(timestamp) {
        return (new Date(timestamp * 1000)).getMonth();
    }
    function getDate(timestamp) {
        return (new Date(timestamp * 1000)).getDate();
    }

    useEffect(() => {
        const getClasses = async () => {
            try {
                const data = { created_by_user_id: state.authPage.auth_data?.user_id };
                const result = await GetClassesService(data);
                if (result) {
                    result.map(v => v.school.region === state.authPage.auth_data?.assigned_region);
                    result.forEach(u => {
                        u.schedules.forEach(v => {
                            console.log("ascdhgfsc----->", v.date, v.start_time, v.end_time);
                            var local = new Date(v.date).toLocaleDateString();
                            var newdate = local.split("/").reverse().join("-");
                            var timestamp = new Date(newdate).getTime() / 1000;
                            var startTime = moment(v.start_time, ["h:mm A"]).format("HH:mm");
                            var startTimeSplit = startTime.split(":");
                            var dateTimeStartString = new Date(getYear(timestamp), getMon(timestamp), getDate(timestamp), startTimeSplit[0], startTimeSplit[1]);
                            var parsedTimeStartString = Date.parse(dateTimeStartString);
                            var endTime = moment(v.end_time, ["h:mm A"]).format("HH:mm");
                            var endTimeSplit = endTime.split(":");
                            var dateTimeEndString = new Date(getYear(timestamp), getMon(timestamp), getDate(timestamp), endTimeSplit[0], endTimeSplit[1]);
                            var parsedTimeEndString = Date.parse(dateTimeEndString);
                            var parsedCurrentDateTimeString = Date.parse(moment().utcOffset("+05:30").format());
                            if (parsedCurrentDateTimeString >= parsedTimeStartString && parsedCurrentDateTimeString <= parsedTimeEndString) {
                                Object.assign(u, { session: 'current', date: v.date, start_time: v.start_time, end_time: v.end_time });
                                setSchedules([u]);
                            } else if (parsedCurrentDateTimeString <= parsedTimeStartString) {
                                Object.assign(u, { session: 'upcoming', date: v.date, start_time: v.start_time, end_time: v.end_time });
                                setSchedules(prevState => [...prevState, u]);
                            } else {
                                Object.assign(u, { session: 'completed', date: v.date, start_time: v.start_time, end_time: v.end_time });
                                setSchedules(prevState => [...prevState, u]);
                            }
                        });
                    });
                }
            }
            catch (e) { }
        };
        getClasses();
    }, []);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Text>CURRENT REGION: {state.authPage.auth_data?.assigned_region}</Text>
                    {schedules.length > 0 && schedules.map((item, index) => {
                        return (
                            <View key={index}>
                                {item.session === 'upcoming' ?
                                    <Text>UPCOMING SESSION: FALL - {item.date} - {item.start_time} {item.end_time}</Text>
                                    : item.session === 'current' ?
                                        <Text>CURRENT SESSION: FALL - {item.date} - {item.start_time} {item.end_time}</Text>
                                        :
                                        <Text>COMPLETED SESSION: FALL - {item.date} - {item.start_time} {item.end_time}</Text>
                                }
                                <DataTable style={styles.container}>
                                    <DataTable.Header style={styles.tableHeader}>
                                        {/* <DataTable.Title>DAY</DataTable.Title> */}
                                        <DataTable.Title>SCHOOL</DataTable.Title>
                                    </DataTable.Header>
                                    <TouchableOpacity key={item._id} onPress={() => item.session === 'current' ?
                                        navigation.navigate("Coach Particular School Students", { sessionItem: item })
                                        : item.session === 'upcoming' ? Alert.alert(
                                            "Alert",
                                            "You can Enter as the Session Starts!",
                                            [
                                                {
                                                    text: "OK"
                                                }
                                            ]
                                        ) : Alert.alert(
                                            "Alert",
                                            "You can't Enter as the Session is Completed!",
                                            [
                                                {
                                                    text: "OK"
                                                }
                                            ]
                                        )
                                    } style={styles.cachpicWrap}
                                    >
                                        <DataTable.Row>
                                            <DataTable.Cell>{item.school?.school_name}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                </DataTable>
                            </View>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("Coach Dashboard")}>
                    <Text style={styles.backbtn}>Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: 30
    },
    tableHeader: {
        backgroundColor: '#fff',
    },
    wrapper: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        marginBottom: 56,
        marginTop: 60
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
        // marginTop: 10,
        marginBottom: 10,
        position: 'absolute',
        display: 'flex',
        width: 325,
    },
    linearGradient: {
        flex: 1,
    },
});