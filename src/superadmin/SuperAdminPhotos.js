import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import kids from '../assets/kids.jpg';
import galley from '../assets/galley.png';
import profile from '../assets/profile.png';
import LinearGradient from 'react-native-linear-gradient';
import { GetSchoolsService } from '../services/SchoolService';

export default function SuperAdminPhotos({ navigation }) {
    const [schools, setSchools] = useState([])

    useEffect(() => {
        try {
            const getSchools = async () => {
                const result = await GetSchoolsService()
                if (result) {
                    setSchools(result)
                }
            }
            getSchools()
        } catch (e) { }
    })
    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView showsVerticalScrollIndicator>
                    {schools.map((item) => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate("Super Admin Particular School Photos", { schoolItem: item })}>
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
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Dashboard")}>
                        <Text style={styles.btnWrapper}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 5,
    },
    label: {
        fontSize: 19,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        fontFamily: 'LemonJuice'
    },
    imgWrap: {
        paddingBottom: 40,
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative',
        textAlign: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },
    linearGradient: {
        flex: 1,
        borderRadius: 5
    },
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative',
        padding: 15,
        justifyContent: 'flex-end'
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