import React, { useState } from 'react';
import { useSelector } from "react-redux";
import send_button from '../assets/send_button.png';
import { SafeAreaView, Text, TextInput, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { CreateAndUpdateMessageService } from '../services/CustomerService';

export default function CustomerMessageCreation({ navigation, route }) {
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
                navigation.navigate("Customer Dashboard");
            }
        } catch (e) { }
    };

    return (
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
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
        width: 320
    },
    photoimg: {
        position: 'absolute',
        top: 15,
        right: 10,
    }
});