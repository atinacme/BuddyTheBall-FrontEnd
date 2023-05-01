import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Button, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
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
    const dayList = [
        {
            key: "Monday",
            value: "Monday"
        },
        {
            key: "Tuesday",
            value: "Tuesday"
        },
        {
            key: "Wednesday",
            value: "Wednesday"
        },
        {
            key: "Thursday",
            value: "Thursday"
        },
        {
            key: "Friday",
            value: "Friday"
        },
        {
            key: "Saturday",
            value: "Saturday"
        },
        {
            key: "Sunday",
            value: "Sunday"
        }
    ];
    const loginValidationSchema = yup.object().shape({
        school_name: yup
            .string()
            .required('School Name is Required'),
        region: yup
            .string()
            .required('Region is required'),
        assigned_day: yup
            .string()
            .required('Assigned Day is required'),
        address: yup
            .string()
            .required('Address is Required')
    });

    const handleAddSchool = async (values) => {
        try {
            const data = {
                school_name: values.school_name,
                region: values.region,
                assigned_day: values.assigned_day,
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
                        initialValues={{ school_name: '', region: '', assigned_day: '', address: '' }}
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
                                <Text style={styles.label}>Assigned Day</Text>
                                <SelectList
                                    setSelected={handleChange('assigned_day')}
                                    data={dayList}
                                    save="key"
                                />
                                {errors.assigned_day &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.assigned_day}</Text>
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
                <TouchableOpacity onPress={() => navigation.navigate("SuperAdmin Schools")}>
                    <Text style={styles.backbtn}>Back</Text>
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
