import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {
  render() {

    //Updates name on chat screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name});

    //changes bgcolor on chat screen
    const { bgColor } = this.props.route.params;

    return (
      <View style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: bgColor
        }}>
        <Text>Hello Chat!</Text>
      </View>
    )
  }
}