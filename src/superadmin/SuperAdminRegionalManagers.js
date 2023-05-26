import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, TouchableOpacity, ScrollView, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { GetAllRegionalManagersService } from '../services/RegionalManagerService';

export default function SuperAdminRegionalManagers({ navigation }) {
    const [regionalManagers, setRegionalManagers] = useState([]);

    useEffect(() => {
        try {
            const getRegionalManagers = async () => {
                const result = await GetAllRegionalManagersService();
                if (result) {
                    setRegionalManagers(result);
                }
            };
            getRegionalManagers();
        } catch (e) { }
    }, []);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView horizontal>
                    <View>
                        <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title>REGIONAL MANAGER NAME</DataTable.Title>
                                <DataTable.Title>ASSIGNED REGION</DataTable.Title>
                            </DataTable.Header>
                            {regionalManagers.map(item => {
                                return (
                                    <TouchableOpacity key={item._id} onPress={() => navigation.navigate("Super Admin Regional Manager Description", { regional_manager: item })}>
                                        <DataTable.Row>
                                            <DataTable.Cell>{item.regional_manager_name}</DataTable.Cell>
                                            <DataTable.Cell>{item.assigned_region}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                );
                            })}
                        </DataTable>
                    </View>

                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Regional Manager Creation")}>
                        <Text style={styles.coach_cta}>Add New Regional Manager</Text>
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