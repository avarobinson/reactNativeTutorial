import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function App() {

  state = {
    hasPermission: null,
    type: Camera.Constants.Type.back,
  }

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const camRef = useRef(null);
  
  useEffect(() => {
    (async () => {
      getPermissionAsync();
    })();
  }, []);

  async function getPermissionAsync () {
    // Camera roll Permission 
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasPermission( status === 'granted' );
  }

  const handleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back 
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
    console.log('switched type')
    console.log(type)
  }

  async function takePicture () {
    if (camRef) {
      let photo = await camRef.current.takePictureAsync();
      console.log(photo.uri)
    }
  }

  async function pickImage (){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    console.log(result)
  }

  if (hasPermission === null) {
    return <View />;
  } 
  else if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  } 
  else {
    return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={type} ref={camRef}>
            <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',                  
                }}
                onPress = {() => pickImage()}
                >
                <Ionicons
                    name="ios-photos"
                    style={{ color: "#fff", fontSize: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress = {takePicture}>
                <FontAwesome
                    name="camera"
                    style={{ color: "#fff", fontSize: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress = {() => handleCameraType()}
                >
                <MaterialCommunityIcons
                    name="camera-switch"
                    style={{ color: "#fff", fontSize: 40}}
                />
              </TouchableOpacity>
            </View>
          </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
