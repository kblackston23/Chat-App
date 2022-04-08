import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import "firebase/firestore";


export default class Chat extends React.Component {

  constructor(){
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      }
    }

    //information for the database
    const firebaseConfig = {
      apiKey: "AIzaSyBeqQI-IdQM9BjIscGdy-ceyU7wWyfGw0Q",
      authDomain: "test-e5555.firebaseapp.com",
      projectId: "test-e5555",
      storageBucket: "test-e5555.appspot.com",
      messagingSenderId: "363701002260",
      appId: "1:363701002260:web:b74dce5ed113f675440701"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //refernces the database
    this.referenceChatMessages = firebase.firestore().collection("messages");
    }

  componentDidMount() {
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name});

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

    this.setState({
      uid: user.uid,
      messages: [],
      user: {
        _id: user.uid,
        name: name,
        avatar: "https://placeimg.com/140/140/any"
      }
    });

    this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);
   });
 }
  

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id, 
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
   });
   this.setState({
    messages: messages
  });
};

  //adding messages to the database
  addMessage() {
    const message = this.state.messages[0];
    
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: this.state.user
    });
  }

  //when a message is sent, calls addMessage
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
    })
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      this.authUnsubscribe();
      this.unsubscribe();
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#4e5765'
          },
          left: {
            backgroundColor: '#e2e5e9'
          }
        }}
      />
    )
  }

  render() {

    //changes bgcolor on chat screen
    const { bgColor } = this.props.route.params;

    return (
      <View style={{flex: 1,
      backgroundColor: bgColor
      }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}