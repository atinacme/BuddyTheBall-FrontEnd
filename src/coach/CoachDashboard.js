import React, { useState, useEffect } from 'react';
import { Text, Image, SafeAreaView, View, StyleSheet, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from 'react-native-image-crop-picker';
import buddyBoy from '../assets/buddyGirl.png';
import photos from '../assets/PHOTOS_REV1.png';
import calendar from '../assets/CALENDAR_REV1.png';
import messages from '../assets/MESSAGES_REV1.png';
import parents from '../assets/PARENTS_REV1.png';
import schools from '../assets/SCHOOLS_REV1.png';
import axios from 'axios';
import Config from '../../Config';
import { GetAnyParticularImageService, GetParticularCoachService } from '../services/CoachService';
import { AuthPageAction } from '../redux/Actions';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressBar } from 'react-native-paper';
import { GetClassesService } from '../services/ClassService';
import moment from 'moment';
import { UpdateSessionService } from '../services/SessionService';

export default function CoachDashboard({ navigation }) {
    const state = useSelector((state) => state);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [classes, setClasses] = useState([]);
    const today = new Date();
    const [profileImg, setProfileImg] = useState();
    const baseUrl = Config.REACT_APP_BASE_URL;
    const dispatch = useDispatch();

    function getYear(timestamp) {
        return (new Date(timestamp * 1000)).getFullYear();
    }
    function getMon(timestamp) {
        return (new Date(timestamp * 1000)).getMonth();
    }
    function getDate(timestamp) {
        return (new Date(timestamp * 1000)).getDate();
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (progress < 1) {
                setElapsedTime(t => t + 1);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    function isCurrentInterval(start, end) {
        const currentTime = new Date();
        return currentTime >= start && currentTime <= end;
    }
    const sessionUpdate = async (id) => {
        try {
            const data = { status: "Ended" };
            await UpdateSessionService(id, data);
        } catch (e) { }
    };

    useEffect(() => {
        setProgress(elapsedTime / 3600);

        const getClasses = async () => {
            try {
                const result = await GetClassesService();
                if (result) {
                    result.map(v => {
                        if (v.school.region === state.authPage.auth_data?.assigned_region) {
                            v?.schedules?.map(u => {
                                if (u?.coaches?.some(element => element._id === state.authPage.auth_data?._id) === true) {
                                    return result;
                                }
                            });
                        }
                    });
                    const result1 = await GetAnyParticularImageService(state.authPage.auth_data?.profile_data.filename);
                    setProfileImg(result1);
                    console.log("xsxsx---->", profileImg);
                    const updatedArray = result.map(obj => ({
                        ...obj,
                        schedules: obj.schedules.filter(item => new Date(item.date).toLocaleDateString() === today.toLocaleDateString())
                    }));
                    const allNewArray = updatedArray.map(obj => ({
                        ...obj,
                        schedules: obj.schedules.map(u => {
                            var currentTime = new Date();
                            var parsedTimeCurrentString = Date.parse(currentTime);
                            var local = new Date().toLocaleDateString();
                            var newdate = local.split("/").reverse().join("-");
                            var timestamp = new Date(newdate).getTime() / 1000;
                            var startTime = moment(u.start_time, ["h:mm A"]).format("HH:mm");
                            var startTimeSplit = startTime.split(":");
                            var dateTimeStartString = new Date(getYear(timestamp), getMon(timestamp), getDate(timestamp), startTimeSplit[0], startTimeSplit[1]);
                            var parsedTimeStartString = Date.parse(dateTimeStartString);
                            var endTime = moment(u.end_time, ["h:mm A"]).format("HH:mm");
                            var endTimeSplit = endTime.split(":");
                            var dateTimeEndString = new Date(getYear(timestamp), getMon(timestamp), getDate(timestamp), endTimeSplit[0], endTimeSplit[1]);
                            var parsedTimeEndString = Date.parse(dateTimeEndString);
                            if (u.status === "Incomplete" && isCurrentInterval(dateTimeStartString, dateTimeEndString)) {
                                return { ...u, progress: progress };
                            } else if (u.status === "Incomplete" && parsedTimeCurrentString >= parsedTimeStartString && parsedTimeCurrentString >= parsedTimeEndString) {
                                // sessionUpdate(u._id);
                            } else if (u.status === "Incomplete" && parsedTimeCurrentString <= parsedTimeStartString) {
                                return { ...u, progress: 0 };
                            } else {
                                return { ...u, progress: 1 };
                            }
                        })
                    }));
                    setClasses(allNewArray);
                }
            } catch (e) { console.log(e.message); }
        };
        getClasses();
    }, [elapsedTime]);

    const [dt, setDt] = useState(new Date().toLocaleString());

    useEffect(() => {
        let secTimer = setInterval(() => {
            setDt(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(secTimer);
    }, []);


    useEffect(() => {
        const getCoachData = async () => {
            try {
                const result = await GetParticularCoachService(state.authPage.auth_data?._id);
                if (result) {
                    dispatch(AuthPageAction(state.authPage.id, state.authPage.email, state.authPage.roles, result, state.authPage.accessToken));
                    setUploadResult(false);
                }
            } catch (e) { }
        };
        if (uploadResult) {
            getCoachData();
        }
    }, [uploadResult]);

    const openGallery = async () => {
        const result = await ImagePicker.openPicker({
            multiple: true
        });
        setSelectedFile(result);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('coach_id', state.authPage.auth_data?._id);
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
                            <Image source={{ uri: profileImg }} style={styles.profileImg} />
                            :
                            <>
                                {selectedFile !== null ?
                                    <Image source={{ uri: selectedFile[0].path }} style={{ width: 200, height: 150, marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10 }} />
                                    :
                                    <Image source={buddyBoy} style={{ width: 200, height: 150, marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10 }} />
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
                {/* {console.log("wdwdxw---->", state.authPage.auth_data?.profile_data)} */}
                {state.authPage.auth_data?.profile_data && state.authPage.auth_data?.profile_data.url === undefined ? <Text style={styles.playPara}>Upload Player Picture</Text> : null}
                {state.authPage.auth_data && (
                    <>
                        <Text style={styles.heading}>Coach {state.authPage.auth_data?.coach_name}</Text>
                        <Text style={styles.txt}>Tennis Club: {state.authPage.auth_data?.tennis_club}</Text>
                        <Text style={styles.txt}>Favorite Pro Player: {state.authPage.auth_data?.favorite_pro_player}</Text>
                        <Text style={styles.txt}>Handed: {state.authPage.auth_data?.handed}</Text>
                        <Text style={styles.txt}>Favorite Drill: {state.authPage.auth_data?.favorite_drill}</Text>
                    </>
                )}
                <ScrollView showsVerticalScrollIndicator style={{ height: 320 }}>
                    {classes.length > 0 && classes.map((v, index) => {
                        return (
                            <View key={index}>
                                <Text>Class Name: {v.topic}</Text>
                                <Text>School: {v.school.school_name}</Text>
                                {v.schedules.length > 0 && v.schedules.map((u, i) => {
                                    return (
                                        <View key={i}>
                                            <Text>Session Topic: {u?.topic}</Text>
                                            <Text>Start Time: {u?.start_time} End Time: {u?.end_time}</Text>
                                            <ProgressBar progress={u?.progress} />
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    })}
                    <Text style={styles.adminWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("Coach Schools Photos")}>
                            <Image source={photos} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Coach Messages")}>
                            <Image source={messages} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Coach School List")}>
                            <Image source={schools} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Coach Calendar")}>
                            <Image source={calendar} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Coach Parents")}>
                            <Image source={parents} style={{ width: 300, height: 100, resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto' }} />
                        </TouchableOpacity>
                    </Text>
                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => {
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
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    adminbtn: {
        // display: 'flex',
        alignItems: 'center',
        // flexDirection: 'row',
        justifyContent: 'center',
        // marginBottom: 50,
        // position: 'absolute',
        // bottom: 0,
        // width: 300,
        // paddingBottom: 20
    },
    btnWrapper: {
        borderColor: "#fff",
        padding: 10,
        // paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        width: 300,
    },
    adminWrapper: {
        display: 'flex',
        // alignItems: 'center',
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
        // marginTop: 30,
        // marginBottom: 30,
        // paddingBottom: 50,
    },
    txt: {
        fontFamily: 'LemonJuice',
        textAlign: 'center',
        fontSize: 18,
    },
    dashimgWrap: {
        textAlign: 'center',
        marginTop: 50
    },
    heading: {
        fontSize: 25,
        textAlign: 'center',
        padding: 5,
        fontFamily: 'LemonJuice'
    },
    wrapper: {
        paddingTop: 0,
        paddingBottom: 30,
        paddingLeft: 10,
        paddingRight: 10
    },
    playPara: {
        textAlign: 'center',
        color: '#000',
        fontFamily: 'LemonJuice'
    },
    btnCta: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        fontFamily: 'LemonJuice'
    },
    cta: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        fontFamily: 'LemonJuice'
    },
    btnCtawrap: {
        width: 160,
        marginBottom: 10,
        fontFamily: 'LemonJuice'
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