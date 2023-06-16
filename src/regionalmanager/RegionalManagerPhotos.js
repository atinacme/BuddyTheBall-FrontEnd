import React, { useEffect, useState } from 'react';
import { SafeAreaView, ImageBackground, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import kids from '../assets/kids.jpg';
import galley from '../assets/galley.png';
import profile from '../assets/profile.png';
import { useSelector } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import { GetAllSchoolPhotosService } from '../services/SchoolService';

export default function RegionalManagerPhotos({ navigation }) {
    const state = useSelector((state) => state);
    const [schoolData, setSchoolData] = useState([]);

    useEffect(() => {
        try {
            const getAllPhotos = async () => {
                const result = await GetAllSchoolPhotosService()
                if (result) {
                    result.map(v => v.region === state.authPage.auth_data?.assigned_region)
                    setSchoolData(result)
                }
            }
            getAllPhotos()
        } catch (e) { }
    }, []);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView showsVerticalScrollIndicator>
                    {schoolData.map(item => {
                        return (
                            <TouchableOpacity key={item._id} onPress={() => navigation.navigate("Regional Manager Particular School Photos", { schoolItem: item })}
                                style={styles.cachpicWrap}>
                                <ImageBackground key={item._id} source={item?.photos[0]?.url ? { uri: item?.photos[0]?.url } : kids} style={styles.cardBackground}>
                                    <View style={styles.cardContent}>
                                        <View style={styles.carddes}>
                                            <View style={styles.cardText}>
                                                <Text style={styles.title}>{item.school_name}</Text>
                                                <Text style={styles.cardSubtitle}>Class: {item?.photos[0]?.class_id?.topic}</Text>
                                                <Text style={styles.title}>Session: {item?.photos[0]?.schedule_id?.topic}</Text>
                                                <Text style={styles.cardimg}>
                                                    <Image source={galley} style={{ width: 20, height: 20 }} />
                                                    <Text style={styles.num}>{item?.photos[0]?.schedule_id?.status}</Text>
                                                    <Image source={profile} style={{ width: 20, height: 20 }} />
                                                    <Text style={styles.num}>{item?.photos[0]?.schedule_id?.created_by_name}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Dashboard")}>
                        <Text style={styles.btnWrapper}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        position: 'relative',
        justifyContent: 'flex-end'
    },
    wrapper: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        marginBottom: 10,
        marginTop: 60
    },
    btnWrapper: {
        borderColor: "#fff",
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 10,
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
    txtwrap: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-between',
        display: 'flex'
    },
    imgWrapper: {
        position: 'relative',
        // margin: 10,
        width: '100%',
        left: 0,
        right: 0,
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