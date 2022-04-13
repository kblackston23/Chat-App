import React from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, Image, TouchableOpacity } from 'react-native';
import BackgroundImage from '../assets/background-image.png';
import icon from '../assets/icon.png';

export default class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      name: '',
      bgColor: this.colors.blue
    };
  }

  // function for updating chat color when on chat screen
  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  // background colors to choose
  colors = {
    darker: '#006666',
    dark: '#009999',
    light: '#6bcccc',
    lighter: '#ccffff'
  };

  render() {
    return (
      <View style={styles.container}>

        <ImageBackground source={BackgroundImage} resizeMode='cover' style={styles.backgroundImage}>

          <View style={styles.titleBox}> 
            <Text style={styles.title}>Welcome to ChatterBot!</Text> 
          </View>

          <View style={styles.box1}>
            <View style={styles.inputBox}>
              <Image source={icon} style={styles.image} />
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ name: text})}
                value={this.state.name}
                placeholder='Please enter your name'
              />
            </View>

            <View style={styles.colorBox}>
              <Text style={styles.chooseColor}> Choose Background Color: </Text>
            </View>

            <View style={styles.colorArray}>
              <TouchableOpacity 
                style={styles.color1} 
                onPress={() => this.changeBgColor(this.colors.darker)}>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.color2}
                onPress={() => this.changeBgColor(this.colors.dark)}>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.color3}
                onPress={() => this.changeBgColor(this.colors.light)}>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.color4}
                onPress={() => this.changeBgColor(this.colors.lighter)}>
              </TouchableOpacity>     
            </View>

            <Pressable
              style={styles.button}
              onPress={() => this.props.navigation.navigate('Chat', { 
                name: this.state.name,
                bgColor: this.state.bgColor
                })}>
                <Text style={styles.buttonText}>Start Chatting</Text>
            </Pressable>

          </View>

        </ImageBackground>
      </View>
    )
  }
}

//Styles for start screen
const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBox: {
    height: '50%',
    width: '88%',
    alignItems: 'center',
    paddingTop: 100
  },

  title: {
    fontSize: 45, 
    fontWeight: "600", 
    color: '#FFFFFF',
    alignItems: 'center'
  },

  box1: {
    backgroundColor: 'white', 
    height: '44%',
    width: '88%',
    justifyContent: 'space-around', 
    alignItems: 'center',

  },

  inputBox: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: 'grey',
    width: '88%',
    height: 60,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  image: {
    width: 30,
    height: 30,
    marginRight: 10
  },

  input: {
    fontSize: 16, 
    fontWeight: "300", 
    color: '#757083', 
    opacity: 0.5,
  },

  colorBox: {
    marginRight: 'auto',
    paddingLeft: 15,
    width: '88%'
  },

  chooseColor: {
    fontSize: 16, 
    fontWeight: "300", 
    color: '#757083', 
    opacity: 1,
  },

  colorArray: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    paddingRight: 60
  },

  color1: {
    backgroundColor: '#006666',
    width: 40,
    height: 40,
    borderRadius: 20
  },

  color2: {
    backgroundColor: '#009999',
    width: 40,
    height: 40,
    borderRadius: 20
  },

  color3: {
    backgroundColor: '#6bcccc',
    width: 40,
    height: 40,
    borderRadius: 20
  },

  color4: {
    backgroundColor: '#ccffff',
    width: 40,
    height: 40,
    borderRadius: 20
  },

  button: {
    width: '88%',
    height: 70,
    backgroundColor: '#669999',
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600"
  }
});