import React, { useEffect, useState } from 'react';
import { Text, View, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import profile from '../assets/profile.png';
import send_button from '../assets/send_button.png';
import moment from 'moment';
import { useSelector } from "react-redux";
import { GetParentParticularPhotoService, UpdateParentPhotosOnMessageService } from '../services/ParentService';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function SuperAdminParticularPhoto({ navigation, route }) {
    const state = useSelector((state) => state);
    const [message, setMessage] = useState("");
    const [onLoadMessages, setOnloadMessages] = useState([]);
    const [msgResult, setMsgResult] = useState();
    const messanger = state.authPage.roles[0] === "ROLE_CUSTOMER" ? state.authPage.auth_data?.parent_name :
        state.authPage.roles[0] === "ROLE_COACH" ? state.authPage.auth_data?.coach_name : state.authPage.roles[0] === "ROLE_REGIONALMANAGER" ? state.authPage.auth_data?.regional_manager_name : "superadmin";

    useEffect(() => {
        try {
            const getCustomers = async () => {
                const result = await GetParentParticularPhotoService(route.params.photo._id);
                if (result) {
                    setOnloadMessages(result.messages);
                }
            };
            getCustomers();
        } catch (e) { }
    }, [navigation, msgResult]);

    const handleSendMessage = async () => {
        try {
            const data = {
                messanger_id: route.params.photo.user_id,
                message: message,
                messanger_name: messanger,
                url: state.authPage.auth_data?.profile_data.url
            };
            const result = await UpdateParentPhotosOnMessageService(route.params.photo._id, data);
            if (result) {
                setMsgResult(result);
                setMessage();
            }
        } catch (e) { }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {onLoadMessages.length > 0 && onLoadMessages.map(item => {
                        return (
                            <View key={item._id} style={styles.DateName}>
                                {item.url ?
                                    <View style={styles.pro_img}>
                                        <Image source={{ uri: item.url }} style={{ width: 40, height: 40 }} />
                                    </View>
                                    :
                                    <View style={styles.pro_img}>
                                        <Image source={profile} style={{ width: 40, height: 40 }} />
                                    </View>
                                }
                                <View style={styles.msgData}>
                                    <Text style={styles.date}>&nbsp;&nbsp;{item.messanger_name}</Text>
                                    <Text style={styles.date}>&nbsp;&nbsp;{moment(item.time).format('MMMM D YY, h:mm a')}</Text>
                                    <Text style={styles.date}>&nbsp;&nbsp;&nbsp;&nbsp;{item.message}</Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
                <View style={styles.commentwrap}>
                    <TextInput
                        placeholderTextColor="#000"
                        style={styles.input}
                        onChangeText={(e) => setMessage(e)}
                        value={message}
                        placeholder="Add a comment..."
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.photoimg} >
                        <Image source={send_button} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    linearGradient: {
        flex: 1,
        borderRadius: 5
    },
    pro_img: {
        width: 40,
        height: 40,
        borderRadius: 50,
        overflow: 'hidden',
    },
    scrollView: {
        marginHorizontal: 20,
    },
    msgData: {
        flexDirection: 'row'
    },
    DateName: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 10,
        paddingLeft: 10,
    },
    date: {
        color: '#000',
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
        marginTop: 20,
        fontFamily: 'LemonJuice'
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
        marginRight: 10
    }
});