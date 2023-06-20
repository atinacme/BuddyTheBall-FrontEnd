import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import buddy from '../assets/buddy.png';
import { ResetPasswordService } from '../services/UserAuthService';
import LinearGradient from 'react-native-linear-gradient';

export default function ResetPassword({ navigation, route }) {
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const handleResetPassword = async () => {
        try {
            if (password && confirmPassword && password === confirmPassword) {
                const data = {
                    userId: route.params.resetData.user_id,
                    email: route.params.resetData.email,
                    password: password
                };
                const result = await ResetPasswordService(data);
                if (result) {
                    Alert.alert(
                        "Alert",
                        result.message,
                        [
                            {
                                text: "OK"
                            }
                        ]
                    );
                    navigation.navigate("SignIn")
                }
            } else {
                Alert.alert(
                    "Alert",
                    "Fill All Required Fields",
                    [
                        {
                            text: "OK"
                        }
                    ]
                );
            }
        } catch (e) {
            console.log(e.message);
        }
    };
    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto', marginBottom: 20 }} />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => setPassword(e)}
                    value={password}
                />
                {!password &&
                    <Text style={{ fontSize: 10, color: 'red' }}>Password is Required</Text>
                }
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(e) => setConfirmPassword(e)}
                    value={confirmPassword}
                />
                {!confirmPassword &&
                    <Text style={{ fontSize: 10, color: 'red' }}>Confirm Password is Required</Text>
                }
                <TouchableOpacity onPress={handleResetPassword}>
                    <Text style={styles.btnWrapper}>Reset Password</Text>
                </TouchableOpacity>
                <Text style={{ color: 'blue', marginTop: 10 }}
                    onPress={() => navigation.navigate("SignIn")}>
                    SignIn ?
                </Text>
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