import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import regions from '../assets/REGIONS_REV1.png';
import messages from '../assets/MESSAGES_REV1.png';
import superadmin from '../assets/BUDDY_REV1.png';
import LinearGradient from 'react-native-linear-gradient';

export default function SuperAdminSettings({ navigation }) {
    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <Text style={styles.adminWrapper}>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Regions")}>
                        <View style={{ textAlign: 'center' }}>
                            <Image source={regions} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Messages")}>
                        <View style={{ textAlign: 'center' }}>
                            <Image source={messages} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admins")}>
                        <View style={{ textAlign: 'center' }}>
                            <Image source={superadmin} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                    </TouchableOpacity>
                </Text>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Dashboard")}>
                        <Text style={styles.btnWrapper}>Back</Text>
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
        justifyContent: 'space-between',
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
        marginTop: 25,
        width: 330,
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