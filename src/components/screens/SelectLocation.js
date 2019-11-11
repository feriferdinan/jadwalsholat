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
import RNLocation from 'react-native-location';

class SelectLocation extends Component {

    constructor() {
        super()
        this.state = {
            address: "Jakarta",
            lat: "",
            lon: ""
        }
        this.getData()
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

            <SafeAreaView style={styles.container} >

            </SafeAreaView >

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: "Neo_Sans",
    }
})

export default SelectLocation