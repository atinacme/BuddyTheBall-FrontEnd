import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableHighlight, TouchableOpacity, ScrollView, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { GetCustomersOfParticularCoachOfParticularSchool } from '../services/CoachService';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';

export default function SuperAdminBillingCoachSchool({ navigation, route }) {
    const [customerData, setCustomerData] = useState([]);

    useEffect(() => {
        try {
            const handleCustomers = async () => {
                const result = await GetCustomersOfParticularCoachOfParticularSchool(route.params.coach._id, route.params.school._id);
                if (result) {
                    var customer_data = [];
                    result.forEach(v => {
                        const data = v.children_data.map(u => Object.assign(u, { customer_user_id: v.user_id, customer_id: v._id, email: v.email, parent_name: v.parent_name }));
                        customer_data.push(...data);
                    });
                    var sessionWise = Object.values(customer_data.reduce((acc, item) => {
                        acc[item.slot] ? acc[item.slot].cells.push({ child: item }) : (acc[item.slot] = { slot: item.slot, cells: [{ child: item }] });
                        return acc;
                    }, {}));
                    setCustomerData(sessionWise);
                }
            };
            handleCustomers();
        } catch (e) { }
    }, []);

    const htmltable = () => {
        let t = '';
        for (let i in customerData) {
            const v = customerData[i];
            for (let u in v.cells) {
                const item = v.cells[u];
                t = t +
                    `<tr>
                <td>${item.child.player_name}</td>
                <td>${item.child._id}</td>
                <td>${item.child.total_present === null ? 0 : item.child.total_present}</td>
                <td>${item.child.total_absent === null ? 0 : item.child.total_absent}</td>
            </tr>`;
            }
        }
        return t;
    };
    async function createPDF() {
        let options = {
            html: `
            <div style="display: flex; flex-direction: column;">
            <table border='1'>
                <tr>
                    <th>School #</th>
                    <th>Date MM/DD/YY: ${moment().format('MM/DD/YY')}-${moment(new Date().setDate(new Date().getDate() + 30)).format('MM/DD/YY')}</th>
                </tr>
                <tr>
                    <td>Vendor: Buddy the Ball</td>
                    <td>Vendor Coach/Instructor: ${route.params.coach.coach_name}</td>
                </tr>
            </table>
            <br/><br/>
            <table border='1'>
                <tr>
                    <th>Child Name</th>
                    <th>Child ID</th>
                    <th>Attended</th>
                    <th>Absent</th>
                </tr>
                ${htmltable()}
            </table>
            <br/><br/>
            <table border='1'>
                <tr>
                    <th>Vendor Signature:</th>
                    <th>Date:</th>
                </tr>
                <tr>
                    <th>School Management Signature:</th>
                    <th>Date:</th>
                </tr>
            </table>
            </div>
            `,
            fileName: `${route.params.school.school_name}`,
            directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(options);
        // console.log(file.filePath);
        alert(file.filePath);
    }
    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.bottom}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                    <TouchableHighlight onPress={createPDF}>
                        <Text style={styles.topbtn}>Create PDF</Text>
                    </TouchableHighlight>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Invoice Coach School", { coach: route.params.coach, school: route.params.school })}>
                        <Text style={styles.topbtn}>Generate Invoice</Text>
                    </TouchableOpacity>
                </View>
                <DataTable style={styles.container}>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title style={styles.title}>School #</DataTable.Title>
                        <DataTable.Title style={styles.title}>Date MM/DD/YY: {moment().format('MM/DD/YY')}-{moment(new Date().setDate(new Date().getDate() + 30)).format('MM/DD/YY')}</DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row>
                        <DataTable.Cell>Vendor: Buddy the Ball</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Vendor Coach/Instructor: {route.params.coach.coach_name}</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
                <ScrollView horizontal style={styles.border}>
                    <DataTable style={styles.container}>
                        {customerData.map(v => {
                            return (
                                <>
                                    <DataTable.Header style={styles.tableHeader}>
                                        <DataTable.Title style={styles.title}>Child Name</DataTable.Title>
                                        <DataTable.Title style={styles.title}>Child ID</DataTable.Title>
                                        <DataTable.Title style={styles.title}>Attended</DataTable.Title>
                                        <DataTable.Title style={styles.title}>Absent</DataTable.Title>
                                    </DataTable.Header>
                                    {v.cells.map(item => {
                                        return (
                                            <>

                                                <DataTable.Row key={item.child._id}>
                                                    <DataTable.Cell>{item.child.player_name}</DataTable.Cell>
                                                    <DataTable.Cell>{item.child._id}</DataTable.Cell>
                                                    <DataTable.Cell>{item.child.total_present === null ? 0 : item.child.total_present}</DataTable.Cell>
                                                    <DataTable.Cell>{item.child.total_absent === null ? 0 : item.child.total_absent}</DataTable.Cell>
                                                </DataTable.Row>
                                            </>
                                        );
                                    })}
                                </>
                            );
                        })}
                    </DataTable>
                </ScrollView>
                <DataTable style={styles.container}>
                    <DataTable.Row>
                        <DataTable.Cell>Vendor Signature:</DataTable.Cell>
                        <DataTable.Cell>Date:</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>School Management Signature:</DataTable.Cell>
                        <DataTable.Cell>Date:</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
                <TouchableOpacity onPress={() => navigation.navigate("Super Admin Dashboard")}>
                    <Text style={styles.backbtn}>Back</Text>
                </TouchableOpacity>
            </SafeAreaView >
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    bottom: {
        flex: 1,
        position: 'relative',
        marginBottom: 56,
        marginTop: 60
    },
    backbtn: {
        borderColor: "#ffc000",
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
        justifyContent: 'flex-end'
    },
    topbtn: {
        borderColor: "#ffc000",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700"
    },
    scrollView: {
        marginHorizontal: 5,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    container: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'LemonJuice',
        fontSize: 12,
        overflow: 'scroll',
        borderWidth: 2,
        borderColor: '#ffc000',
        backgroundColor: '#fff',
        margin: 10
    },
    tableHeader: {
        textAlign: 'center',
        fontFamily: 'LemonJuice',
        color: '#fff'
    },
    title: {
        fontSize: 10,
    }
});