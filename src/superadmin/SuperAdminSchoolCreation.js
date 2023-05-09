import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import buddy from '../assets/buddy.png';
import { SchoolCreationService } from '../services/SchoolService';
import { Formik } from 'formik';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import { GetAllRegionsService } from '../services/RegionService';

export default function SuperAdminSchoolCreation({ navigation }) {
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        try {
            const getRegions = async () => {
                const result = await GetAllRegionsService();
                if (result) {
                    result.map(v => Object.assign(v, { key: v.region_name, value: v.region_name }));
                    setRegions(result);
                }
            };
            getRegions();
        } catch (e) { }
    }, []);

    const loginValidationSchema = yup.object().shape({
        school_name: yup
            .string()
            .required('School Name is Required'),
        region: yup
            .string()
            .required('Region is required'),
        director_name: yup
            .string()
            .required('Director Name is required'),
        director_email: yup
            .string()
            .required('Director Email is required'),
        director_phone: yup
            .string()
            .required('Director Phone is required'),
        address: yup
            .string()
            .required('Address is Required')
    });

    const handleAddSchool = async (values) => {
        try {
            const data = {
                school_name: values.school_name,
                region: values.region,
                director_name: values.director_name,
                director_email: values.director_email,
                director_phone: values.director_phone,
                address: values.address
            };
            const result = await SchoolCreationService(data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "School Added Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("SuperAdmin Dashboard")
                        }
                    ]
                );
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't add School!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <Formik
                        validationSchema={loginValidationSchema}
                        initialValues={{ school_name: '', region: '', director_name: '', director_email: '', director_phone: '', address: '' }}
                        onSubmit={(values) => handleAddSchool(values)}
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
                                <Text style={styles.label}>School Name</Text>
                                <TextInput
                                    name="school_name"
                                    placeholder="School"
                                    onChangeText={handleChange('school_name')}
                                    onBlur={handleBlur('school_name')}
                                    value={values.school_name}
                                    style={styles.input}
                                />
                                {errors.school_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.school_name}</Text>
                                }
                                <Text style={styles.label}>Region</Text>
                                <SelectList
                                    setSelected={handleChange('region')}
                                    data={regions}
                                    save="key"
                                />
                                {errors.region &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.region}</Text>
                                }
                                <Text style={styles.label}>Director Name</Text>
                                <TextInput
                                    name="director_name"
                                    placeholder="Director Name"
                                    onChangeText={handleChange('director_name')}
                                    onBlur={handleBlur('director_name')}
                                    value={values.director_name}
                                    style={styles.input}
                                />
                                {errors.director_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.director_name}</Text>
                                }
                                <Text style={styles.label}>Director Email</Text>
                                <TextInput
                                    name="director_email"
                                    placeholder="Director Email"
                                    onChangeText={handleChange('director_email')}
                                    onBlur={handleBlur('director_email')}
                                    value={values.director_email}
                                    style={styles.input}
                                />
                                {errors.director_email &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.director_email}</Text>
                                }
                                <Text style={styles.label}>Director Phone</Text>
                                <TextInput
                                    name="director_phone"
                                    placeholder="Director Phone"
                                    onChangeText={handleChange('director_phone')}
                                    onBlur={handleBlur('director_phone')}
                                    value={values.director_phone}
                                    style={styles.input}
                                />
                                {errors.director_phone &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.director_phone}</Text>
                                }
                                <Text style={styles.label}>Address</Text>
                                <TextInput
                                    name="address"
                                    placeholder="Address"
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                    value={values.address}
                                    style={styles.input}
                                />
                                {errors.address &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.address}</Text>
                                }
                                <TouchableOpacity onPress={handleSubmit}>
                                    <Text style={styles.btnWrapper}>Submit</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Schools")}>
                        <Text style={styles.btnWrapper}>Back</Text>
                    </TouchableOpacity>
                </View>
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
    deletebtn: {
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
        left: 0,
        width: 100,
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 10
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
