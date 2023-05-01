import React from 'react';
import { SafeAreaView, ImageBackground, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import kids from '../assets/kids.jpg';
import galley from '../assets/galley.png';
import profile from '../assets/profile.png';
import { useSelector } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';

export default function CoachSchoolsPhotos({ navigation }) {
    const state = useSelector((state) => state);
    const schoolData = state.authPage.auth_data?.assigned_schools;

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView showsVerticalScrollIndicator>
                    {schoolData.map(item => {
                        return (
                            <TouchableOpacity key={item._id} onPress={() => item.region.indexOf(state.authPage.auth_data?.assigned_region) > -1 ?
                                navigation.navigate("Coach Particular School Photos", { schoolItem: item })
                                : Alert.alert(
                                    "Alert",
                                    "You are not assigned to this School!",
                                    [
                                        {
                                            text: "OK"
                                        }
                                    ]
                                )} style={styles.cachpicWrap}
                            >
                                <ImageBackground source={kids} style={styles.cardBackground}>
                                    <View style={styles.cardContent}>
                                        <View style={styles.carddes}>
                                            <Text style={styles.cardSubtitle}>Yesterday</Text>
                                            <View style={styles.cardText}>
                                                <Text style={styles.title}>{item.school_name}</Text>
                                                <Text style={styles.cardimg}>
                                                    <Image source={galley} style={{ width: 20, height: 20 }} />
                                                    <Text style={styles.num}>100</Text>
                                                    <Image source={profile} style={{ width: 20, height: 20 }} />
                                                    <Text style={styles.num}>2</Text>
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("Coach Dashboard")}>
                    <Text style={styles.backbtn}>Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    wrapper: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        marginBottom: 56,
        marginTop: 60
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
        display: 'flex',
        width: 100,
        position: 'absolute',
        display: 'flex',
        right: 0,
        width: 100,
        justifyContent: 'flex-end',
        bottom: -50
    },
    cardimg: {
        display: 'flex'
    },
    imgDes: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    day: {
        color: '#fff',
        // fontFamily: 'LemonJuice'
    },
    title: {
        color: '#fff',
        fontSize: 14,
        // fontFamily: 'LemonJuice'
        fontWeight: '700',
    },
    num: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14
        // fontFamily: 'LemonJuice'
    },

    kidimg: {
        position: 'absolute',
        top: 0,
        left: 15,
        width: '100%'
    },
    cardBackground: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10
    },
    cardContent: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        // borderRadius: 10,
        position: 'relative',
        bottom: 0,
        height: '100%',
    },
    carddes: {
        position: 'absolute',
        bottom: 0,
        padding: 10,
        width: '100%',
    },
    cardSubtitle: {
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic',
    },
    cardText: {
        color: '#fff',
        fontSize: 14,
        width: '100%',
        lineHeight: 20,
        flex: 1,
    },
});