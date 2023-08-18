import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { GetParentsService } from '../services/ParentService';
import { useSelector } from "react-redux";

export default function SuperAdminParents({ navigation }) {
    const state = useSelector((state) => state);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const getCustomers = async () => {
            try {
                const result = await GetParentsService();
                if (result) {
                    setCustomers(result);
                }
            } catch (e) { }
        };
        getCustomers();
    }, []);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView horizontal>
                    <View>
                        <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title>PARENT</DataTable.Title>
                                <DataTable.Title>EMAIL</DataTable.Title>
                                <DataTable.Title>CREATED BY</DataTable.Title>
                            </DataTable.Header>
                            {customers.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => navigation.navigate("Super Admin Parent Description", { customerData: item })}>
                                        <DataTable.Row>
                                            <DataTable.Cell>{item.parent_name}</DataTable.Cell>
                                            <DataTable.Cell>{item.email}</DataTable.Cell>
                                            <DataTable.Cell>{item.created_by_user_id === state.authPage?.id ? 'You' : item.created_by === 'coach' ? item.created_by_name : item.created_by === 'regionalmanager' ? item.created_by_name : 'Shopify'}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                );
                            })}
                        </DataTable>
                    </View>
                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Parent Creation")}>
                        <Text style={styles.coach_cta}>Add New Parent</Text>
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
        width: 850,
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