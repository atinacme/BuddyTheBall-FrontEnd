import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useSelector } from "react-redux";
import { DataTable } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { GetCoachClassesService } from '../services/ClassService';

export default function CoachClasses({ navigation }) {
    const state = useSelector((state) => state);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        try {
            const getClasses = async () => {
                const data = { coach_id: state.authPage.auth_data?.user_id, regional_manager_id: state.authPage.auth_data?.assigned_by_user_id }
                const result = await GetCoachClassesService(data);
                if (result) {
                    setClasses(result);
                }
            };
            getClasses();
        } catch (e) { }
    }, []);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView horizontal>
                    <View>
                        <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title>CREATED BY</DataTable.Title>
                                <DataTable.Title>SESSIONS</DataTable.Title>
                                <DataTable.Title>SCHOOL</DataTable.Title>
                            </DataTable.Header>
                            {classes.length > 0 && classes.map(item => {
                                return (
                                    <TouchableOpacity key={item._id} onPress={() => item.created_by === 'coach' ?
                                        navigation.navigate("Coach Class Description", { classData: item })
                                        : Alert.alert(
                                            "Alert",
                                            "You can't Edit this!",
                                            [
                                                {
                                                    text: "OK"
                                                }
                                            ]
                                        )}>
                                        <DataTable.Row>
                                            <DataTable.Cell>{item.created_by_name === state.authPage.auth_data?.coach_name ? 'You' : item.created_by_name}</DataTable.Cell>
                                            {item.schedules.map(v => {
                                                return <DataTable.Cell>{v.date} ({v.start_time} to {v.end_time}) By {v.coaches.map(u => u.coach_name)}</DataTable.Cell>
                                            })}
                                            <DataTable.Cell>{item.school?.school_name}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                );
                            })}
                        </DataTable>
                    </View>
                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Class Creation")}>
                        <Text style={styles.coach_cta}>Class Creation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Dashboard")}>
                        <Text style={styles.backbtn}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    adminbtn: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        marginBottom: 10,
        width: '100%'
    },
    container: {
        margin: 10,
        borderColor: '#000',
        borderWidth: 1,
        overflow: 'scroll',
        width: 350,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'LemonJuice',
        fontSize: 12,
        backgroundColor: '#fff'
    },
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative'
    },
    tableHeader: {
        // backgroundColor: '#f3d8c6',
        textAlign: 'center',
        fontFamily: 'LemonJuice',
        // color: '#fff'
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    coach_cta: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        display: 'flex',
        width: 150,
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
        width: 150,
    }
});