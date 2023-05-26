import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View, Image, ScrollView, } from 'react-native';
import { useDispatch } from "react-redux";
import { AuthPageAction } from '../redux/Actions';
import billing from '../assets/BILLING_INVOICING_REV1.png';
import coaches from '../assets/COACHES_REV1.png';
import photos from '../assets/PHOTOS_REV1.png';
import parents from '../assets/PARENTS_REV1.png';
import settings from '../assets/SETTING-_REV1.png';
import schools from '../assets/SCHOOLS_REV1.png';
import calendar from '../assets/CALENDAR_REV1.png';
import regional_managers from '../assets/REGIONAL_MANAGERS_REV1.png';
import LinearGradient from 'react-native-linear-gradient';

export default function SuperAdminDashboard({ navigation }) {
    const dispatch = useDispatch();

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView>
                    <Text style={styles.adminWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Billing")}>
                            <Image source={billing} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Coaches")}>
                            <Image source={coaches} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Photos")}>
                            <Image source={photos} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Parents")}>
                            <Image source={parents} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Settings")}>
                            <Image source={settings} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Schools")}>
                            <Image source={schools} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Calendar")}>
                            <Image source={calendar} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Super Admin Regional Manager")}>
                            <Image source={regional_managers} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
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
        // justifyContent: 'space-between',
        marginTop: 80,
        marginBottom: 60
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
