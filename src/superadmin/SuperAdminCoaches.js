import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, ScrollView, TouchableOpacity, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import { GetAllCoachesService } from '../services/CoachService';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

export default function SuperAdminCoaches({ navigation }) {
    const state = useSelector((state) => state);
    const [coaches, setCoaches] = useState([]);

    useEffect(() => {
        const getCoaches = async () => {
            try {
                const result = await GetAllCoachesService();
                if (result) {
                    setCoaches(result);
                }
            } catch (e) { }
        };
        getCoaches();
    }, []);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView horizontal>
                    <View>
                        <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title>COACH</DataTable.Title>
                                <DataTable.Title>REGION</DataTable.Title>
                                <DataTable.Title>SCHOOL QTY</DataTable.Title>
                                <DataTable.Title>CREATED BY</DataTable.Title>
                            </DataTable.Header>
                            {coaches.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => navigation.navigate("SuperAdmin Coach Description", { coach: item })}>
                                        <DataTable.Row>
                                            <DataTable.Cell>{item.coach_name}</DataTable.Cell>
                                            <DataTable.Cell>{item.assigned_region}</DataTable.Cell>
                                            <DataTable.Cell>{item.assigned_schools.length}</DataTable.Cell>
                                            <DataTable.Cell>{item.assigned_by_user_id === state.authPage?.id ? "You" : item.assigned_by_name}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                );
                            })}
                        </DataTable>
                    </View>
                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Coach Creation")}>
                        <Text style={styles.coach_cta}>Add New Coach</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Dashboard")}>
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
        width: 650,
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