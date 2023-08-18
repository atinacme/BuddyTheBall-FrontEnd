import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Button, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import buddy from '../assets/buddy.png';
import { Formik } from 'formik';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import { SignUpService } from '../services/UserAuthService';
import { GetAllRegionsService } from '../services/RegionService';

export default function SuperAdminRegionalManagerCreation({ navigation }) {
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        const getRegions = async () => {
            try {
                const result = await GetAllRegionsService();
                if (result) {
                    result.map(v => Object.assign(v, { key: v.region_name, value: v.region_name }));
                    setRegions(result);
                }
            } catch (e) { }
        };
        getRegions();
    }, []);

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .required('Email is Required'),
        password: yup
            .string()
            .required('Password is Required'),
        regional_manager_name: yup
            .string()
            .required('Regional Manager Name is Required'),
        assigned_region: yup
            .string()
            .required('Assigned Region is required')
    });

    const handleAddRegionalManager = async (values) => {
        try {
            const data = {
                email: values.email,
                password: values.password,
                roles: ['regionalmanager'],
                regional_manager_name: values.regional_manager_name,
                assigned_region: values.assigned_region
            };
            const result = await SignUpService(data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Regional Manager Added Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Super Admin Dashboard")
                        }
                    ]
                );
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't add Regional Manager!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <Formik
                        validationSchema={validationSchema}
                        initialValues={{ email: '', password: '', regional_manager_name: '', assigned_region: '' }}
                        onSubmit={(values) => handleAddRegionalManager(values)}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            isValid,
                        }) => (
                            <>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    name="email"
                                    placeholder="Email"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    style={styles.input}
                                    autoCapitalize='none'
                                />
                                {errors.email &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
                                }
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    name="password"
                                    placeholder="Password"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    style={styles.input}
                                />
                                {errors.password &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
                                }
                                <Text style={styles.label}>Regional Manager Name</Text>
                                <TextInput
                                    name="regional_manager_name"
                                    placeholder="Regional Manager"
                                    onChangeText={handleChange('regional_manager_name')}
                                    onBlur={handleBlur('regional_manager_name')}
                                    value={values.regional_manager_name}
                                    style={styles.input}
                                />
                                {errors.regional_manager_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.regional_manager_name}</Text>
                                }
                                <Text style={styles.label}>Region</Text>
                                <SelectList
                                    setSelected={handleChange('assigned_region')}
                                    data={regions}
                                    save="key"
                                />
                                {errors.assigned_region &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.assigned_region}</Text>
                                }
                                <TouchableOpacity onPress={handleSubmit}>
                                    <Text style={styles.btnWrapper}>Submit</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("Super Admin Regional Manager")}>
                    <Text style={styles.btnWrapper}>Back</Text>
                </TouchableOpacity>
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
        justifyContent: 'flex-end'
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
        position: 'absolute',
        display: 'flex',
        right: 0,
        width: 100,
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 10
    },
    linearGradient: {
        flex: 1,
        borderRadius: 5
    },
    scrollView: {
        marginHorizontal: 5,
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
        paddingBottom: 5
    },
    btnWrapper: {
        borderColor: "#fff",
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 10
    },
});
