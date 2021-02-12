import React, { useState, useEffect } from 'react';
import {
    ToastAndroid, View, FlatList, StyleSheet, Text, Image, StatusBar,
    Alert, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView
} from 'react-native';
import * as Animatable from "react-native-animatable";
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {

    const [visibleModal, setVisibleModal] = useState(false);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [label, setLabel] = useState('ADD POST');
    const [DATA, setData] = useState([]);


    useEffect(() => {
        // getData();
    });

    const renderItem = ({ item }) => (

        <Animatable.View duration={2000} animation="zoomIn" style={styles.item}>
            <TouchableOpacity
                onPress={() => { handlerClick(item) }}
                onLongPress={() => { handlerLongClick(item) }}
                style={{ flex: 1, width: '100%' }}>
                <Text style={styles.title}>{item.Title}</Text>
                <Text style={styles.body}>{item.Body}</Text>
            </TouchableOpacity>
        </Animatable.View>
    );

    const handlerClick = (item) => {

        setVisibleModal(true);
        setTitle(item.Title);
        setBody(item.Body);
        setLabel('UPDATE POST');
    };


    const handlerLongClick = (item) => {

        Alert.alert(
            'Delete POST',
            'Are you sure you want to delete this post???',
            [
                { text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel' },
                { text: 'YES', onPress: () => deletePOST(item.Title) },
            ]
        );
    };

    const deletePOST = async (title) => {
        let newData = DATA.filter(function (item) {
            return item.Title !== title
        });
        setData(newData);
        storeData(newData);
    }




    const onPress = () => {
        setLabel('ADD POST');
        setVisibleModal(true)
    };


    const onPressCloseModal = () => {
        setTitle('');
        setBody('');
        setVisibleModal(false);
    }




    const onPressAddPost = async () => {
        if (label == "ADD POST") {


            if (title == "") {
                ToastAndroid.show("Please add title to the post!", ToastAndroid.LONG);
                return;
            }

            if (body == "") {
                ToastAndroid.show("Please add content to the post!", ToastAndroid.LONG);
                return;
            }

            setVisibleModal(false);
            let obj = {};
            obj.Title = title;
            obj.Body = body;


            const jsonValue = await AsyncStorage.getItem('@storage_Key')

            if (jsonValue != null) {

                let arrData = [];
                arrData.push(jsonValue);
                setData(arrData);
            }
            let allData = jsonValue != null ? JSON.parse(jsonValue) : [];
            allData.push(obj);

            console.log("getData: ", allData)
            setData(allData);
            storeData(allData)

            if (label == 'ADD POST') {
                ToastAndroid.show("Post added successfully!", ToastAndroid.LONG);
            } else {
                ToastAndroid.show("Post updtaed successfully!", ToastAndroid.LONG);
            }
            setTitle('');
            setBody('');
        } else {
            if (title == "") {
                ToastAndroid.show("Please add title to the post!", ToastAndroid.LONG);
                return;
            }

            if (body == "") {
                ToastAndroid.show("Please add content to the post!", ToastAndroid.LONG);
                return;
            }

        
            setVisibleModal(false);

        }
    }



    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@storage_Key', jsonValue)
        } catch (e) {
            // saving error
        }
    }

    return (
        <Animatable.View style={{ flex: 1, height: HEIGHT, width: '100%', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: "#003f5c" }}>
            <Modal
                animationIn='slideInUp'
                animationInTiming={300}
                isVisible={visibleModal}>
                <View style={{ height: 500, backgroundColor: '#CCCCCC', borderRadius: 10, borderTopLeftRadius: 10 }}>


                    <View style={{ flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'row' }}>

                        <View style={{ flex: 1 }}>
                        </View>

                        <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={[styles.submitText, { fontSize: 16 }]}>{label}</Text>
                        </View>

                        <TouchableOpacity onPress={onPressCloseModal}

                            style={{
                                flex: 1, backgroundColor: '#CCCCCC', borderTopRightRadius: 10,
                                width: '100%', justifyContent: 'center', alignItems: 'center'
                            }}>
                            <Image resizeMode='contain'
                                style={{ height: 25, width: 25, justifyContent: 'center', alignItems: 'center' }}
                                source={{ uri: 'https://www.iconsdb.com/icons/preview/black/cancel-xxl.png' }} />

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 9, justifyContent: 'center', alignItems: 'center', backgroundColor: '#003f5c', borderBottomEndRadius: 10, borderBottomLeftRadius: 10 }}>


                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Title"
                                placeholderTextColor="#003f5c"
                                maxLength={50}
                                multiline={true}
                                value={title}
                                onChangeText={(title) => setTitle(title)}
                            />
                        </View>

                        <View style={styles.inputViewBody}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Body"
                                value={body}
                                multiline={true}
                                maxLength={300}
                                placeholderTextColor="#003f5c"
                                onChangeText={(body) => setBody(body)}
                            />
                        </View>

                        <TouchableOpacity onPress={onPressAddPost} style={styles.submitButton}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>

                    </View>


                </View>
            </Modal>



            <View style={{ flex: 9, width: '90%' }}>

                {DATA.length ?
                    <FlatList style={{ width: '100%', marginBottom: 20 }}
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={item => item.title}
                    /> :
                    <View style={{ flex: 9, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>No Post available for view.Please add the post. </Text>

                    </View>


                }


            </View>

            <TouchableOpacity onPress={onPress}
                style={{ flex: 1, width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginHorizontal: '5%' }}>
                <Image resizeMode='contain'
                    style={{ height: 50, width: 50 }}
                    source={{ uri: 'https://www.iconsdb.com/icons/preview/white/add-xxl.png' }} />

            </TouchableOpacity>


        </Animatable.View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: 'white'
    },
    item: {
        backgroundColor: '#CCCCCC',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        marginVertical: 8,
        marginHorizontal: '5%',
        shadowColor: 'black',
        shadowOpacity: 10,
        shadowRadius: 2

    },
    title: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold'
    },

    body: {
        fontSize: 14,
        marginTop: 10,
        color: 'black',
        fontWeight: '400'
    },

    inputView: {
        backgroundColor: "#CCCCCC",
        borderRadius: 30,
        width: "80%",
        height: '10%',
        marginBottom: 20,
        alignItems: "flex-start",
    },
    inputViewBody: {
        backgroundColor: "#CCCCCC",
        borderRadius: 30,
        width: "80%",
        height: '50%',
        marginBottom: 20,
        alignItems: "flex-start",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 10,
        color: 'black'
    },
    submitButton: {
        width: "80%",
        marginHorizontal: '15%',
        backgroundColor: "#CCCCCC",
        borderRadius: 25,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    submitText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        width: '100%',
        textAlign: 'center'
    },
});

export default HomeScreen;
