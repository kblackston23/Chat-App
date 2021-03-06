import React from 'react';
import { View, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';



export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
      image: null,
      location: null
    };


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
    
    // To remove warning message in the console
    LogBox.ignoreLogs([
      "Setting a timer",
      "Warning: ...",
      "undefined",
      "Animated.event now requires a second argument for options",
      "Console Warning"
    ]);
  }


    async getMessages() {
      let messages = '';
      try {
        messages = await AsyncStorage.getItem('messages') || [];
        this.setState({
          messages: JSON.parse(messages)
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    async saveMessages() {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
      } catch (error) {
        console.log(error.message);
      }
    };

    async deleteMessages() {
      try {
        await AsyncStorage.removeItem('messages');
        this.setState({
          messages: []
        })
      } catch (error) {
        console.log(error.message);
      }
    };

  componentDidMount() {
    //sets user name at top of screen
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name});

    NetInfo.fetch().then(connection => {
			if (connection.isConnected) {
				this.setState({ isConnected: true });
				console.log('online');
				// listens for updates in the collection
				this.unsubscribe = this.referenceChatMessages
					.orderBy('createdAt', 'desc')
					.onSnapshot(this.onCollectionUpdate);


    // user authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return await firebase.auth().signInAnonymously();
      }

    
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });

      //messages for current user
      this.refMsgsUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
    });


        // save messages locally
        this.saveMessages();
      } else {
        // if the user is offline
        this.setState({ isConnected: false });
        console.log('offline');
        this.getMessages();
      }
  });
}

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // goes through each document
    querySnapshot.forEach((doc) => {
      // gets the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id, 
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        },
        image: data.image || null,
        location: data.location || null
      });
   });
   this.setState({
    messages: messages
  });
  this.saveMessages();
};

  //adding messages to the database
  addMessage() {
    const message = this.state.messages[0];
    
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || "",
      location: message.location || null,
    });
  }

  //when a message is sent, calls saveMessage
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
      this.addMessage();
    });
  }

  componentWillUnmount() {
    // close connections when app is closed
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.unsubscribe();
        this.authUnsubscribe();
      }
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#293d3d'
          },
          left: {
            backgroundColor: '#e2e5e9'
          }
        }}
      />
    )
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
        return (
            <MapView
                style={{width: 130,
                height: 130,
                margin: 9,
                }}
                region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
            />
        );
    }
    return null;
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
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}