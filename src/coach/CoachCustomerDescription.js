import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import buddy from '../assets/buddy.png';
import { GetAwardPhotosService, GetParticularCustomerService, UpdateCustomerService } from '../services/CustomerService';
import { SelectList } from 'react-native-dropdown-select-list';
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GetClassCreatedByUserIdService } from '../services/ClassService';

export default function CoachCustomerDescription({ navigation, route }) {
    const state = useSelector((state) => state);
    const [data, setData] = useState([]);
    const [customerData, setCustomerData] = useState({
        email: '',
        password: '',
        parent_name: '',
        children_data: []
    });
    const [awardList, setAwardList] = useState([]);
    const [classList, setClassList] = useState([]);

    useEffect(() => {
        // const added = state.authPage.auth_data?.assigned_schools.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
        // const result = added.filter(v => { return (v.region == state.authPage.auth_data?.assigned_region); });
        // setData(result);
        try {
            // const getParticularCustomer = async () => {
            //     const result = await GetParticularCustomerService(route.params.customerData._id);
            //     if (result) {
            //         var childrenData = [];
            //         result.children_data.length > 0 && result.children_data.forEach(element => {
            //             childrenData.push({
            //                 player_name: element.player_name,
            //                 player_age: element.player_age,
            //                 wristband_level: element.wristband_level,
            //                 school: element.school._id,
            //                 slot_list: state.authPage.auth_data?.schedules.map((v) => Object.assign(v, { key: `${v.date} (${v.start_time} to ${v.end_time})`, value: `${v.date} (${v.start_time} to ${v.end_time})` })).filter(v => { return (v.school == element.school._id); }),
            //                 slot: element.slot,
            //                 handed: element.handed,
            //                 num_buddy_books_read: element.num_buddy_books_read,
            //                 jersey_size: element.jersey_size,
            //                 visible: false,
            //                 current_award: { name: element.current_award.name, image: element.current_award.image }
            //             });
            //         });
            //         setCustomerData({
            //             user_id: result.user_id,
            //             email: result.email,
            //             password: result.password,
            //             parent_name: result.parent_name,
            //             created_by: result.created_by,
            //             children_data: childrenData
            //         });
            //     }
            // };
            // getParticularCustomer();

            const getAwardsList = async () => {
                const result = await GetAwardPhotosService();
                if (result) {
                    setAwardList(result);
                }
            };
            getAwardsList();

            const getClasses = async () => {
                const data = { created_by_user_id: state.authPage.auth_data?.user_id }
                const result = await GetClassCreatedByUserIdService(data);
                if (result) {
                    result.map(v => {
                        v.schedules.map(u => {
                            Object.assign(v, { value: v._id, label: `Class from ${u.date} (${u.start_time} to ${u.end_time})` })
                        })
                    })
                    setClassList(result)
                    const result1 = await GetParticularCustomerService(route.params.customerData._id);
                    if (result1) {
                        var childrenData = [];
                        result1.children_data.length > 0 && result1.children_data.forEach(element => {
                            element.class.schedules.map(u => {
                                Object.assign(element.class, { value: element.class._id, label: `Class from ${u.date} (${u.start_time} to ${u.end_time}) in ${element.class.school.school_name}` })
                            })
                            childrenData.push({
                                player_name: element.player_name,
                                player_age: element.player_age,
                                wristband_level: element.wristband_level,
                                class_list: result,
                                class: element.class,
                                // school: element.school._id,
                                // slot_list: state.authPage.auth_data?.schedules.map((v) => Object.assign(v, { key: `${v.date} (${v.start_time} to ${v.end_time})`, value: `${v.date} (${v.start_time} to ${v.end_time})` })).filter(v => { return (v.school == element.school._id); }),
                                // slot: element.slot,
                                handed: element.handed,
                                num_buddy_books_read: element.num_buddy_books_read,
                                jersey_size: element.jersey_size,
                                visible: false,
                                current_award: { name: element.current_award.name, image: element.current_award.image }
                            });
                        });
                        setCustomerData({
                            user_id: result1.user_id,
                            email: result1.email,
                            password: result1.password,
                            parent_name: result1.parent_name,
                            created_by: result1.created_by,
                            children_data: childrenData
                        });
                    }
                }
            }
            getClasses()
        } catch (e) { }
    }, []);

    const handleCustomerUpdate = async () => {
        try {
            customerData.children_data.forEach(v => delete v.calendar_visible);
            customerData.children_data.forEach(v => delete v.class_list);
            // customerData.children_data.forEach(v => delete v.slot_list);
            customerData.children_data.forEach(v => delete v.visible);
            const data = {
                email: customerData.email,
                password: customerData.password,
                parent_name: customerData.parent_name,
                children_data: customerData.children_data
            };
            const result = await UpdateCustomerService(customerData.user_id, route.params.customerData._id, data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Customer Updated Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Coach Customers")
                        }
                    ]
                );
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't Update Customer!"
            );
        }
    };

    console.log("values--->", customerData.children_data);

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
                    <View>
                        <Text style={styles.label}>Child</Text><TouchableOpacity onPress={() => {
                            setCustomerData({
                                ...customerData,
                                children_data: [...customerData.children_data, {
                                    player_name: '',
                                    calendar_visible: false,
                                    player_age: '',
                                    wristband_level: '',
                                    class_list: classList,
                                    class: '',
                                    // school: '',
                                    // slot_list: [],
                                    // slot: '',
                                    handed: '',
                                    num_buddy_books_read: '',
                                    jersey_size: '',
                                    visible: false,
                                    current_award: { name: '', image: '' }
                                }]
                            });
                        }}><Text>+</Text></TouchableOpacity>
                    </View>
                    {customerData.children_data.length > 0 && customerData.children_data.map((item, index) => {
                        return (
                            <View key={index}>
                                <Text style={styles.label}>Player Name</Text>
                                <TextInput
                                    name="player_name"
                                    placeholder="Player Name"
                                    onChangeText={(val) => {
                                        let newArr = [...customerData.children_data];
                                        newArr[index].player_name = val;
                                        setCustomerData({ ...customerData, children_data: newArr });
                                    }}
                                    value={item.player_name}
                                    style={styles.input}
                                />
                                {!item.player_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Player Name is Required</Text>
                                }
                                <Text style={styles.label}>Player Age</Text><Text onPress={() => {
                                    let newArr = [...customerData.children_data];
                                    newArr[index].calendar_visible = !newArr[index].calendar_visible;
                                    setCustomerData({ ...customerData, children_data: newArr });
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
                                            let newArr = [...customerData.children_data];
                                            newArr[index].calendar_visible = !newArr[index].calendar_visible;
                                            newArr[index].player_age = age;
                                            setCustomerData({ ...customerData, children_data: newArr });
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
                                        let newArr = [...customerData.children_data];
                                        newArr[index].wristband_level = val;
                                        setCustomerData({ ...customerData, children_data: newArr });
                                    }}
                                    value={item.wristband_level}
                                    style={styles.input}
                                />
                                {!item.wristband_level &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>WristBand Level is Required</Text>
                                }
                                <Text style={styles.label}>Class</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={item.class_list}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    searchPlaceholder="Search..."
                                    value={item.class}
                                    onChange={(val) => {
                                        let newArr = [...customerData.children_data];
                                        newArr[index].class = val;
                                        setCustomerData({ ...customerData, children_data: newArr });
                                    }}
                                />
                                {!item.class &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Class is Required</Text>
                                }
                                {/* <Text style={styles.label}>School</Text>
                                {item.school === '' ?
                                    <SelectList
                                        setSelected={(val) => {
                                            let newArr = [...customerData.children_data];
                                            newArr[index].school = val;
                                            setCustomerData({ ...customerData, children_data: newArr });
                                        }}
                                        data={data}
                                        save="key"
                                        onSelect={() => {
                                            let newArr = [...customerData.children_data];
                                            const slots = state.authPage.auth_data?.schedules.map((v) => Object.assign(v, { key: v._id, value: `${v.date} (${v.start_time} to ${v.end_time})` }));
                                            const result = slots.filter(v => { return (v.school == item.school); });
                                            newArr[index].slot_list = result;
                                            setCustomerData({ ...customerData, children_data: newArr });
                                        }}
                                        label="Selected School"
                                    />
                                    :
                                    <SelectList
                                        setSelected={(val) => {
                                            let newArr = [...customerData.children_data];
                                            newArr[index].school = val;
                                            setCustomerData({ ...customerData, children_data: newArr });
                                        }}
                                        data={data}
                                        save="key"
                                        onSelect={() => {
                                            let newArr = [...customerData.children_data];
                                            const slots = state.authPage.auth_data?.schedules.map((v) => Object.assign(v, { key: v._id, value: `${v.date} (${v.start_time} to ${v.end_time})` }));
                                            const result = slots.filter(v => { return (v.school == item.school); });
                                            newArr[index].slot_list = result;
                                            setCustomerData({ ...customerData, children_data: newArr });
                                        }}
                                        label="Selected School"
                                        defaultOption={{ key: item.school, value: data.filter(v => v.key === item.school)[0].value }}
                                    />
                                }
                                {!item.school &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>School is Required</Text>
                                }
                                <Text style={styles.label}>Slot</Text>
                                {item.slot === '' ?
                                    <SelectList
                                        setSelected={(val) => {
                                            let newArr = [...customerData.children_data];
                                            newArr[index].slot = val;
                                            setCustomerData({ ...customerData, children_data: newArr });
                                        }}
                                        data={item.slot_list}
                                        save="key"
                                        label="Selected Slot"
                                    />
                                    :
                                    <SelectList
                                        setSelected={(val) => {
                                            let newArr = [...customerData.children_data];
                                            newArr[index].slot = val;
                                            setCustomerData({ ...customerData, children_data: newArr });
                                        }}
                                        data={item.slot_list}
                                        save="value"
                                        label="Selected Slot"
                                        defaultOption={{ key: item.slot, value: item.slot }}
                                    />
                                }
                                {!item.slot &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Slot is Required</Text>
                                } */}
                                <Text style={styles.label}>Handed</Text>
                                <TextInput
                                    name="handed"
                                    placeholder="Handed"
                                    onChangeText={(val) => {
                                        let newArr = [...customerData.children_data];
                                        newArr[index].handed = val;
                                        setCustomerData({ ...customerData, children_data: newArr });
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
                                        let newArr = [...customerData.children_data];
                                        newArr[index].num_buddy_books_read = val;
                                        setCustomerData({ ...customerData, children_data: newArr });
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
                                        let newArr = [...customerData.children_data];
                                        newArr[index].jersey_size = val;
                                        setCustomerData({ ...customerData, children_data: newArr });
                                    }}
                                    value={item.jersey_size}
                                    style={styles.input}
                                />
                                {!item.jersey_size &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Jersey Size is Required</Text>
                                }
                                <Text style={styles.label}>Current Award</Text>
                                <TouchableOpacity onPress={() => {
                                    let newArr = [...customerData.children_data];
                                    newArr[index].visible = !newArr[index].visible;
                                    setCustomerData({ ...customerData, children_data: newArr });
                                }}>
                                    {/* <View style={styles.buttonText}><Text>Select the Award</Text></View> */}
                                    <View style={styles.buttonText}>{item.current_award.image ? <Image source={{ uri: item.current_award.image }} style={styles.buttonImage} /> : <Text>Select the Award</Text>}</View>
                                </TouchableOpacity>
                                {item.visible &&
                                    (<View style={styles.award}>
                                        {item.visible && awardList.map(v => {
                                            return (
                                                <ScrollView showsVerticalScrollIndicator>
                                                    <TouchableOpacity key={v.index} onPress={() => {
                                                        let newArr = [...customerData.children_data];
                                                        newArr[index].current_award.name = v.name;
                                                        newArr[index].current_award.image = v.url;
                                                        newArr[index].visible = !newArr[index].visible;

                                                        setCustomerData({ ...customerData, children_data: newArr });
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
                                        var array = [...customerData.children_data];
                                        var indexData = array.indexOf(item);
                                        if (indexData !== -1) {
                                            array.splice(indexData, 1);
                                            setCustomerData({ ...customerData, children_data: array });
                                        }
                                    }}>
                                    <Text >Remove</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                    <TouchableOpacity onPress={handleCustomerUpdate}>
                        <Text style={styles.submit}>Update</Text>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("Coach Customers")}>
                    <Text style={styles.backbtn}>Back</Text>
                </TouchableOpacity>
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
    },
    dropdown: {
        margin: 16,
        height: 60,
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
        height: 60
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