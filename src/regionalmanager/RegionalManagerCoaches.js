import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSelector } from "react-redux";
import { DataTable } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { GetCoachesOfParticularRegionalManager } from '../services/RegionalManagerService';

export default function RegionalManagerCoaches({ navigation }) {
    const state = useSelector((state) => state);
    const [coaches, setCoaches] = useState([]);

    useEffect(() => {
        try {
            const getRegionalManagerCoaches = async () => {
                const result = await GetCoachesOfParticularRegionalManager(state.authPage.auth_data?.user_id);
                if (result) {
                    setCoaches(result);
                }
            };
            getRegionalManagerCoaches();
        } catch (e) { }
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
                            </DataTable.Header>
                            {coaches.map(item => {
                                return (
                                    <TouchableOpacity key={item._id} onPress={() => navigation.navigate("Regional Manager Coach Description", { coachData: item })}>
                                        <DataTable.Row>
                                            <DataTable.Cell>{item.coach_name}</DataTable.Cell>
                                            <DataTable.Cell>{item.assigned_region}</DataTable.Cell>
                                            <DataTable.Cell>{item.assigned_schools.length}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                );
                            })}
                        </DataTable>
                    </View>
                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Coach Creation")}>
                        <Text style={styles.coach_cta}>Coach Creation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Dashboard")}>
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