// components/RegistrationForm.js
import React from 'react'
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import database from '@react-native-firebase/database';

import {setLoader} from "../actions/formActions";

const {height, width} = Dimensions.get("window");

const imagePickerOptions = {
  noData: true,
};

var imageObj = {};

class RegistrationForm extends React.Component {
  state = {
    username: "", 
    email: "",
    phoneNumber: "", 
    address: "",
    currentPosition: "",
    avatarSource:"",
    latitude: "",
    longitude: "",
  }
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }
  componentDidMount(){
    Geolocation.getCurrentPosition(
      (position) => {
          this.setState({currentPosition:"LAT: "+position["coords"]["latitude"]+", LON: "+position["coords"]["longitude"]})
          this.setState({
            latitude: position["coords"]["latitude"],
            longitude: position["coords"]["longitude"]
          })
      },
      (error) => {
          console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  saveInfo = async () => {
    const { username, email, address, phoneNumber, currentPosition } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      Alert.alert("Email is incorrect");
      return false;
    } else if (username == "" || address == "" || phoneNumber == "" || this.state.avatarSource == ""){
      Alert.alert("Please enter all fields");
      return false;
    }
    this.props.dispatch(setLoader(true));
    this.uploadFileToFireBase(imageObj);
  }

  getFileLocalPath = response => {
    const { path, uri } = response;
    return Platform.OS === 'android' ? path : uri;
  };

  uploadFileToFireBase = response => {
    const { username, email, address, phoneNumber, latitude, longitude } = this.state;
    const ext = response.uri.split('.').pop();
    const reference = storage().ref('/images/'+this.state.phoneNumber+"."+ext);
    const fileSource = this.getFileLocalPath(response);
    const {fileSize} = response;
    const task = reference.putFile(fileSource);
    task.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${task.totalBytes}`);
    });
    task.then(async () => {
      const url = await reference.getDownloadURL();
      try {
        const newReference = database()
        .ref('/users')
        .push();
        newReference
        .set({
          name: username,
          email: email,
          address: address,
          phoneNumber: phoneNumber,
          imageUrl: url,
          latitude: latitude,
          longitude: longitude
        })
        .then(() => {
          this.props.dispatch(setLoader(false));
          Alert.alert("Detail Saved Successfully");
          console.log('Image uploaded to the bucket!');
        });
      } catch (err) {
        console.log('error signing up: ', err)
      }
    });
  }
  
  gotoList = () => { 
    Actions.list();
  }

  selectPhoto = () => {
    ImagePicker.launchImageLibrary(imagePickerOptions, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) {
        alert('Post canceled');
      } else if (error) {
        alert('An error occurred: ', error);
      } else {
        imageObj = imagePickerResponse;
        const source = { uri: imagePickerResponse.uri };
        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  render() {
    console.log(this.props.loading);
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder='Name'
          autoCapitalize="none"
          onChangeText={val => this.onChangeText('username', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          onChangeText={val => this.onChangeText('email', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Phone Number'
          autoCapitalize="none"
          maxLength={10}
          onChangeText={val => this.onChangeText('phoneNumber', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Address'
          autoCapitalize="none"
          onChangeText={val => this.onChangeText('address', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Current Position'
          autoCapitalize="none"
          editable={false}
          value={this.state.currentPosition}
        />
        {this.state.avatarSource == "" ? null : 
        <Image source={this.state.avatarSource} style={styles.uploadAvatar} />}

        <TouchableOpacity
          style={[styles.input, styles.center, {backgroundColor:"blue", borderWidth:0}]}
          onPress={this.props.loading ? null : this.selectPhoto}
        >
          <Text style={{fontSize:18, color:"white", fontWeight:"bold"}}>
            Browse photo
          </Text>
        </TouchableOpacity>
        <Button
          title='Submit'
          onPress={this.saveInfo}
          disabled={this.props.loading}
        />
        <Button
          title='Go to list page'
          onPress={this.gotoList}
          disabled={this.props.loading}
        />
        {this.props.loading ? 
        <View 
          style={styles.indicatorView}>
          <Text style={{color:"white", fontWeight:"bold"}}>Saving info. Please wait...</Text>
          <ActivityIndicator size="large" color="#fff" style={{marginTop:5}}/>
        </View>
         : null}
      </View>
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
  uploadAvatar:{
    width: width*.4,
    height: height*.1,
  },
  indicatorView:{
    backgroundColor:"#666", 
    borderRadius:3, 
    padding: 20, 
    position:"absolute", 
    top: height*.3
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  center: {
    justifyContent:"center",
    alignItems:"center"
  }
})

function mapStateToProps(state) {
    const {scene} = state.routes;
    const {loading} = state.formReducer;
    return {
       scene, loading
    }
}

export default connect(mapStateToProps)(RegistrationForm);