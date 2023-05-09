import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import buddy from '../assets/buddy.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from "react-redux";
import { SignUpService } from '../services/UserAuthService';
import LinearGradient from 'react-native-linear-gradient';
import { GetAwardPhotosService } from '../services/CustomerService';
import { GetClassesService } from '../services/ClassService';

export default function SuperAdminCustomerCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [awardList, setAwardList] = useState([]);
    const [parentData, setParentData] = useState({
        email: '',
        password: '',
        parent_name: ''
    });
    const [childrenData, setChildrenData] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        try {
            const getAwardsList = async () => {
                const result = await GetAwardPhotosService();
                if (result) {
                    setAwardList(result);
                }
            };
            getAwardsList();

            const getClasses = async () => {
                const result = await GetClassesService();
                if (result) {
                    result.map(v => {
                        v.schedules.map(u => {
                            Object.assign(v, { key: v._id, value: `Class from ${u.date} (${u.start_time} to ${u.end_time}) By ${u.coaches.map(x => x.coach_name)} in ${v.school.school_name}` })
                        })
                    })
                    setClasses(result);
                }
            };
            getClasses();
        } catch (e) { }
    }, []);

    const handleAddCustomer = async () => {
        try {
            childrenData.forEach(v => delete v.calendar_visible);
            childrenData.forEach(v => delete v.class_list);
            childrenData.forEach(v => delete v.visible);
            function checkKeyValues(obj) {
                for (let key in obj) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        if (!checkKeyValues(obj[key])) {
                            return false;
                        }
                    } else {
                        if (!obj[key]) {
                            return false;
                        }
                    }
                }
                return true;
            }

            function checkArrayObjects(array) {
                for (let obj of array) {
                    if (!checkKeyValues(obj)) {
                        return false;
                    }
                }
                return true;
            }

            if (checkArrayObjects(childrenData) && parentData.email !== "" && parentData.password !== "" && parentData.parent_name !== "") {
                const data = {
                    email: parentData.email,
                    password: parentData.password,
                    roles: ['customer'],
                    parent_name: parentData.parent_name,
                    created_by: 'superadmin',
                    created_by_name: "Super Admin",
                    created_by_user_id: state.authPage?.id,
                    children_data: childrenData
                };
                const result = await SignUpService(data);
                if (result) {
                    Alert.alert(
                        "Alert",
                        "Parent Added Successfully",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate("SuperAdmin Dashboard")
                            }
                        ]
                    );
                }
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Email is already in use!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        name="email"
                        placeholder="Email Address"
                        onChangeText={(val) => setParentData({ ...parentData, email: val })}
                        value={parentData.email}
                        style={styles.input}
                    />
                    {!parentData.email &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Email is Required</Text>
                    }
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        name="password"
                        placeholder="Password"
                        onChangeText={(val) => setParentData({ ...parentData, password: val })}
                        value={parentData.password}
                        style={styles.input}
                    />
                    {!parentData.password &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Password is Required</Text>
                    }
                    <Text style={styles.label}>Parent Name</Text>
                    <TextInput
                        name="parent_name"
                        placeholder="Parent Name"
                        onChangeText={(val) => setParentData({ ...parentData, parent_name: val })}
                        value={parentData.parent_name}
                        style={styles.input}
                    />
                    {!parentData.parent_name &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Parent Name is Required</Text>
                    }
                    <View>
                        <Text style={styles.label}>Child</Text><TouchableOpacity onPress={() => {
                            setChildrenData([...childrenData, {
                                player_name: '',
                                calendar_visible: false,
                                player_age: '',
                                wristband_level: '',
                                class_list: classes,
                                class: '',
                                handed: '',
                                num_buddy_books_read: '',
                                jersey_size: '',
                                visible: false,
                                current_award: { name: '', image: '' }
                            }]);
                        }}><Text>+</Text></TouchableOpacity>
                    </View>
                    {childrenData.length > 0 && childrenData.map((item, index) => {
                        return (
                            <View key={index}>
                                <Text style={styles.label}>Player Name</Text>
                                <TextInput
                                    name="player_name"
                                    placeholder="Player Name"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].player_name = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.player_name}
                                    style={styles.input}
                                />
                                {!item.player_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Player Name is Required</Text>
                                }
                                <Text style={styles.label}>Player Age</Text><Text onPress={() => {
                                    let newArr = [...childrenData];
                                    newArr[index].calendar_visible = !newArr[index].calendar_visible;
                                    setChildrenData(newArr);
                                }}>+</Text>
                                {item.calendar_visible && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={new Date()}
                                        mode={'date'}
                                        onChange={(event, selectedDate) => {
                                            var ageDifMs = Date.now() - selectedDate.getTime();
                                            var ageDate = new Date(ageDifMs);
                                            var age = Math.abs(ageDate.getUTCFullYear() - 1970);
                                            let newArr = [...childrenData];
                                            newArr[index].calendar_visible = !newArr[index].calendar_visible;
                                            newArr[index].player_age = age;
                                            setChildrenData(newArr);
                                        }}
                                    />
                                )}
                                <Text>Age: {item.player_age}</Text>
                                {!item.player_age &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Player Age is Required</Text>
                                }
                                <Text style={styles.label}>WristBand Level</Text>
                                <TextInput
                                    name="wristband_level"
                                    placeholder="WristBand Level"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].wristband_level = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.wristband_level}
                                    style={styles.input}
                                />
                                {!item.wristband_level &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>WristBand Level is Required</Text>
                                }
                                <Text style={styles.label}>Class</Text>
                                <SelectList
                                    setSelected={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].class = val;
                                        setChildrenData(newArr);
                                    }}
                                    data={item?.class_list?.length > 0 ? item?.class_list : []}
                                    save="key"
                                    label="Selected School"
                                />
                                {!item?.class &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Class is Required</Text>
                                }
                                <Text style={styles.label}>Handed</Text>
                                <TextInput
                                    name="handed"
                                    placeholder="Handed"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].handed = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.handed}
                                    style={styles.input}
                                />
                                {!item.handed &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Handed is Required</Text>
                                }
                                <Text style={styles.label}>Number of Buddy Books Read</Text>
                                <TextInput
                                    name="num_buddy_books_read"
                                    placeholder="Number of Buddy Books Read"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].num_buddy_books_read = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.num_buddy_books_read}
                                    style={styles.input}
                                />
                                {!item.num_buddy_books_read &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Number of Buddy Books Read is Required</Text>
                                }
                                <Text style={styles.label}>Jersey Size</Text>
                                <TextInput
                                    name="jersey_size"
                                    placeholder="Jersey Size"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].jersey_size = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.jersey_size}
                                    style={styles.input}
                                />
                                {!item.jersey_size &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Jersey Size is Required</Text>
                                }
                                <Text style={styles.label}>Current Award</Text>
                                <TouchableOpacity onPress={() => {
                                    let newArr = [...childrenData];
                                    newArr[index].visible = !newArr[index].visible;
                                    setChildrenData(newArr);
                                }}>
                                    <View style={styles.buttonText}>{item.current_award.image ? <Image source={{ uri: item.current_award.image }} style={styles.buttonImage} /> : <Text>Select the Award</Text>}</View>
                                </TouchableOpacity>
                                {item?.visible &&
                                    (<View style={styles.award}>
                                        {item?.visible && awardList.length > 0 && awardList.map(v => {
                                            return (
                                                <ScrollView showsVerticalScrollIndicator>
                                                    <TouchableOpacity key={v.index} onPress={() => {
                                                        let newArr = [...childrenData];
                                                        newArr[index].current_award.name = v.name;
                                                        newArr[index].current_award.image = v.url;
                                                        newArr[index].visible = !newArr[index].visible;
                                                        setChildrenData(newArr);
                                                    }}>
                                                        <Image source={{ uri: v.url }} style={{ height: 100, width: 100 }} />
                                                    </TouchableOpacity>
                                                </ScrollView>
                                            );
                                        })}
                                    </View>
                                    )}
                                {!item.current_award.name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Current Award is Required</Text>
                                }
                                <TouchableOpacity
                                    // style={[styles.agendaButton, styles.buttonClose]}
                                    onPress={() => {
                                        var array = [...childrenData];
                                        var indexData = array.indexOf(item);
                                        if (indexData !== -1) {
                                            array.splice(indexData, 1);
                                            setChildrenData(array);
                                        }
                                    }}>
                                    <Text >Remove</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleAddCustomer}>
                        <Text style={styles.btnWrapper}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Customers")}>
                        <Text style={styles.btnWrapper}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative',
        padding: 15,
        justifyContent: 'flex-end'
    },
    submit: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 5,
        display: 'flex',
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
        marginTop: 10
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
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10
    },
    label: {
        fontSize: 18,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 0
    },
    buttonText: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    award: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    buttonImage: {
        height: 100,
        width: 100
    }
});
