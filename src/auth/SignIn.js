import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import buddy from '../assets/buddy.png';
import { useDispatch } from "react-redux";
import { AuthPageAction } from '../redux/Actions';
import { SignInService } from '../services/UserAuthService';
import LinearGradient from 'react-native-linear-gradient';

export default function SignIn({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const dispatch = useDispatch();
    const handleSignIn = async () => {
        try {
            const data = {
                email: email,
                password: password
            };
            const result = await SignInService(data);
            if (result.roles[0] === "ROLE_CUSTOMER") {
                navigation.navigate("Parent Dashboard");
                dispatch(AuthPageAction(result.id, result.email, result.roles, result.customer_data, result.accessToken));
            } else if (result.roles[0] === "ROLE_COACH") {
                navigation.navigate("Coach Dashboard");
                dispatch(AuthPageAction(result.id, result.email, result.roles, result.coach_data, result.accessToken));
            } else if (result.roles[0] === "ROLE_REGIONALMANAGER") {
                navigation.navigate("Regional Manager Dashboard");
                dispatch(AuthPageAction(result.id, result.email, result.roles, result.regionalmanager_data, result.accessToken));
            } else {
                navigation.navigate("Super Admin Dashboard");
                dispatch(AuthPageAction(result.id, result.email, result.roles, null, result.accessToken));
            }
        } catch (e) {
            if (e.message === "Request failed with status code 404") {
                Alert.alert(
                    "Alert",
                    "User Not found.",
                    [
                        {
                            text: "OK"
                        }
                    ]
                );
            } else if (e.message === "Request failed with status code 401") {
                Alert.alert(
                    "Alert",
                    "Invalid Password!",
                    [
                        {
                            text: "OK"
                        }
                    ]
                );
            } else {
                console.log(e.message);
            }
        }
    };
    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto', marginBottom: 20 }} />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setEmail(e)}
                    value={email}
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setPassword(e)}
                    value={password}
                />
                <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.btnWrapper}>Login</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    btnWrapper: {
        borderColor: "#ffc000",
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 10
    },
    wrapper: {
        padding: 20,
        marginTop: 60
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10
    },
    label: {
        fontSize: 16,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 0
    },
    labeLink: {
        fontSize: 14,
        textAlign: 'center',
        color: "#000",
        padding: 10,
        cursor: 'pointer'
    }
});