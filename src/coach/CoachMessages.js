import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import rightArrow from '../assets/right-arrow.png';
import message from '../assets/message.png';
import { SafeAreaView, Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { GetMessagesBySenderIdService } from '../services/ParentService';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

export default function CoachMessages({ navigation }) {
    const state = useSelector((state) => state);
    const [senderMessages, setSenderMessages] = useState([]);

    useEffect(() => {
        try {
            const getMessagesBySenderId = async () => {
                const result = await GetMessagesBySenderIdService(state.authPage.auth_data?._id);
                if (result) {
                    setSenderMessages(result);
                }
            };
            getMessagesBySenderId();
        } catch (e) { }
    }, []);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                {senderMessages.map(item => {
                    return (
                        <TouchableOpacity key={item._id} onPress={() => navigation.navigate("Coach Particular Message", { messages: item })}>
                            {item.sender_role === "coach" ?
                                <View key={item._id} style={styles.messagewrap}>
                                    <Image source={{ uri: item.receiver_profile_url }} style={{ width: 40, height: 40, borderRadius: 60 }} />
                                    <Text style={styles.msgName}>{item.receiver_name}</Text>
                                    <Text style={styles.msgWrap}>{item.last_message}</Text>
                                    <Text style={styles.rightsec}>
                                        <Text style={styles.msgDay}>{moment(item.time).format('dddd')}</Text>
                                        <Image source={rightArrow} style={{ width: 15, height: 15 }} />
                                    </Text>
                                </View>
                                :
                                <View key={item._id} style={styles.messagewrap}>
                                    <Image source={{ uri: item.sender_profile_url }} style={{ width: 30, height: 30 }} />
                                    <Text style={styles.msgName}>{item.sender_name}</Text>
                                    <Text style={styles.msgWrap}>{item.last_message}</Text>
                                    <Text style={styles.rightsec}>
                                        <Text style={styles.msgDay}>{moment(item.time).format('dddd')}</Text>
                                        <Image source={rightArrow} style={{ width: 15, height: 15 }} />
                                    </Text>
                                </View>
                            }
                        </TouchableOpacity>
                    );
                })}
                <TouchableOpacity onPress={() => navigation.navigate("Coach Message Creation")}>
                    <View style={styles.messageImageHolder}>
                        <Image resizeMode={"contain"} source={message} />
                    </View>
                </TouchableOpacity>
                <View style={styles.bckcta}>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Dashboard")}>
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
        marginBottom: 56,
        marginTop: 60
    },
    bckcta: {
        position: 'absolute',
        bottom: 0,
        right: 15
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
        display: 'flex',
        right: 0,
        width: 100,
        bottom: 0,
        marginBottom: 10,
        justifyContent: 'flex-end'
    },
    linearGradient: {
        flex: 1,
    },
    messagewrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    msgWrap: {
        paddingTop: 0,
        marginTop: 0,
        fontFamily: 'LemonJuice'
    },
    msgName: {
        textAlign: 'left',
        color: '#000',
        fontFamily: 'LemonJuice'
    },
    msgDay: {
        textAlign: 'right',
        color: '#000',
        marginRight: 10,
        fontFamily: 'LemonJuice'
    },
    messageImageHolder: {
        position: 'relative',
        left: 0,
        right: 0,
        top: '400%',
        width: 80,
        height: 80,
        aspectRatio: 1 / 1,
        backgroundColor: '#ffc000',
        padding: 20,
        borderColor: '#d8d8d8',
        borderRadius: 50,
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
    },
});