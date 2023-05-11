import React, { useState, useEffect } from 'react';
import { Text, Image, SafeAreaView, View, StyleSheet, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from 'react-native-image-crop-picker';
import buddyBoy from '../assets/buddyGirl.png';
import axios from 'axios';
import Config from '../../Config';
import { AuthPageAction } from '../redux/Actions';
import LinearGradient from 'react-native-linear-gradient';
import { GetParticularRegionalManagerService } from '../services/RegionalManagerService';

export default function RegionalManagerDashboard({ navigation }) {
    const state = useSelector((state) => state);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            const getRegionalManagerData = async () => {
                const result = await GetParticularRegionalManagerService(state.authPage.auth_data?._id);
                if (result) {
                    dispatch(AuthPageAction(state.authPage.id, state.authPage.email, state.authPage.roles, result, state.authPage.accessToken));
                    setUploadResult(false);
                }
            };
            if (uploadResult) {
                getRegionalManagerData();
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
        formData.append('regional_manager_id', state.authPage.auth_data?._id);
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
                url: `${process.env.REACT_APP_BASE_URL}/uploadCustomerPhotos`,
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
                <ScrollView showsVerticalScrollIndicator>
                    <Text style={styles.dashimgWrap}>
                        <TouchableOpacity onPress={openGallery} style={styles.profileImgContainer}>
                            {state.authPage.auth_data?.profile_data && state.authPage.auth_data?.profile_data.url ?
                                <Image source={{ uri: state.authPage.auth_data?.profile_data.url }} style={styles.profileImg} />
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
                    {state.authPage.auth_data?.profile_data && state.authPage.auth_data?.profile_data.url === undefined ? <Text style={styles.playPara}>Upload Player Picture</Text> : null}
                    {state.authPage.auth_data && (
                        <>
                            <Text style={styles.heading}>Regional Manager {state.authPage.auth_data?.regional_manager_name}</Text>
                            <Text style={styles.txt}>Region: {state.authPage.auth_data?.assigned_region}</Text>
                        </>
                    )}
                    <Text style={styles.adminWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Photos")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg1 }}>PHOTOS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Customers")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg2 }}>PARENTS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Calendar")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg3 }}>CALENDAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Coaches")}>
                            <Text style={{ ...styles.adminContainer, ...styles.adminBg4 }}>COACHES</Text>
                        </TouchableOpacity>
                    </Text>
                    <View style={styles.adminbtn}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("SignIn");
                            dispatch(AuthPageAction('', '', '', '', ''));
                        }}>
                            <Text style={styles.btnWrapper}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    adminbtn: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingTop: 40,
        paddingBottom: 20
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
        width: 120,
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
        marginTop: 25,
        width: 320,
    },
    adminWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 30,
        paddingBottom: 50
    },
    adminContainer: {
        width: 155,
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
        backgroundColor: '#ffc000'
    },
    adminBg2: {
        backgroundColor: '#ffff00'
    },
    adminBg3: {
        backgroundColor: '#ed7d31'
    },
    adminBg4: {
        backgroundColor: '#0070c0'
    },
    adminBg5: {
        backgroundColor: '#ff0000'
    },
    txt: {
        fontFamily: 'LemonJuice',
        textAlign: 'center',
        fontSize: 18,
    },
    dashimgWrap: {
        textAlign: 'center',
        marginTop: 10
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
