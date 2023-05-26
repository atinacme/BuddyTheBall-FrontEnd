import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableHighlight, TouchableOpacity, ScrollView, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { GetCustomersOfParticularCoachOfParticularSchool } from '../services/CoachService';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';

export default function SuperAdminInvoiceCoachSchool({ navigation, route }) {
    const [customerData, setCustomerData] = useState({
        total_children: '',
        invoice_number: '',
        invoice_date: '',
        due_date: '',
        invoice_month: '',
        invoice_total: '',
        total_due: ''
    });
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
                    setCustomerData({
                        total_children: customer_data.length,
                        invoice_number: 100001,
                        invoice_date: moment().format('LL'),
                        due_date: moment(new Date().setDate(new Date().getDate() + 30)).format('LL'),
                        invoice_month: moment().format('MMMM'),
                        invoice_total: customer_data.length * 100 - customer_data.length * 30,
                        total_due: customer_data.length * 100 - customer_data.length * 30
                    });
                }
            };
            handleCustomers();
        } catch (e) { }
    }, []);

    async function createPDF() {
        let options = {
            html: `
            <div>
                <h5>Vendor's Remittance Address:</h5>
                <p>1651 S Buffalo Dr Las Vegas NV 89117</p>
                <h5>To:</h5>
                <p>Learning Care Group</p>
                <p>21333 Haggerty Rd., Suite 300</p>
                <p>Novi, MI 48375</p>
            </div>
            <div style="display: flex; flex-direction: column;">
            <table border='1' align="right">
                <tr>
                    <th></th>
                    <th></th>
                </tr>
                <tr>
                    <td>Invoice Number:</td>
                    <td>${customerData.invoice_number}</td>
                </tr>
                <tr>
                    <td>Vendor Number:</td>
                    <td>103784</td>
                </tr>
                <tr>
                    <td>Invoice Date:</td>
                    <td>${customerData.invoice_date}</td>
                </tr>
                <tr>
                    <td>Due Date:</td>
                    <td>${customerData.due_date}</td>
                </tr>
                <tr>
                    <td>Invoice Month:</td>
                    <td>${route.params.school._id}</td>
                </tr>
                <tr>
                    <td>School Brand:</td>
                    <td>${route.params.school.school_name}</td>
                </tr>
                <tr>
                    <td>School Address:</td>
                    <td>${route.params.school.address}</td>
                </tr>
                <tr>
                    <td>Invoice Total:</td>
                    <td>${customerData.invoice_total}</td>
                </tr>
                <tr>
                    <td>Total Due:</td>
                    <td>${customerData.total_due}</td>
                </tr>
            </table>
            <br/><br/>
            <table border='1'>
                <tr>
                    <th># of Students</th>
                    <th>Item Description</th>
                    <th>Rate per Student</th>
                    <th>Subtotal</th>
                </tr>
                <tr>
                    <td>${customerData.total_children}</td>
                    <td>Tennis class subscription at name_of_school</td>
                    <td>$100.00</td>
                    <td>${customerData.total_children * 100}</td>
                </tr>
                <tr>
                    <td>${customerData.total_children}</td>
                    <td>Overhead fee due to school - 30%</td>
                    <td>$(30.00)</td>
                    <td>(${customerData.total_children * 30})</td>
                </tr>
            </table>
            <br/><br/>
            <table border='1' align="right">
                <tr>
                    <td>Amount:</td>
                    <td>${customerData.invoice_total}</td>
                </tr>
                <tr>
                    <td>Total Due:</td>
                    <td>${customerData.total_due}</td>
                </tr>
            </table>
            </div>
            `,
            fileName: `${customerData.invoice_date}`,
            directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(options);
        // console.log(file.filePath);
        alert(file.filePath);
    }
    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <ScrollView style={styles.border}>
                <SafeAreaView style={styles.bottom}>
                    <View>
                        <TouchableHighlight onPress={createPDF}>
                            <Text style={styles.topbtn}>Create Invoice</Text>
                        </TouchableHighlight>
                    </View>
                    <View>
                        <Text>Vendor's Remittance Address:</Text>
                        <Text>1651 S Buffalo Dr Las Vegas NV 89117</Text>
                        <Text>To:</Text>
                        <Text>Learning Care Group</Text>
                        <Text>21333 Haggerty Rd., Suite 300</Text>
                        <Text>Novi, MI 48375</Text>
                    </View>
                    <DataTable style={styles.container}>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={styles.title}></DataTable.Title>
                            <DataTable.Title style={styles.title}></DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Row>
                            <DataTable.Cell>Invoice Number:</DataTable.Cell>
                            <DataTable.Cell>{customerData.invoice_number}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Vendor Number:</DataTable.Cell>
                            <DataTable.Cell>103784</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Invoice Date:</DataTable.Cell>
                            <DataTable.Cell>{customerData.invoice_date}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Due Date:</DataTable.Cell>
                            <DataTable.Cell>{customerData.due_date}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Invoice Month:</DataTable.Cell>
                            <DataTable.Cell>{customerData.invoice_month}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>School Brand:</DataTable.Cell>
                            <DataTable.Cell>{route.params.school.school_name}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>School Address:</DataTable.Cell>
                            <DataTable.Cell>{route.params.school.address}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Invoice Total:</DataTable.Cell>
                            <DataTable.Cell>{customerData.invoice_total}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Total Due:</DataTable.Cell>
                            <DataTable.Cell>{customerData.total_due}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                    <ScrollView horizontal style={styles.border}>
                        <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title style={styles.title}># of Students</DataTable.Title>
                                <DataTable.Title style={styles.title}>Item Description</DataTable.Title>
                                <DataTable.Title style={styles.title}>Rate per Student</DataTable.Title>
                                <DataTable.Title style={styles.title}>Subtotal</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Row>
                                <DataTable.Cell>{customerData.total_children}</DataTable.Cell>
                                <DataTable.Cell>Tennis class subscription at name_of_school</DataTable.Cell>
                                <DataTable.Cell>$100.00</DataTable.Cell>
                                <DataTable.Cell>${customerData.total_children * 100}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell>{customerData.total_children}</DataTable.Cell>
                                <DataTable.Cell>Overhead fee due to school - 30%</DataTable.Cell>
                                <DataTable.Cell>$(30.00)</DataTable.Cell>
                                <DataTable.Cell>$({customerData.total_children * 30})</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </ScrollView>
                    <DataTable style={styles.container}>
                        <DataTable.Row>
                            <DataTable.Cell>Amount:</DataTable.Cell>
                            <DataTable.Cell>${customerData.invoice_total}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell></DataTable.Cell>
                            <DataTable.Cell></DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Total Due:</DataTable.Cell>
                            <DataTable.Cell>${customerData.total_due}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Dashboard")}>
                        <Text style={styles.backbtn}>Back</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ScrollView>
        </LinearGradient>
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