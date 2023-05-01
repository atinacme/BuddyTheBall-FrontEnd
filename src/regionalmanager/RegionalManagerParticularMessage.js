import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import send_button from '../assets/send_button.png';
import profile from '../assets/profile.png';
import { SafeAreaView, Text, TextInput, StyleSheet, View, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import { CreateAndUpdateMessageService, GetMessagesBySenderIdReceiverIdService } from '../services/CustomerService';

export default function RegionalManagerParticularMessage({ navigation, route }) {
    const state = useSelector((state) => state);
    const [senderMessages, setSenderMessages] = useState([]);
    const [message, setMessage] = useState();
    const [msgResult, setMsgResult] = useState();

    useEffect(() => {
        try {
            const getMessagesBySenderIdReceiverId = async () => {
                var result;
                if (route.params.messages.sender_role === 'coach') {
                    result = await GetMessagesBySenderIdReceiverIdService(state.authPage.auth_data?._id, route.params.messages.receiver_id);
                } else {
                    result = await GetMessagesBySenderIdReceiverIdService(state.authPage.auth_data?._id, route.params.messages.sender_id);
                }
                if (result) {
                    setSenderMessages(result[0]);
                }
            };
            getMessagesBySenderIdReceiverId();
        } catch (e) { }
    }, [msgResult]);

    const handleSendMessage = async () => {
        try {
            const data = {
                message_id: route.params.messages._id,
                messanger_id: state.authPage.auth_data?._id,
                role: 'coach',
                receiver_id: route.params.messages.receiver_id,
                receiver_role: senderMessages.receiver_role,
                url: state.authPage.auth_data?.profile_data.url,
                message: message,
                messanger_name: state.authPage.auth_data?.coach_name
            };
            const result = await CreateAndUpdateMessageService(data);
            if (result) {
                setMsgResult(result);
                setMessage();
                // navigation.navigate("Coach Dashboard");
            }
        } catch (e) { }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {senderMessages?.messages?.map(item => {
                    return (
                        <View key={item._id} style={styles.DateName}>
                            {item.url ?
                                <View style={styles.pro_img}>
                                    <Image source={{ uri: item.url }} style={{ width: 40, height: 40 }} />
                                </View>
                                :
                                <View style={styles.pro_img}>
                                    <Image source={profile} style={{ width: 40, height: 40, borderRadius: 50, backgroundColor: '#fff' }} />
                                </View>
                            }
                            <Text style={styles.date}>&nbsp;&nbsp;&nbsp;&nbsp;{item.message}</Text>
                        </View>
                    );
                })}
            </ScrollView>
            <View style={styles.commentwrap}>
                <TextInput
                    placeholderTextColor="#000"
                    style={styles.input}
                    onChangeText={(e) => { setMessage(e); }}
                    value={message}
                    placeholder="Add a comment..."
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.photoimg} >
                    <Image source={send_button} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    pro_img: {
        width: 40,
        height: 40,
        borderRadius: 50,
        overflow: 'hidden'
    },
    scrollView: {
        marginHorizontal: 20,
    },
    DateName: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 10,
        paddingLeft: 10,
    },
    date: {
        color: '#000',
        textAlign: 'right',
        float: 'right',
        fontFamily: 'LemonJuice'
    },
    input: {
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 20,
        placeholderTextColor: "#fff",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingTop: 10,
        marginBottom: 20,
        marginTop: 20
    },
    commentwrap: {
        width: 320,
        display: 'flex',
        position: 'absolute',
        left: 20,
        right: 10,
        bottom: 0
    },
    photoimg: {
        position: 'absolute',
        top: 30,
        right: 10,
    }
});