import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DatePickerAndroid,
    SafeAreaView
} from 'react-native';
import axios from 'axios'
import utils from '../../utils'
import config from '../../config'
import IconE from 'react-native-vector-icons/Entypo'
import IconI from 'react-native-vector-icons/Ionicons'
import IconAnt from 'react-native-vector-icons/AntDesign'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import RNLocation from 'react-native-location';
import LinearGradient from 'react-native-linear-gradient';

class Main extends Component {

    constructor() {
        super()
        this.state = {
            pray: [],
            date: utils.today,
            address: "Jakarta",
            lat: "",
            lon: ""
        }
        this.getData()
    }
    datePick = async () => {
        try {
            let { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date(),
            });
            month += 1
            if (action !== DatePickerAndroid.dismissedAction) {
                var dateSelected = year + "-" + month + "-" + day
                this.setState({
                    date: day + "-" + month + "-" + year,
                    pray: []
                })
                this.getData(dateSelected)
            }
        } catch ({ code, message }) {
            alert('date picker error', message);
        }
    }

    getData = (date = this.state.date, address = this.state.address) => {
        RNLocation.configure({
            distanceFilter: 5.0
        })

        RNLocation.requestPermission({
            ios: "whenInUse",
            android: {
                detail: "coarse"
            }
        }).then(granted => {
            if (granted) {
                this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
                    let lat = locations[0].latitude;
                    let lon = locations[0].longitude;
                    this.setState({ lat: lat, lon: lon })
                    console.log(lat, lon);

                })
            }
        })

        axios.get(`${config.BASE_URL}/${this.state.lat}/${this.state.lon}/${date}.json?key=${config.API_KEY}`)
            .then((response) => {
                this.setState({
                    pray: response.data,
                })
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }


    render() {
        return (
            (this.state.pray.length == 0) ?
                <LinearGradient colors={['#057130', '#057130']} style={styles.container}>
                    <SkeletonPlaceholder backgroundColor="rgba(255, 255, 255, 0.3)" >
                        <View style={{ paddingHorizontal: 30, paddingVertical: 20, flexDirection: "column", flex: 1 }}>
                            <View style={{ flex: 2 }}>
                                <View style={styles.wrapperInfo}>
                                    <View style={styles.wrapperIcon}>
                                    </View>
                                    <View style={{
                                        marginHorizontal: 15, backgroundColor: "rgba(255, 255, 255, 0.3)", alignItems: "center", width: 85 + "%", height: 15
                                    }}></View>
                                </View>
                                <View style={styles.wrapperInfo}>
                                    <View style={styles.wrapperIcon}>
                                    </View>
                                    <View style={{
                                        marginHorizontal: 15, backgroundColor: "rgba(255, 255, 255, 0.3)", alignItems: "center", width: 85 + "%", height: 15
                                    }}></View>
                                </View>
                            </View>
                            <View style={{ flex: 3, marginTop: 20 }}>
                                <View style={styles.wrapperJadwal}></View>
                                <View style={styles.wrapperJadwal}></View>
                                <View style={styles.wrapperJadwal}></View>
                                <View style={styles.wrapperJadwal}></View>
                                <View style={styles.wrapperJadwal}></View>
                                <View style={styles.wrapperJadwal}></View>
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                </LinearGradient>
                :
                <LinearGradient colors={['#057130', '#057130']} style={styles.container} >
                    <View style={{ paddingHorizontal: 30, paddingVertical: 20, flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.title}>Alarm Waktu Sholat</Text>
                            <Text style={styles.subtitle}>Shalat jadi tepat waktu.</Text>
                            <View style={{ flex: 1, flexDirection: "column" }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("SelectLocation")} style={styles.wrapperInfo}>
                                    <View style={styles.wrapperIcon}>
                                        <IconE name="location-pin" color="#E9ECEF" size={20} />
                                    </View>
                                    <View>
                                        <Text style={styles.titleInfo}>{this.state.pray.query}<Text>, </Text>{this.state.pray.country}</Text>
                                        <Text style={styles.subInfo}>Lokasi Saat Ini</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.wrapperInfo}>
                                    <View style={styles.wrapperIcon}>
                                        <IconE name="compass" color="#E9ECEF" size={20} />
                                    </View>
                                    <View>
                                        <Text style={styles.titleInfo}>12 LS 10 LS 13 LS</Text>
                                        <Text style={styles.subInfo}>Arah Kiblat</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={this.datePick} style={[styles.wrapperInfo, { justifyContent: "space-between" }]}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View style={styles.wrapperIcon}>
                                            <IconE name="calendar" color="#E9ECEF" size={20} />
                                        </View>
                                        <View>
                                            <Text style={styles.titleInfo}>{this.state.date}</Text>
                                            <Text style={styles.subInfo}>{(this.state.date == utils.today) ? "Tanggal Hari ini" : "Tanggal diubah"}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={this.datePick}>
                                        <IconAnt name="calendar" color="#E9ECEF" size={20} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={{ flex: 3, marginTop: 20 }}>
                            <View style={styles.wrapperJadwal}>
                                <Text style={styles.textJadwal}>Imsak</Text>
                                <View style={{ flexDirection: "row" }} >
                                    <Text style={[styles.textJadwal, { fontWeight: "600" }]}>{this.state.pray.items[0].fajr.toUpperCase()}</Text>
                                    <IconI name="md-alarm" color="#E9ECEF" size={20} style={{ paddingRight: 15, }} />
                                </View>
                            </View>
                            <View style={styles.wrapperJadwal}>
                                <Text style={styles.textJadwal}>Shalat Shubuh</Text>
                                <View style={{ flexDirection: "row" }} >
                                    <Text style={[styles.textJadwal, { fontWeight: "600" }]}>{this.state.pray.items[0].shurooq.toUpperCase()}</Text>
                                    <IconI name="md-alarm" color="#E9ECEF" size={20} style={{ paddingRight: 15, }} />
                                </View>
                            </View>
                            <View style={styles.wrapperJadwal}>
                                <Text style={styles.textJadwal}>Shalat Dhuhur</Text>
                                <View style={{ flexDirection: "row" }} >
                                    <Text style={[styles.textJadwal, { fontWeight: "600" }]}>{this.state.pray.items[0].dhuhr.toUpperCase()}</Text>
                                    <IconI name="md-alarm" color="#E9ECEF" size={20} style={{ paddingRight: 15, }} />
                                </View>
                            </View>
                            <View style={styles.wrapperJadwal}>
                                <Text style={styles.textJadwal}>Shalat Ashar</Text>
                                <View style={{ flexDirection: "row" }} >
                                    <Text style={[styles.textJadwal, { fontWeight: "600" }]}>{this.state.pray.items[0].asr.toUpperCase()}</Text>
                                    <IconI name="md-alarm" color="#E9ECEF" size={20} style={{ paddingRight: 15, }} />
                                </View>
                            </View>
                            <View style={styles.wrapperJadwal}>
                                <Text style={styles.textJadwal}>Shalat Magbrib</Text>
                                <View style={{ flexDirection: "row" }} >
                                    <Text style={[styles.textJadwal, { fontWeight: "600" }]}>{this.state.pray.items[0].maghrib.toUpperCase()}</Text>
                                    <IconI name="md-alarm" color="#E9ECEF" size={20} style={{ paddingRight: 15, }} />
                                </View>
                            </View>
                            <View style={styles.wrapperJadwal}>
                                <Text style={styles.textJadwal}>Shalat Isya</Text>
                                <View style={{ flexDirection: "row" }} >
                                    <Text style={[styles.textJadwal, { fontWeight: "600" }]}>{this.state.pray.items[0].isha.toUpperCase()}</Text>
                                    <IconI name="md-alarm" color="#E9ECEF" size={20} style={{ paddingRight: 15, }} />
                                </View>
                            </View>
                        </View>
                    </View>
                </LinearGradient >

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: "Neo_Sans",
    },
    title: {
        color: "#E9ECEF",
        fontSize: 30,
        fontWeight: "700",
    },
    subtitle: {
        color: "#E9ECEF",
        fontSize: 14
    },
    textJadwal: {
        paddingHorizontal: 15, color: "#E9ECEF", fontSize: 16, fontWeight: "bold"
    },
    wrapperIcon: {
        backgroundColor: "rgba(255, 255, 255, 0.3)", borderRadius: 50, width: 35, height: 35, justifyContent: "center", alignItems: "center"
    },
    wrapperJadwal: {
        marginTop: 10,
        backgroundColor: "rgba(255, 255, 255, 0.3)", alignItems: "center", width: 100 + "%", height: 50, borderRadius: 10,
        justifyContent: "space-between", flexDirection: "row"
    },
    wrapperInfo: {
        flex: 1, flexDirection: "row", alignItems: "center"
    },
    titleInfo: {
        color: "#E9ECEF",
        fontSize: 16, marginHorizontal: 10, fontWeight: "bold", marginHorizontal: 10, fontWeight: "bold"
    },
    subInfo: {
        color: "#E9ECEF",
        fontSize: 14, marginHorizontal: 10, fontWeight: "bold", marginHorizontal: 10, fontSize: 10, fontWeight: "100"
    }
})

export default Main