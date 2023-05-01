import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { SafeAreaView, Text, StyleSheet, TextInput, View, Image, Modal, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/FontAwesome5';
import buddy from '../assets/buddy.png';
import moment from 'moment';
import { GetCustomersOfParticularCoachOfParticularSchool } from '../services/CoachService';
import { CreateAndUpdateAttendanceService, GetAttendanceByDateService } from '../services/AttendanceService';
import LinearGradient from 'react-native-linear-gradient';

export default function RegionalManagerParticularSchoolStudents({ route }) {
    const state = useSelector((state) => state);
    const [allDates, setAllDates] = useState({ key: '', value: '' });
    const [selectedDate, setSelectedDate] = useState(route.params.schoolItem.startDate);
    const [modalVisible, setModalVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
            let dateNew = moment(new Date(currentDate)).format('YYYY-MM-DD');
            dateArray.push(dateNew);
            currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
        return dateArray;
    }

    useEffect(() => {
        let range = dateRange(route.params.schoolItem.startDate, route.params.schoolItem.endDate);
        setAllDates({ key: range, value: range });
        try {
            const getCustomers = async () => {
                const result = await GetCustomersOfParticularCoachOfParticularSchool(state.authPage.auth_data?._id, route.params.schoolItem._id);
                if (result) {
                    var customers = result.map(v => ({ ...v, customer: v.player_name, attendance: 'NA' }));
                    const data = {
                        attendance_date: selectedDate
                    };
                    const result1 = await GetAttendanceByDateService(data);
                    if (result1) {
                        var res = customers.filter(function (item) {
                            return !result1.data.find(function (newitem) {
                                return item.user_id === newitem.user_id;
                            });
                        });
                        var concat = result1.data.concat(res);
                        var results = concat.length > 0 && concat.filter(v =>
                            v.customer.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        setCustomers(results);
                    }
                }
            };
            getCustomers();
        } catch (e) { }
    }, [selectedDate, searchTerm]);

    const handleAttendance = async (item) => {
        var array = [...customers];
        var index = array.indexOf(item);
        if (item.attendance === 'NA') {
            array[index]['attendance'] = 'P';
            setCustomers(array);
        } else if (item.attendance === 'P') {
            array[index]['attendance'] = 'A';
            setCustomers(array);
        } else {
            array[index]['attendance'] = 'P';
            setCustomers(array);
        }
        const data = {
            coach_id: state.authPage.auth_data?._id,
            school_id: route.params.schoolItem._id,
            user_id: item.user_id,
            customer_id: item._id,
            customer: item.player_name,
            time_period: route.params.schoolItem.timePeriod,
            attendance_date: selectedDate,
            attendance: item.attendance,
            start_date: route.params.schoolItem.startDate,
            end_data: route.params.schoolItem.endDate
        };
        try {
            await CreateAndUpdateAttendanceService(data);
        } catch (e) { }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.searchSection}>
                        <TextInput
                            style={styles.input}
                            value={searchTerm}
                            onChangeText={(e) => setSearchTerm(e)}
                            placeholder="Student Attendance"
                            placeholderTextColor="#fff"
                            underlineColorAndroid="transparent"
                        />
                        <Icon style={styles.searchIcon} name="search" size={20} color="#fff" />
                    </View>
                    <View style={styles.calendarSection}>
                        <View style={styles.calendarSectionLeft}>
                            <Icon style={styles.searchIcon} name="calendar" size={20} color="#fff" />
                            <SelectList
                                setSelected={(val) => {
                                    setSearchTerm("");
                                    setSelectedDate(val);
                                }}
                                data={allDates?.value}
                                save="value"
                                placeholder="Select Date"
                                search={false}
                                arrowicon={<Icon name="caret-down" size={20} color="#fff" />}
                                boxStyles={{ borderWidth: 0 }}
                                inputStyles={{ color: '#fff', paddingRight: 10 }}
                                dropdownTextStyles={{ color: '#fff' }}
                                defaultOption={{ key: allDates.key[0], value: allDates.value[0] }}
                            />
                        </View>
                        <View style={styles.verticleLine}></View>
                        <View style={styles.calendarSectionRight}>
                            <Text style={styles.calendarSectionText}>{route.params.schoolItem.school}</Text>
                        </View>
                    </View>
                    {customers.length > 0 && customers.map(v => {
                        return (
                            <View key={v._id} style={styles.listSection}>
                                {console.log("inside--->", v)}
                                <TouchableOpacity
                                    // onPress={() => setModalVisible(!modalVisible)}
                                    style={styles.listSectionLeft}
                                >
                                    <Image source={buddy} style={styles.listProfilePic} />
                                    <View>
                                        <Text style={styles.listTitleText}>{v.customer}</Text>
                                        <Text style={styles.listSeeText}>Click to see details</Text>
                                    </View>
                                </TouchableOpacity>
                                {/* <View style={styles.centeredView}>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.itemHeading}>{v.customer}</Text>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Parent Name:</Text><Text style={styles.itemText}>evgfregev</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Email:</Text><Text style={styles.itemText}>fwedfewcfew</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Password:</Text><Text style={styles.itemText}>evgfregev</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Player Age:</Text><Text style={styles.itemText}>fwedfewcfew</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Wristband Level:</Text><Text style={styles.itemText}>evgfregev</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Handed:</Text><Text style={styles.itemText}>fwedfewcfew</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Buddy Books Read:</Text><Text style={styles.itemText}>evgfregev</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Jersey Size:</Text><Text style={styles.itemText}>fwedfewcfew</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTextFirst}>Current Award:</Text><Text style={styles.itemText}>fwedfewcfew</Text>
                                        </View>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => setModalVisible(!modalVisible)}>
                                            <Text style={styles.textStyle}>Close</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Modal>
                        </View> */}
                                <TouchableOpacity key={v._id} style={v.attendance === 'NA' ? styles.listSectionRight : v.attendance === 'P' ? styles.listSectionRightPresent : styles.listSectionRightAbsent} onPress={() => handleAttendance(v)}>
                                    <Text style={styles.attendanceText}>{v.attendance === 'NA' ? 'NA' : v.attendance === 'P' ? 'P' : 'A'}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
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
        marginTop: 5,
        position: 'absolute',
        display: 'flex',
        right: 0,
        width: 100,
        justifyContent: 'flex-end'
    },
    linearGradient: {
        flex: 1,
    },
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    calendarSection: {
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'blue',
        borderTopWidth: 1,
        borderTopColor: '#fff'
    },
    calendarSectionLeft: {
        flexDirection: 'row'
    },
    calendarSectionRight: {
        width: 150,
        alignItems: 'center'
    },
    calendarSectionText: {
        color: '#fff'
    },
    verticleLine: {
        height: 30,
        width: 1,
        backgroundColor: '#fff',
    },
    searchIcon: {
        padding: 13.3,
        backgroundColor: 'blue',
        color: '#fff'
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: 'blue',
        color: '#fff'
    },
    listSection: {
        flexDirection: 'row',
        height: 70,
        margin: 10
    },
    listSectionLeft: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderColor: '#fff',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    listProfilePic: {
        width: 60,
        height: 60,
        borderRadius: 100
    },
    listSectionRight: {
        width: '20%',
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: 'blue'
    },
    listSectionRightPresent: {
        width: '20%',
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: 'green'
    },
    listSectionRightAbsent: {
        width: '20%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: 'red'
    },
    attendanceText: {
        color: '#fff'
    },
    itemText: {
        color: '#888',
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 5
    },
    buttonClose: {
        backgroundColor: 'red'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    item: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemHeading: {
        color: 'black',
        fontSize: 20
    },
    itemTextFirst: {
        color: 'black'
    },
    listTitleText: {
        color: 'black',
        fontSize: 18
    },
    listSeeText: {
        color: 'green'
    }
});