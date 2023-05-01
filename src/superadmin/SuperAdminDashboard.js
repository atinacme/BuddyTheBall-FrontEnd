import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native';
import { useDispatch } from "react-redux";
import { AuthPageAction } from '../redux/Actions';
import LinearGradient from 'react-native-linear-gradient';

export default function SuperAdminDashboard({ navigation }) {
    const dispatch = useDispatch();

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView>
                    <Text style={styles.adminWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Billing")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg1 }}>BILLING / INVOICING</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Coaches")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg2 }}>COACHES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Photos")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg3 }}>PHOTOS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Customers")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg4 }}>PARENTS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Settings")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg5 }}>SETTINGS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Schools")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg6 }}>SCHOOLS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Calendar")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg8 }}>CALENDAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Regional Manager")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg8 }}>Regional Managers</Text>
                        </TouchableOpacity>
                    </Text>
                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("SignIn");
                        dispatch(AuthPageAction('', '', '', '', ''));
                    }}>
                        <Text style={styles.btnWrapper}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    adminbtn: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: 10,
        width: '100%'
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
        width: 120,
    },
    btnWrapper: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        width: 320,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    adminWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 80,
    },
    adminContainer: {
        width: 155,
        margin: 5,
        padding: 35,
        paddingLeft: 0,
        paddingRight: 0,
        color: '#000',
        fontSize: 12,
        height: 100,
        borderRadius: 10,
        textAlign: 'center',
        lineHeight: 20,
        borderWidth: 3,
        borderColor: '#fff',
        fontWeight: '600',
        fontFamily: 'LemonJuice',
        verticalAlign: 'middle'
    },
    adminBg1: {
        backgroundColor: '#00b050'
    },
    adminBg2: {
        backgroundColor: '#5b9bd5'
    },
    adminBg3: {
        backgroundColor: '#ed7d31'
    },
    adminBg4: {
        backgroundColor: '#ffc000'
    },
    adminBg5: {
        backgroundColor: '#993366'
    },
    adminBg6: {
        backgroundColor: '#ff0000'
    },
    adminBg7: {
        backgroundColor: '#ffff00'
    },
    adminBg8: {
        backgroundColor: 'blue'
    }
});
