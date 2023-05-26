import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import send_button from '../assets/send_button.png';
import { SafeAreaView, Text, TextInput, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { CreateAndUpdateMessageService } from '../services/ParentService';
import { GetAllCoachesService } from '../services/CoachService';
import LinearGradient from 'react-native-linear-gradient';

export default function SuperAdminMessageCreation({ navigation, route }) {
    const state = useSelector((state) => state);
    const [coaches, setCoaches] = useState([]);
    const [receiverId, setReceiverId] = useState();
    const [message, setMessage] = useState();

    useEffect(() => {
        try {
            const getCoaches = async () => {
                const result = await GetAllCoachesService();
                if (result) {
                    setCoaches(result.map(v => Object.assign(v, { key: v._id, value: v.coach_name })));
                }
            };
            getCoaches();
        } catch (e) { }
    }, []);

    const handleSendMessage = async () => {
        try {
            const data = {
                sender_id: state.authPage.id,
                sender_name: 'Super Admin',
                sender_role: 'superadmin',
                sender_profile_url: null,
                receiver_id: receiverId,
                receiver_role: 'coach',
                message: message
            };
            const result = await CreateAndUpdateMessageService(data);
            if (result) {
                setMessage();
                navigation.navigate("Super Admin Dashboard");
            }
        } catch (e) { }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <Text style={styles.label}>Message To</Text>
                <SelectList
                    setSelected={(val) => setReceiverId(val)}
                    data={coaches}
                    save="key"
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
                <View style={styles.bckcta}>
                    <TouchableOpacity>
                        <Text style={styles.backbtn}>Back</Text>
                    </TouchableOpacity></View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative',
        padding: 15,
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
        width: 330
    },
    photoimg: {
        position: 'absolute',
        top: 15,
        right: 10,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 1,
        paddingRight: 1,
        borderRadius: 5
    },
});