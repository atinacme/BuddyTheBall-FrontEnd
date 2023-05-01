import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GetSchoolsService } from '../services/SchoolService';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function SuperAdminBilling({ navigation }) {
    const [schools, setSchools] = useState([]);

    useEffect(() => {
        try {
            const getSchools = async () => {
                const result = await GetSchoolsService();
                if (result) {
                    setSchools(result);
                }
            };
            getSchools();
        } catch (e) { }
    }, []);

    const htmlData = () => {
        let t = '';
        for (let i in schools) {
            const v = schools[i];
            for (let u in v.classes) {
                const q = v.classes[u];
                for (let w in q.schedules) {
                    const e = q.schedules[w];
                    for (let y in e.coaches) {
                        const p = e.coaches[y];
                        console.log("SDds--->", i, u, w, y)
                        t = t +

                            `
                            <div style="display: flex; flex-direction: column;">
                            
                            <h1>${v.school_name}</h1>

                                <h4>Number of Players:</h4> <p>${v.customers.length}</p>

                                <h4>Number of Couches:</h4> <p>${v.coaches.length}</p>

                                <h4>Name of Director:</h4> <p>NAME, E-MAIL, PHONE NUMBER</p>

                                <h4>Established Date:</h4> <p>(First Date School Added to system, always stays the same date, timestamped on initial creation)</p>

                                <h4>Total Revenue for the Month:</h4> <p></p>

                                <h4>Total Revenue Year to Date:</h4> <p></p>

                                <h4>Total number of Students:</h4> <p>${v.customers.map(r => r.children_data.length)}</p>

                                <h4>Total number of Sessions:</h4> <p>${v.classes.map(r => r.schedules.length)}</p>

                                <h4>Total number of Kids Paused for the Month:</h4> <p>${v.customers.map(r => r.children_data.length)}</p>

                                <h1>Class</h1>
                                    
                                    <h4>Name, Email and Phone number of the Couch(s):</h4> <p></p>

                                    <h4>Number of Completed Sessions:</h4> <p></p>

                                    <h4>Number of Kids:</h4> <p></p>

                                    <h4>Number of Cancelled Sessions:</h4> <p></p>

                                    <h4>Number of Rescheduled Sessions:</h4> <p></p>

                                    <h1>Session</h1>

                                        <h4>Start Date of the Session:</h4> <p>${e.date}</p>

                                        <h4>End Date of the Session:</h4> <p>${e.date}</p>

                                        <h4>Start Time of the Session:</h4> <p>${e.start_time}</p>

                                        <p>[PHOTO] ${p.coach_name} ${p.email}</p>

                                        <h4>Number of Absence:</h4> <p></p>

                                        <h4>Number of Present:</h4> <p></p>
                            </div>
                    `;
                    }
                }
            }
        }
        return t;
    };

    async function createPDF() {
        let options = {
            html: `
                ${htmlData()}
            `,
            fileName: `swdw`,
            directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(options);
        // console.log(file.filePath);
        alert(file.filePath);
    }

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={createPDF}>
                        <Text style={styles.topbtn}>Create PDF</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {schools.map((school, index) => {
                        return (
                            <View key={index} style={styles.stdWrapper}>
                                <Text style={styles.title}>{school.school_name}</Text>
                                {school.classes.length > 0 ?
                                    <>
                                        {school.classes.map((v, indexNew) => {
                                            return (
                                                <>
                                                    <Text>Class: {indexNew + 1}</Text>
                                                    <View key={indexNew} style={styles.stddesc}>
                                                        {v.schedules.map((u, scheduleIndex) => {
                                                            return (
                                                                <Text style={styles.content} key={scheduleIndex}>
                                                                    {u.coaches.map((d, coachIndex) => {
                                                                        return (
                                                                            <TouchableOpacity key={coachIndex} onPress={() => navigation.navigate("SuperAdmin Billing Coach School", { school: school, class: v, schedule: u, coach: d })}>
                                                                                <Text>{d.coach_name}</Text>
                                                                            </TouchableOpacity>
                                                                        )
                                                                    })}
                                                                </Text>
                                                            )
                                                        })}
                                                    </View>
                                                </>
                                            );
                                        })}
                                    </>
                                    :
                                    <View style={styles.stddesc}>
                                        <Text style={styles.content}>No Coach!!</Text>
                                    </View>
                                }
                            </View>
                        );
                    })}
                </ScrollView>
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
    }
});