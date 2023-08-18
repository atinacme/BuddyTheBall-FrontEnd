import React, { useState, useEffect } from 'react';
import { Text, Image, SafeAreaView, View, StyleSheet, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import photos from '../assets/PHOTOS_REV1.png';
import messages from '../assets/MESSAGES_REV1.png';
import black from '../assets/BLACK_WRISTBAND_LEVEL.png';
import blue from '../assets/BLUE_WRISTBAND_LEVEL.png';
import green from '../assets/GREEN_WRISTBAND_LEVEL.png';
import orange from '../assets/ORANGE_WRISTBAND_LEVEL.png';
import purple from '../assets/PURPLE_WRISTBAND_LEVEL.png';
import red from '../assets/RED_WRISTBAND_LEVEL.png';
import white from '../assets/WHITE_WRISTBAND_LEVEL.png';
import yellow from '../assets/YELLOW_WRISTBAND_LEVEL.png';
import Award_All_8 from '../assets/Award-All-8.png';
import Award_Always_Ready from '../assets/Award-Always-Ready.png';
import Award_Attendance from '../assets/Award-Attendance.png';
import Award_Ball_Balance_Skills from '../assets/Award-Ball-Balance-Skills.png';
import Award_Bella from '../assets/Award-Bella.png';
import Award_Black_Level from '../assets/Award-Black-Level.png';
import Award_Blue_Level from '../assets/Award-Blue-Level.png';
import Award_Bounce_Downs_Champion from '../assets/Award-Bounce-Downs-Champion.png';
import Award_Bounce_Ups_Champion from '../assets/Award-Bounce-Ups-Champion.png';
import Award_Buddy from '../assets/Award-Buddy.png';
import Award_Competitive_Greatness from '../assets/Award-Competitive-Greatness.png';
import Award_Confidence from '../assets/Award-Confidence.png';
import Award_Courage from '../assets/Award-Courage.png';
import Award_Craddle from '../assets/Award-Craddle.png';
import Award_Enrolled_1st_Season from '../assets/Award-Enrolled-1st-Season.png';
import Award_Fast_Feet from '../assets/Award-Fast-Feet.png';
import Award_Flip_Flop_Champ from '../assets/Award-Flip-Flop-Champ.png';
import Award_Goal_Setter from '../assets/Award-Goal-Setter.png';
import Award_Good_Belief from '../assets/Award-Good-Belief.png';
import Award_Good_Coordination from '../assets/Award-Good-Coordination.png';
import Award_Good_Ears from '../assets/Award-Good-Ears.png';
import Award_Good_Energy from '../assets/Award-Good-Energy.png';
import Award_Good_Reader from '../assets/Award-Good-Reader.png';
import Award_Good_Technique from '../assets/Award-Good-Technique.png';
import Award_Green_Level from '../assets/Award-Green-Level.png';
import Award_Jump_Rope from '../assets/Award-Jump-Rope.png';
import Award_Lobster_Trap_Champ from '../assets/Award-Lobster-Trap-Champ.png';
import Award_Making_Friends from '../assets/Award-Making-Friends.png';
import Award_Multi_Shirt from '../assets/Award-Multi-Shirt.png';
import Award_Orange_Level from '../assets/Award-Orange-Level.png';
import Award_Perseverance from '../assets/Award-Perseverance.png';
import Award_Purple_Level from '../assets/Award-Purple-Level.png';
import Award_Quick_Reactions from '../assets/Award-Quick-Reactions.png';
import Award_Red_Level from '../assets/Award-Red-Level.png';
import Award_Rocky from '../assets/Award-Rocky.png';
import Award_Spirit from '../assets/Award-Spirit.png';
import Award_Stellar_Sport from '../assets/Award-Stellar-Sport.png';
import Award_Teamwork from '../assets/Award-Teamwork.png';
import Award_White_Level from '../assets/Award-White-Level.png';
import Award_Willing_to_Try from '../assets/Award-Willing-to-Try.png';
import Award_Yellow_Level from '../assets/Award-Yellow-Level.png';
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from 'react-native-image-crop-picker';
import buddyGirl from '../assets/buddyGirl.png';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import Config from '../../Config';
import { AuthPageAction } from '../redux/Actions';
import { GetParticularParentService } from '../services/ParentService';

export default function ParentDashboard({ navigation }) {
    const state = useSelector((state) => state);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const getCustomerData = async () => {
            try {
                const result = await GetParticularParentService(state.authPage.auth_data?._id);
                if (result) {
                    dispatch(AuthPageAction(state.authPage.id, state.authPage.email, state.authPage.roles, result, state.authPage.accessToken));
                    setUploadResult(false);
                }
            } catch (e) { }
        };
        if (uploadResult) {
            getCustomerData();
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
                            {state.authPage?.auth_data?.children_data?.map((v, index) => {
                                return (
                                    <View key={index}>
                                        <Text>Child Name: {v?.player_name}</Text>
                                        <Text>Child Age: {v?.player_age}</Text>
                                        <Text>Wristband Level:</Text>
                                        {v?.wristband_level === 'Black' ? <Image resizeMode="contain" source={black} style={styles.image} /> :
                                            v?.wristband_level === 'Blue' ? <Image resizeMode="contain" source={blue} style={styles.image} /> :
                                                v?.wristband_level === 'Green' ? <Image resizeMode="contain" source={green} style={styles.image} /> :
                                                    v?.wristband_level === 'Orange' ? <Image resizeMode="contain" source={orange} style={styles.image} /> :
                                                        v?.wristband_level === 'Purple' ? <Image resizeMode="contain" source={purple} style={styles.image} /> :
                                                            v?.wristband_level === 'Red' ? <Image resizeMode="contain" source={red} style={styles.image} /> :
                                                                v?.wristband_level === 'White' ? <Image resizeMode="contain" source={white} style={styles.image} /> :
                                                                    <Image resizeMode="contain" source={yellow} style={styles.image} />
                                        }
                                        <Text>Handed: {v?.handed}</Text>
                                        <Text>Number of Buddy Books Read: {v?.num_buddy_books_read}</Text>
                                        <Text>Jersey Size: {v?.jersey_size}</Text>
                                        <Text>Class Created By: {v?.class?.created_by_name}</Text>
                                        <Text>Current Award:</Text>
                                        {v?.current_award.award_name === 'Award-All-8' ? <Image resizeMode="contain" source={Award_All_8} style={styles.image} /> :
                                            v?.current_award.award_name === 'Award-Always-Ready' ? <Image resizeMode="contain" source={Award_Always_Ready} style={styles.image} /> :
                                                v?.current_award.award_name === 'Award-Attendance' ? <Image resizeMode="contain" source={Award_Attendance} style={styles.image} /> :
                                                    v?.current_award.award_name === 'Award-Ball-Balance-Skills' ? <Image resizeMode="contain" source={Award_Ball_Balance_Skills} style={styles.image} /> :
                                                        v?.current_award.award_name === 'Award-Bella' ? <Image resizeMode="contain" source={Award_Bella} style={styles.image} /> :
                                                            v?.current_award.award_name === 'Award-Black-Level' ? <Image resizeMode="contain" source={Award_Black_Level} style={styles.image} /> :
                                                                v?.current_award.award_name === 'Award-Blue-Level' ? <Image resizeMode="contain" source={Award_Blue_Level} style={styles.image} /> :
                                                                    v?.current_award.award_name === 'Award-Bounce-Downs-Champion' ? <Image resizeMode="contain" source={Award_Bounce_Downs_Champion} style={styles.image} /> :
                                                                        v?.current_award.award_name === 'Award-Bounce-Ups-Champion' ? <Image resizeMode="contain" source={Award_Bounce_Ups_Champion} style={styles.image} /> :
                                                                            v?.current_award.award_name === 'Award-Buddy' ? <Image resizeMode="contain" source={Award_Buddy} style={styles.image} /> :
                                                                                v?.current_award.award_name === 'Award-Competitive-Greatness' ? <Image resizeMode="contain" source={Award_Competitive_Greatness} style={styles.image} /> :
                                                                                    v?.current_award.award_name === 'Award-Confidence' ? <Image resizeMode="contain" source={Award_Confidence} style={styles.image} /> :
                                                                                        v?.current_award.award_name === 'Award-Courage' ? <Image resizeMode="contain" source={Award_Courage} style={styles.image} /> :
                                                                                            v?.current_award.award_name === 'Award-Craddle' ? <Image resizeMode="contain" source={Award_Craddle} style={styles.image} /> :
                                                                                                v?.current_award.award_name === 'Award-Enrolled-1st-Season' ? <Image resizeMode="contain" source={Award_Enrolled_1st_Season} style={styles.image} /> :
                                                                                                    v?.current_award.award_name === 'Award-Fast-Feet' ? <Image resizeMode="contain" source={Award_Fast_Feet} style={styles.image} /> :
                                                                                                        v?.current_award.award_name === 'Award-Flip-Flop-Champ' ? <Image resizeMode="contain" source={Award_Flip_Flop_Champ} style={styles.image} /> :
                                                                                                            v?.current_award.award_name === 'Award-Goal-Setter' ? <Image resizeMode="contain" source={Award_Goal_Setter} style={styles.image} /> :
                                                                                                                v?.current_award.award_name === 'Award-Good-Belief' ? <Image resizeMode="contain" source={Award_Good_Belief} style={styles.image} /> :
                                                                                                                    v?.current_award.award_name === 'Award-Good-Coordination' ? <Image resizeMode="contain" source={Award_Good_Coordination} style={styles.image} /> :
                                                                                                                        v?.current_award.award_name === 'Award-Good-Ears' ? <Image resizeMode="contain" source={Award_Good_Ears} style={styles.image} /> :
                                                                                                                            v?.current_award.award_name === 'Award-Good-Energy' ? <Image resizeMode="contain" source={Award_Good_Energy} style={styles.image} /> :
                                                                                                                                v?.current_award.award_name === 'Award-Good-Reader' ? <Image resizeMode="contain" source={Award_Good_Reader} style={styles.image} /> :
                                                                                                                                    v?.current_award.award_name === 'Award-Good-Technique' ? <Image resizeMode="contain" source={Award_Good_Technique} style={styles.image} /> :
                                                                                                                                        v?.current_award.award_name === 'Award-Green-Level' ? <Image resizeMode="contain" source={Award_Green_Level} style={styles.image} /> :
                                                                                                                                            v?.current_award.award_name === 'Award-Jump-Rope' ? <Image resizeMode="contain" source={Award_Jump_Rope} style={styles.image} /> :
                                                                                                                                                v?.current_award.award_name === 'Award-Lobster-Trap-Champ' ? <Image resizeMode="contain" source={Award_Lobster_Trap_Champ} style={styles.image} /> :
                                                                                                                                                    v?.current_award.award_name === 'Award-Making-Friends' ? <Image resizeMode="contain" source={Award_Making_Friends} style={styles.image} /> :
                                                                                                                                                        v?.current_award.award_name === 'Award-Multi-Shirt' ? <Image resizeMode="contain" source={Award_Multi_Shirt} style={styles.image} /> :
                                                                                                                                                            v?.current_award.award_name === 'Award-Orange-Level' ? <Image resizeMode="contain" source={Award_Orange_Level} style={styles.image} /> :
                                                                                                                                                                v?.current_award.award_name === 'Award-Perseverance' ? <Image resizeMode="contain" source={Award_Perseverance} style={styles.image} /> :
                                                                                                                                                                    v?.current_award.award_name === 'Award-Purple-Level' ? <Image resizeMode="contain" source={Award_Purple_Level} style={styles.image} /> :
                                                                                                                                                                        v?.current_award.award_name === 'Award-Quick-Reactions' ? <Image resizeMode="contain" source={Award_Quick_Reactions} style={styles.image} /> :
                                                                                                                                                                            v?.current_award.award_name === 'Award-Red-Level' ? <Image resizeMode="contain" source={Award_Red_Level} style={styles.image} /> :
                                                                                                                                                                                v?.current_award.award_name === 'Award-Rocky' ? <Image resizeMode="contain" source={Award_Rocky} style={styles.image} /> :
                                                                                                                                                                                    v?.current_award.award_name === 'Award-Spirit' ? <Image resizeMode="contain" source={Award_Spirit} style={styles.image} /> :
                                                                                                                                                                                        v?.current_award.award_name === 'Award-Stellar-Sport' ? <Image resizeMode="contain" source={Award_Stellar_Sport} style={styles.image} /> :
                                                                                                                                                                                            v?.current_award.award_name === 'Award-Teamwork' ? <Image resizeMode="contain" source={Award_Teamwork} style={styles.image} /> :
                                                                                                                                                                                                v?.current_award.award_name === 'Award-White-Level' ? <Image resizeMode="contain" source={Award_White_Level} style={styles.image} /> :
                                                                                                                                                                                                    v?.current_award.award_name === 'Award-Willing-to-Try' ? <Image resizeMode="contain" source={Award_Willing_to_Try} style={styles.image} /> :
                                                                                                                                                                                                        <Image resizeMode="contain" source={Award_Yellow_Level} style={styles.image} />
                                        }
                                        <Text>Class Sessions:</Text>
                                        {v?.class?.schedules?.map((q, index) => {
                                            return (
                                                <View key={index}>
                                                    <Text>Session {index + 1}</Text>
                                                    <Text>
                                                        On {q.date} From {q.start_time} to {q.end_time} By {q.coaches.map(w => w.coach_name)}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
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
        width: 325,
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
        // flex: 1,
        width: 300,
        marginTop: 0,
        // height: 60,
    },
    current_image: {
        flex: 1,
        width: 100,
        height: 60,
    },
});
