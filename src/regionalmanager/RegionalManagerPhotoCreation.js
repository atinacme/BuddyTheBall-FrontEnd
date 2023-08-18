import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, ScrollView, Image, Alert, View, Button, TouchableOpacity } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from "react-redux";
import { GetCustomerWithSchoolIdService } from '../services/CustomerService';
import axios from 'axios';
import Config from '../../Config';
import LinearGradient from 'react-native-linear-gradient';

export default function RegionalManagerPhotoCreation({ navigation, route }) {
    const [customerData, setCustomerData] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const state = useSelector((state) => state);

    useEffect(() => {
        const handleStudentList = async () => {
            try {
                const result = await GetCustomerWithSchoolIdService(route.params.schoolId);
                if (result) {
                    setCustomerData(result.map(v => Object.assign(v, { key: v._id, value: v.player_name })));
                }
            } catch (e) { }
        };
        handleStudentList();
    }, []);

    const openGallery = async () => {
        const result = await ImagePicker.openPicker({
            multiple: true
        });
        setSelectedFile(result);
    };

    const handleAddPhoto = async () => {
        const formData = new FormData();
        formData.append('customer_id', customerId);
        formData.append('school_id', route.params.schoolId);
        formData.append('coach_id', state.authPage.auth_data?._id);
        formData.append('file_type', 'customer_photos');
        selectedFile.forEach((item) => {
            const newImageUri = "file:///" + item.path.split("file:/").join("");
            formData.append('file', {
                uri: newImageUri,
                type: item.mime,
                name: newImageUri.split("/").pop()
            });
        });
        try {
            const res = await axios({
                method: 'post',
                url: `${Config.REACT_APP_BASE_URL}/uploadCustomerPhotos`,
                data: formData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res) {
                Alert.alert(
                    "Alert",
                    "All Files Uploaded Sucessfully",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setSelectedFile(null);
                                navigation.navigate("Coach Schools Photos");
                            }
                        }
                    ]
                );
            }
        } catch (e) { }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.label}>Students List</Text>
                    <SelectList
                        setSelected={(val) => setCustomerId(val)}
                        data={customerData}
                        save="key"
                    />
                    <View style={styles.btnWrapper}>
                        <View>
                            {/* <Button onPress={openGallery} title='upload' /> */}
                            <TouchableOpacity onPress={openGallery}>
                                <Text style={styles.uploadcta}>upload</Text>
                            </TouchableOpacity>
                            {selectedFile !== null && selectedFile.map((ls, index) => {
                                return (
                                    <View key={index}>
                                        <Image source={{ uri: ls.path }} style={{ height: 300, width: 300, marginTop: 20, marginBottom: 20 }} />
                                    </View>
                                );
                            })}
                        </View>
                        <View>
                            <TouchableOpacity onPress={handleAddPhoto} >
                                <Text style={styles.submitcta}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("Coach Schools Photos")}>
                    <Text style={styles.backbtn}>Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    btnWrapper: {
        paddingTop: 40
    },
    wrapper: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        marginBottom: 56,
        marginTop: 60
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
        justifyContent: 'flex-end'
    },
    label: {
        fontSize: 16,
        color: '#000',
        paddingBottom: 10
    },
    uploadcta: {
        backgroundColor: '#5b9bd5',
        color: '#fff',
        borderColor: '#fff',
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        margin: 10
    },
    submitcta: {
        backgroundColor: '#993366',
        color: '#fff',
        borderColor: '#fff',
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        margin: 10
    }
});
