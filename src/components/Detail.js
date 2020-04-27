// components/RegistrationForm.js
import React from 'react'
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  ActivityIndicator,
  Text,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker} from 'react-native-maps';

import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
const {height, width} = Dimensions.get("window");

class Detail extends React.Component {
  state= {
    imageUrl:"",
    loading: true,
  }
  gotoForm = () => {
    Actions.registrationForm();
  }
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.state.loading ? 
          <View style={styles.indicatorView}>
            <Text style={{color:"white", fontWeight:"bold", textAlign:"center"}}>Image loading please wait...</Text>
            <ActivityIndicator size="large" color="#fff" style={{marginTop:5}}/>
          </View>
           : null}
          <View style={{alignSelf:"center"}}>
            <Image 
              source={{uri:this.props.item.imageUrl}} 
              style={{
                width: width*.4,
                height: this.state.loading? 10 : width*.4,
                alignContent:"center",
                borderRadius:width*.4/2,
              }}
              onLoadEnd={(e) => this.setState({loading: false})}
            />
          </View>
        <TextInput
          style={styles.input}
          placeholder='Name'
          autoCapitalize="none"
          value={this.props.item.name}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          value={this.props.item.email}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder='Phone Number'
          autoCapitalize="none"
          maxLength={10}
          value={this.props.item.phoneNumber}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder='Address'
          autoCapitalize="none"
          value={this.props.item.address}
          editable={false}
        />
        <MapView
          style={{flex: 1, width: width*.9, height:height*.15}}
          initialRegion={{
            latitude: this.props.item.latitude,
            longitude: this.props.item.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{latitude: this.props.item.latitude, longitude: this.props.item.longitude}}
            title="this is a marker"
            description="this is a marker example"
          />
        </MapView>
        
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    width: width*.85,
    height: height*.065,
    margin: 10,
    padding: 8,
    color: 'black',
    borderRadius: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  container: {
    margin:10,
    alignItems:"center"
  },
  indicatorView:{
    backgroundColor:"#666", 
    borderRadius:3, 
    padding: 20,
  }
})

function mapStateToProps(state) {
    const {scene} = state.routes;
    return {
       scene
    }
}

export default connect(mapStateToProps)(Detail);