import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

import User from './Models/User.js';
import Message from './Models/Message.js';
import Notification from './Models/Notification.js';

const uuidV1 = require('uuid/v1');

class App extends Component {

  // States for Current User and Messages //
  constructor(props) {
    super(props);

    this.state = {
      currentUser: new User("Anonymous"),
      messages: [],
      onlineUserCount: 0
    };

    this.addChatMessage = this.addChatMessage.bind(this);
    this.changeUser = this.changeUser.bind(this);
  };

  // Socket Connection Established //
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onopen = () => {
      console.log('Connection established.  Awesomeness awaits.');
    };

    // For Handling Incoming Messages //
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.type);
      switch(data.type) {
        case "incomingMessage":
          const incomingMessage = new Message(
            data.user,
            data.content,
            data.uniqueKey
          );
          this.setState({ messages: this.state.messages.concat(incomingMessage) });
        break;
        case "incomingNotification":
          const incomingNotification = new Notification(
            data.user,
            data.notification,
            data.uniqueKey
          );
          this.setState({ messages: this.state.messages.concat(incomingNotification) });
        break;
        case "onlineUsers":
          this.setState({ onlineUserCount: parseInt(data.value) });
          break;
        case "colourAssignment":
          this.setState({ currentUser: this.state.currentUser.withNewColour(data.colour) });
          break;
        default:
        throw new Error(`Unknown event type ${data.type}`);
      }
    }
  };
  // Socket Connection Ends //

  // Chat Bar Event Listener //
  addChatMessage(event) {
    if (event.key === 'Enter') {
      const newChatMessage = {
        key: uuidV1(),
        user: this.state.currentUser,
        content: event.target.value,
        type: "postMessage"
      }
      this.socket.send(JSON.stringify(newChatMessage));
      event.target.value = "";
    }
  };

  // User Name Change //
  changeUser(event) {
    const timeStamp = Date.now();
    const updatedUser = this.state.currentUser.withNewName(event.target.value);
    this.setState({
      currentUser: updatedUser
    });
    const newUserName = {
      type: "postNotification",
      user: updatedUser,
      notification: `${this.state.currentUser.name} has changed their name to ${updatedUser.name}.`,
      key: timeStamp
    }
    this.socket.send(JSON.stringify(newUserName));
  }

  // Renders HTML //
  render() {
    return (
      <div>
        <nav className="navbar">
        <img className="logo" src="/logo.png" />
         <a href="/" className="navbar-brand">Chatterbox</a>
          <div className="online-users">
            <p>{this.state.onlineUserCount} User(s) Online</p>
          </div>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar
          user={this.state.currentUser}
          addChatMessage={this.addChatMessage}
          changeUser={this.changeUser}
        />
      </div>
    )
  }
}
// Component Ends //


export default App;