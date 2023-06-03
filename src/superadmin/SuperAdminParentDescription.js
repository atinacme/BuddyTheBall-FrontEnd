import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import buddy from '../assets/buddy.png';
import { DeleteParentService, GetAwardsService, GetParticularParentService, UpdateParentService } from '../services/ParentService';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list';
import { GetClassesService } from '../services/ClassService';

export default function SuperAdminParentDescription({ navigation, route }) {
    const [classList, setClassList] = useState([])
    const [customerData, setCustomerData] = useState({
        user_id: '',
        email: '',
        password: '',
        parent_name: '',
        created_by: ''
    });
    const [childrenData, setChildrenData] = useState([]);
    const [awardList, setAwardList] = useState([]);
    const wristbands = [
        { key: "White", value: "White" },
        { key: "Yellow", value: "Yellow" },
        { key: "Orange", value: "Orange" },
        { key: "Blue", value: "Blue" },
        { key: "Green", value: "Green" },
        { key: "Purple", value: "Purple" },
        { key: "Red", value: "Red" },
        { key: "Black", value: "Black" }
    ]

    useEffect(() => {
        try {
            const getClasses = async () => {
                const result = await GetClassesService();
                if (result) {
                    result.map(v => {
                        v?.schedules?.map(u => {
                            Object.assign(v, { key: v._id, value: `${v.topic} in ${v.school.school_name} from ${u.date} (${u.start_time} to ${u.end_time}) By ${u.coaches.map(x => x.coach_name)}` })
                        })
                    })
                    setClassList(result)
                    const result1 = await GetParticularParentService(route.params.customerData._id);
                    const result2 = await GetAwardsService();
                    if (result2) {
                        result2.map(v => {
                            Object.assign(v, { key: v._id, value: `${v.award_name} (${v.award_description})` })
                        })
                        setAwardList(result2);
                    }
                    if (result1 && result1.children_data.length > 0) {
                        for (let element of result1.children_data) {
                            setTimeout(() => {
                                if (element.class !== null) {
                                    element.class?.schedules.map(u => {
                                        Object.assign(element.class, { key: element.class._id, value: `${element.class.topic} in ${element.class.school.school_name} from ${u.date} (${u.start_time} to ${u.end_time}) By ${u.coaches.map(x => x.coach_name)} ` })
                                    })
                                }
                                console.log("shes--->", element.current_award)
                                setChildrenData(prevState => [...prevState, {
                                    player_name: element.player_name,
                                    calendar_visible: false,
                                    player_age: element?.player_age,
                                    wristband_level_list: wristbands,
                                    wristband_level: element?.wristband_level,
                                    class_check: element.class === null ? null : element?.class,
                                    class_list: result,
                                    class: element.class?._id,
                                    class_visible: false,
                                    class_default_show: element?.class,
                                    class_default_removed: false,
                                    handed_list: ["Left", "Right"],
                                    handed: element.handed,
                                    num_buddy_books_read: element?.num_buddy_books_read,
                                    jersey_size: element?.jersey_size,
                                    visible: false,
                                    award_list: result2,
                                    current_award: element?.current_award
                                }]);
                            }, 1000)
                        }
                        setCustomerData({
                            user_id: result1.user_id,
                            email: result1.email,
                            password: result1.password,
                            parent_name: result1.parent_name,
                            created_by: result1.created_by
                        });
                    }
                }
            }
            getClasses()
        } catch (e) { }
    }, []);

    console.log("dcdcxd-->", childrenData)

    const handleCustomerUpdate = async () => {
        try {
            childrenData.forEach(v => delete v.calendar_visible);
            childrenData.forEach(v => delete v.class_check);
            childrenData.forEach(v => delete v.class_list);
            childrenData.forEach(v => delete v.class_default_show);
            childrenData.forEach(v => delete v.class_default_removed);
            childrenData.forEach(v => delete v.class_visible);
            childrenData.forEach(v => delete v.visible);

            function checkKeyValues(array) {
                for (let obj of array) {
                    for (let key in obj) {
                        if (!obj[key]) {
                            return false;
                        }
                    }
                }
                return true;
            }

            if (checkKeyValues(childrenData) && customerData.email !== "" && customerData.password !== "" && customerData.parent_name !== "") {
                const data = {
                    email: customerData.email,
                    password: customerData.password,
                    parent_name: customerData.parent_name,
                    children_data: childrenData
                };
                const result = await UpdateParentService(customerData.user_id, route.params.customerData._id, data);
                if (result) {
                    Alert.alert(
                        "Alert",
                        "Parent Updated Successfully",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate("Super Admin Parents")
                            }
                        ]
                    );
                }
            } else {
                Alert.alert(
                    "Alert",
                    "Fill all",
                    [
                        {
                            text: "OK"
                        }
                    ]
                );
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't Update Parent!"
            );
        }
    };

    const handleCustomerDelete = async () => {
        try {
            Alert.alert(
                "Alert",
                "Do You Want to Delete the Parent ?",
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            const data = { id: route.params.customerData._id, user_id: customerData.user_id }
                            const result = await DeleteParentService(data)
                            if (result) {
                                Alert.alert(
                                    "Alert",
                                    "Parent Deleted Successfully",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => navigation.navigate("Super Admin Dashboard")
                                        }
                                    ]
                                );
                            }
                        }
                    }
                ]
            );
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't Update Parent!"
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
                        onChangeText={(value) => setCustomerData({ ...customerData, email: value })}
                        value={customerData.email}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        name="password"
                        placeholder="Password"
                        onChangeText={(value) => setCustomerData({ ...customerData, password: value })}
                        value={customerData.password}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Parent Name</Text>
                    <TextInput
                        name="parent_name"
                        placeholder="Parent Name"
                        onChangeText={(value) => setCustomerData({ ...customerData, parent_name: value })}
                        value={customerData.parent_name}
                        style={styles.input}
                    />
                    <View style={styles.labelBtn}>
                        <Text style={styles.label}>Child</Text>
                        <TouchableOpacity onPress={() => {
                            setChildrenData(prevState => [...prevState, {
                                player_name: '',
                                calendar_visible: false,
                                player_age: '',
                                wristband_level: '',
                                class_list: classList,
                                class: '',
                                handed_list: ["Left", "Right"],
                                handed: '',
                                num_buddy_books_read: '',
                                jersey_size: '',
                                visible: false,
                                award_list: awardList,
                                current_award: ''
                            }]);
                        }}>
                            <Text style={styles.plusBtn}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {childrenData.length > 0 && childrenData.map((item, index) => {
                        return (
                            <View key={index}>
                                <Text style={styles.label}>Child Name</Text>
                                <TextInput
                                    name="player_name"
                                    placeholder="Child Name"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].player_name = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.player_name}
                                    style={styles.input}
                                />
                                {!item.player_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Child Name is Required</Text>
                                }
                                <View style={styles.labelBtn}>
                                    <Text style={styles.label}>Child Age</Text>
                                    <Text style={styles.plusBtn} onPress={() => {
                                        let newArr = [...childrenData];
                                        newArr[index].calendar_visible = !newArr[index].calendar_visible;
                                        setChildrenData(newArr);
                                    }}>+</Text>
                                </View>
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
                                    <Text style={{ fontSize: 10, color: 'red' }}>Child Age is Required</Text>
                                }
                                <Text style={styles.label}>WristBand Level</Text>
                                <SelectList
                                    setSelected={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].wristband_level = val;
                                        setChildrenData(newArr);
                                    }}
                                    data={item?.wristband_level_list?.length > 0 ? item?.wristband_level_list : []}
                                    label="Selected WristBand"
                                    defaultOption={{ "key": item.wristband_level, "value": item.wristband_level }}
                                />
                                {!item.wristband_level &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>WristBand Level is Required</Text>
                                }
                                <Text style={styles.label}>Class</Text>
                                {item.class_check === null ?
                                    <>
                                        {!item.class_visible ?
                                            <TouchableOpacity
                                                onPress={() => {
                                                    let newArr = [...childrenData];
                                                    newArr[index].class_visible = true;
                                                    setChildrenData(newArr);
                                                }}>
                                                <Text style={styles.plusBtn}>+</Text>
                                            </TouchableOpacity>
                                            :
                                            <SelectList
                                                setSelected={(val) => {
                                                    let newArr = [...childrenData];
                                                    newArr[index].class = val;
                                                    setChildrenData(newArr);
                                                }}
                                                data={item.class_list}
                                                save="key"
                                                label="Selected School"
                                            />
                                        }
                                    </>
                                    :
                                    <>
                                        {!item.class_default_removed ?
                                            <>
                                                <Text>{item.class_default_show?.value}</Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        let newArr = [...childrenData];
                                                        newArr[index].class = '';
                                                        newArr[index].class_default_removed = true;
                                                        setChildrenData(newArr);
                                                    }}>
                                                    <Text>X</Text>
                                                </TouchableOpacity>
                                            </>
                                            :
                                            <SelectList
                                                setSelected={(val) => {
                                                    let newArr = [...childrenData];
                                                    newArr[index].class = val;
                                                    setChildrenData(newArr);
                                                }}
                                                data={item.class_list}
                                                save="key"
                                                label="Selected School"
                                            />
                                        }
                                    </>
                                }
                                {!item.class &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Class is Required</Text>
                                }
                                <Text style={styles.label}>Handed</Text>
                                <SelectList
                                    setSelected={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].handed = val;
                                        setChildrenData(newArr);
                                    }}
                                    data={item?.handed_list?.length > 0 ? item?.handed_list : []}
                                    defaultOption={{ "key": item.handed, "value": item.handed }}
                                    label="Selected Handed"
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
                                <Text>{item?.current_award?.award_name} ({item?.current_award?.award_description})</Text>
                                <SelectList
                                    setSelected={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].current_award = val;
                                        setChildrenData(newArr);
                                    }}
                                    data={item.award_list}
                                    save="key"
                                    label="Selected Award"
                                />
                                {/* <TouchableOpacity onPress={() => {
                                    let newArr = [...childrenData];
                                    newArr[index].visible = !newArr[index].visible;
                                    setChildrenData(newArr);
                                }}>
                                    <View style={styles.buttonText}>{item?.current_award?.image ? <Image source={{ uri: item?.current_award?.image }} style={styles.buttonImage} /> : <Text>Select the Award</Text>}</View>
                                </TouchableOpacity>
                                {item.visible &&
                                    (<View style={styles.award}>
                                        {item.visible && awardList.map(v => {
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
                                    )} */}
                                {!item.current_award &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Current Award is Required</Text>
                                }
                                <TouchableOpacity
                                    onPress={() => {
                                        var array = [...childrenData];
                                        var indexData = array.indexOf(item);
                                        if (indexData !== -1) {
                                            array.splice(indexData, 1);
                                            setChildrenData(array);
                                        }
                                    }}>
                                    <Text style={styles.removebtn}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleCustomerUpdate}>
                        <Text style={styles.btnWrapper}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 80 }}>
                    <TouchableOpacity onPress={handleCustomerDelete}>
                        <Text style={styles.deletebtn}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Parents")}>
                        <Text style={styles.backbtn}>Back</Text>
                    </TouchableOpacity>
                </View>
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
        marginTop: 60
    },
    labelBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    plusBtn: {
        borderColor: "#fff",
        padding: 3,
        textAlign: "center",
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 50,
        width: 30,
        height: 30
    },
    removebtn: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 10,
        display: 'flex',
        left: 0,
        width: 100,
        bottom: 0,
        marginBottom: 10
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
    deletebtn: {
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
        left: 0,
        width: 100,
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 10
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
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 10
    },
    linearGradient: {
        flex: 1,
        borderRadius: 5
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
    },
    dropdown: {
        margin: 16,
        height: 80,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        height: 100
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});