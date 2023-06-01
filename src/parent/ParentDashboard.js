import React, { useState, useEffect } from 'react';
import { Text, Image, SafeAreaView, View, StyleSheet, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import photos from '../assets/PHOTOS_REV1.png';
import messages from '../assets/MESSAGES_REV1.png';
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from 'react-native-image-crop-picker';
import buddyGirl from '../assets/buddyGirl.png';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import Config from '../../Config';
import { GetParticularCustomerService } from '../services/ParentService';
import { AuthPageAction } from '../redux/Actions';

export default function ParentDashboard({ navigation }) {
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
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
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
                <ScrollView style={styles.scrollView}>
                    {state.authPage?.auth_data && (
                        <>
                            <Text style={styles.heading}>{state.authPage.auth_data?.parent_name}</Text>
                            {state.authPage?.auth_data?.children_data?.map(v => {
                                return (
                                    <>
                                        <Text>Child Name: {v.player_name}</Text>
                                        <Text>Child Age: {v.player_age}</Text>
                                        <Text>Wristband Level: {v.wristband_level}</Text>
                                        <Text>Handed: {v.handed}</Text>
                                        <Text>Number of Buddy Books Read: {v.num_buddy_books_read}</Text>
                                        <Text>Jersey Size: {v.jersey_size}</Text>
                                        <Text>Class Created By: {v.class?.created_by_name}</Text>
                                        <Text style={styles.awarwrap}>Current Award: <Image resizeMode="cover" source={{ uri: v.current_award.image }} style={styles.image} /></Text>
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
                    <View style={styles.adminWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("Parent Photos")}>
                            <Image source={photos} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Parent Messages")}>
                            <Image source={messages} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("SignIn");
                            dispatch(AuthPageAction('', '', '', '', ''));
                        }}>
                        <Text style={styles.btnWrapper}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 20,
        height: 450
    },
    btnWrapper: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        width: 295,
    },
    adminWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20
    },
    adminContainer: {
        width: 135,
        margin: 5,
        padding: 35,
        paddingLeft: 0,
        paddingRight: 0,
        color: '#000',
        fontSize: 12,
        height: 100,
        borderRadius: 10,
        textAlign: 'center',
        lineHeight: 20,
        borderWidth: 3,
        borderColor: '#fff',
        fontWeight: '600',
        fontFamily: 'LemonJuice',
        verticalAlign: 'middle'
    },
    adminBg1: {
        backgroundColor: '#00b050'
    },
    adminBg2: {
        backgroundColor: '#5b9bd5'
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
    },
    awarwrap: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 0

    },
    image: {
        flex: 1,
        width: 100,
        height: 60,
    },
});
