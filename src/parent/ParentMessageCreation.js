import React, { useState } from 'react';
import { useSelector } from "react-redux";
import send_button from '../assets/send_button.png';
import { SafeAreaView, Text, TextInput, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { CreateAndUpdateMessageService } from '../services/ParentService';
import LinearGradient from 'react-native-linear-gradient';

export default function ParentMessageCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [message, setMessage] = useState();

    const handleSendMessage = async () => {
        try {
            const data = {
                sender_id: state.authPage.auth_data?._id,
                sender_name: state.authPage.auth_data?.player_name,
                sender_role: 'customer',
                sender_profile_url: state.authPage.auth_data?.profile_data.url,
                receiver_id: state.authPage.auth_data?.coach._id,
                receiver_role: 'coach',
                message: message
            };
            const result = await CreateAndUpdateMessageService(data);
            if (result) {
                setMessage();
                navigation.navigate("Parent Dashboard");
            }
        } catch (e) { }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <Text style={styles.label}>Message To</Text>
                <TextInput
                    placeholderTextColor="#000"
                    style={styles.input}
                    value="Coach"
                    aria-disabled
                />
                <Text style={styles.label}>Message</Text>
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
                    <TouchableOpacity onPress={() => navigation.navigate("Parent Messages")}>
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
        marginBottom: 10,
        marginTop: 60
    },
    linearGradient: {
        flex: 1,
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
        top: 0,
        position: 'absolute',
        marginBottom: 10
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
    commentwrap: {
        width: 325
    },
    photoimg: {
        position: 'absolute',
        top: 15,
        right: 10,
    }
});