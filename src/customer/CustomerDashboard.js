import React, { useState, useEffect } from 'react';
import { Text, Image, SafeAreaView, View, StyleSheet, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import spark from '../assets/spark.png';
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from 'react-native-image-crop-picker';
import buddyGirl from '../assets/buddyGirl.png';
import axios from 'axios';
import Config from '../../Config';
import { GetParticularCustomerService } from '../services/CustomerService';
import { AuthPageAction } from '../redux/Actions';

export default function CustomerDashboard({ navigation }) {
    const state = useSelector((state) => state);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            const getCustomerData = async () => {
                const result = await GetParticularCustomerService(state.authPage.auth_data?._id);
                if (result) {
                    dispatch(AuthPageAction(state.authPage.id, state.authPage.email, state.authPage.roles, result, state.authPage.accessToken));
                    setUploadResult(false);
                }
            };
            if (uploadResult) {
                getCustomerData();
            }
        } catch (e) { }
    }, [uploadResult]);

    const openGallery = async () => {
        const result = await ImagePicker.openPicker({
            multiple: true
        });
        setSelectedFile(result);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('customer_id', state.authPage.auth_data?._id);
        formData.append('role', state.authPage.roles[0]);
        formData.append('file_type', 'profile');
        const newImageUri = "file:///" + selectedFile[0].path.split("file:/").join("");
        formData.append('file', {
            uri: newImageUri,
            type: selectedFile[0].mime,
            name: newImageUri.split("/").pop()
        });
        try {
            const res = await axios({
                method: 'post',
                url: `${Config.REACT_APP_BASE_URL}/uploadCustomerPhotos`,
                data: formData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res) {
                Alert.alert(
                    "Alert",
                    "Profile Picture Uploaded Sucessfully",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setSelectedFile(null);
                                setUploadResult(true);
                            }
                        }
                    ]
                );
            }
        } catch (e) { }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.dashimgWrap}>
                    <TouchableOpacity onPress={openGallery} style={styles.profileImgContainer}>
                        {state.authPage.auth_data?.profile_data && state.authPage.auth_data?.profile_data.url ?
                            <Image source={{ uri: state.authPage.auth_data?.profile_data.url }} style={styles.profileImg} />
                            :
                            <>
                                {selectedFile !== null ?
                                    <Image source={{ uri: selectedFile[0].path }} style={{ width: 200, height: 150, marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10 }} />
                                    :
                                    <Image source={buddyGirl} style={{ width: 200, height: 150, marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10 }} />
                                }
                            </>
                        }
                    </TouchableOpacity>
                </Text>
                {selectedFile !== null && (
                    <Button
                        title="Upload"
                        color="#000"
                        style={{ marginTop: 40, marginBottom: 40 }}
                        onPress={handleUpload}
                    />
                )}
                {state.authPage?.auth_data?.profile_data && state.authPage.auth_data?.profile_data.url === undefined ? <Text style={styles.playPara}>Upload Player Picture</Text> : null}
                {state.authPage?.auth_data && (
                    <>
                        <Text style={styles.heading}>{state.authPage.auth_data?.parent_name}</Text>
                        {state.authPage?.auth_data?.children_data?.map(v => {
                            { console.log("dhfh---->", v) }
                            return (
                                <>
                                    <Text>Player Name: {v.player_name}</Text>
                                    <Text>Player Age: {v.player_age}</Text>
                                    <Text>Wristband Level: {v.wristband_level}</Text>
                                    <Text>Handed: {v.handed}</Text>
                                    <Text>Number of Buddy Books Read: {v.num_buddy_books_read}</Text>
                                    <Text>Jersey Size: {v.jersey_size}</Text>
                                    <Text>Class Created By: {v.class.created_by_name}</Text>
                                    <Text>Class Schedules:</Text>
                                    {v.class?.schedules?.map((q, index) => {
                                        return (
                                            <>
                                                <Text>Schedule {index + 1}</Text>
                                                <Text>
                                                    On {q.date} From {q.start_time} to {q.end_time} By {q.coaches.map(w => w.coach_name)}
                                                </Text>
                                            </>
                                        )
                                    })}
                                </>
                            )
                        })}
                    </>
                )}
                <View style={styles.dashContentWrap}>
                    <View style={styles.dashContent}>
                        <Text style={styles.label}>Class Photos</Text>
                        <Button
                            title="ENTER"
                            color="#000"
                            onPress={() => navigation.navigate("Customer Photos")}
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Current Award</Text>
                        <Image source={spark} style={{ width: 40, height: 40, marginLeft: 'auto', marginRight: 'auto' }} />
                    </View>
                </View>
                <View>
                    <Text style={styles.label}>Message School Coach</Text>
                    <Button
                        title="MESSAGE"
                        color="#000"
                        onPress={() => navigation.navigate("Customer Messages")}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Button
                        title="Logout"
                        color="#000"
                        onPress={() => {
                            navigation.navigate("SignIn");
                            dispatch(AuthPageAction('', '', '', '', ''));
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 20,
    },
    wrapper: {
        paddingTop: 20,
        paddingBottom: 30,
        paddingLeft: 10,
        paddingRight: 10
    },
    playPara: {
        textAlign: 'center',
        color: '#000'
    },
    heading: {
        fontSize: 30,
        textAlign: 'center',
        padding: 20
    },
    dashimgWrap: {
        textAlign: 'center',
        marginTop: 10
    },
    label: {
        fontSize: 18,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 10
    },
    dashContentWrap: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dashContent: {
        width: 180
    },
    profileImgContainer: {
        marginLeft: 8,
        height: 150,
        width: 150,
        borderRadius: 100,
    },
    profileImg: {
        height: 150,
        width: 150,
        borderRadius: 100,
    }
});
