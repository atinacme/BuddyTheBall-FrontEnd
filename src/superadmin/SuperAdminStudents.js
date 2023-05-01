import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GetSchoolsService } from '../services/SchoolService';
import LinearGradient from 'react-native-linear-gradient';

export default function SuperAdminStudents({ navigation }) {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        try {
            const getCustomers = async () => {
                const result = await GetSchoolsService();
                if (result) {
                    setCustomers(result);
                }
            };
            getCustomers();
        } catch (e) { }
    });

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    {customers.map((customer, index) => {
                        return (
                            <View key={index} style={styles.stdWrapper}>
                                <Text style={styles.title}>{customer.school_name}</Text>
                                {customer.customers.length > 0 ?
                                    <>
                                        {customer.customers.map((v, indexNew) => {
                                            return (
                                                <View key={indexNew} style={styles.stddesc}>
                                                    <Text>Customer Name: {v.parent_name}</Text>
                                                    <Text>Customer Email: {v.email}</Text>
                                                    <Text>Customer Id: {v._id}</Text>
                                                    <Text>Customer User Id: {v.user_id}</Text>
                                                    {customer.customers.length > 0 && v.children_data.map(u => {
                                                        return (
                                                            <View style={styles.content}>
                                                                <Text>Player Name: {u.player_name}</Text>
                                                                <Text>Player Age: {u.player_age}</Text>
                                                                <Text>Wristband Level: {u.wristband_level}</Text>
                                                                <Text>Handed: {u.handed}</Text>
                                                                <Text>Number of Buddy Books Read: {u.num_buddy_books_read}</Text>
                                                                <Text>Jersey Size: {u.jersey_size}</Text>
                                                                <Text>Current Award: {u.current_award.name}</Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            );
                                        })}
                                    </>
                                    :
                                    <View style={styles.stddesc}>
                                        <Text style={styles.content}>No Students!!</Text>
                                    </View>
                                }
                            </View>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Customer Creation")}>
                    <Text style={styles.cust_btn}>Customer Creation</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Dashboard")}>
                    <Text style={styles.backbtn}>Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 60,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        justifyContent: 'flex-end'
    },
    stdWrapper: {
        flex: 1,
    },
    scrollView: {
        marginHorizontal: 5,
    },
    cust_btn: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 25,
        display: 'flex',
        left: 0,
        width: 150,
        position: 'absolute',
        bottom: 0,
        marginBottom: 10
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
        marginTop: 25,
        display: 'flex',
        right: 0,
        width: 150,
        position: 'absolute',
        bottom: 0,
        marginBottom: 10
    },
    title: {
        color: '#000',
        textAlign: 'center',
        fontSize: 20,
        textTransform: 'uppercase',
        fontFamily: 'LemonJuice',
        paddingBottom: 20
    },
    content: {
        fontSize: 14,
        padding: 10,
        borderColor: '#000',
        borderWidth: 1,
    },
    linearGradient: {
        flex: 1,
    },
});