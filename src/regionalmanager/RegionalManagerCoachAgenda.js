import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GetSchoolsService } from '../services/SchoolService';
import LinearGradient from 'react-native-linear-gradient';

export default function RegionalManagerCoachAgenda({ navigation, route }) {
    const [agendas, setAgendas] = useState([]);

    useEffect(() => {
        const getAgendas = async () => {
            try {
                const result = await GetSchoolsService(route.params.coachData._id);
                if (result) {
                    setAgendas(result);
                }
            } catch (e) { }
        };
        getAgendas();
    });

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView>
                    {agendas.map((agenda, index) => {
                        return (
                            <View key={index} style={styles.stdWrapper}>
                                <Text style={styles.title}>{agenda.agenda_date}</Text>
                                {agenda.agenda_data.map((v, indexNew) => {
                                    return (
                                        <View key={indexNew} style={styles.stddesc}>
                                            <Text style={styles.content}>{v.name}</Text>
                                            <Text style={styles.content}>{v.school}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Calendar")}>
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
    // stdWrapper: {
    //     padding: 10,
    //     backgroundColor: '#fff'
    // },
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