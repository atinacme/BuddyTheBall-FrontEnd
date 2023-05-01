import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Pressable, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import buddy from '../assets/buddy.png';
import { Formik } from 'formik';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import { CreateRegionService } from '../services/RegionService';

export default function SuperAdminRegionCreation({ navigation }) {
    const [cities, setCities] = useState([]);

    const validationSchema = yup.object().shape({
        region_name: yup
            .string()
            .required('Region Name is Required')
    });

    const handleAddRegion = async (values) => {
        try {
            const data = {
                region_name: values.region_name,
                cities: cities
            };
            const result = await CreateRegionService(data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Region Added Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("SuperAdmin Settings")
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
                        validationSchema={validationSchema}
                        initialValues={{ region_name: '' }}
                        onSubmit={(values) => handleAddRegion(values)}
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
                                <Text style={styles.label}>Region Name</Text>
                                <TextInput
                                    name="region_name"
                                    placeholder="Region"
                                    onChangeText={handleChange('region_name')}
                                    onBlur={handleBlur('region_name')}
                                    value={values.region_name}
                                    style={styles.input}
                                />
                                {errors.region_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.region_name}</Text>
                                }
                                <Text style={styles.label}>Cities</Text>
                                <TouchableOpacity onPress={() => setCities([...cities, { name: '' }])}>
                                    <Text style={styles.label}>+</Text>
                                </TouchableOpacity>
                                {cities.length > 0 && cities.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <TextInput
                                                onChangeText={(e) => {
                                                    let newArr = [...cities];
                                                    newArr[index].name = e;
                                                    setCities(newArr);
                                                }}
                                                value={item.name}
                                                style={styles.input}
                                            />
                                            <Pressable
                                                style={[styles.agendaButton, styles.buttonClose]}
                                                onPress={() => {
                                                    var array = [...cities];
                                                    var indexData = array.indexOf(item);
                                                    if (indexData !== -1) {
                                                        array.splice(indexData, 1);
                                                        setCities(array);
                                                    }
                                                }}>
                                                <Text style={styles.agendaCrossBtn}>X</Text>
                                            </Pressable>
                                        </View>
                                    );
                                })}
                                {errors.cities &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.cities}</Text>
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
    agendaButton: {
        borderRadius: 50,
        elevation: 2,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonClose: {
        backgroundColor: 'red'
    },
    agendaCrossBtn: {
        fontSize: 15,
    }
});
