import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
const uuidV1 = require('uuid/v1');

class App extends Component {

//----Settings states currentUser and messages----\\
  constructor(props) {
    super(props);

    this.state = {
      currentUser: { name: "Bob" },
      messages: [
        {user: {name: "Bob"}, content: "Hi!"},
        {user: {name: "Judy"}, content: "Hey!"},
        {user: {name: "Bob"}, content: "Test"},
        {user: {name: "Judy"}, content: "Boom!"}
      ],
      onlineUserCount: 0
    };

    this.addChatMessage = this.addChatMessage.bind(this);
    this.changeUser = this.changeUser.bind(this);
  };

//----Establishing socket connection----\\
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onopen = () => {
      console.log('Great Success. Connection established.');
    };


//----Handles incoming messages----\\
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch(data.type) {
        case "incomingMessage":
          const messages = this.state.messages.concat(data);
          this.setState({ messages });
        break;
        case "incomingNotification":
          const notification = this.state.messages.concat(data);
          this.setState({ messages: notification });
        break;
        case "onlineUsers":
          this.setState({ onlineUserCount: parseInt(data.value) });
          break;
        default:
        throw new Error(`Unknown event type ${data.type}`);
      }
    }
  }; //----end of Socket connection----\\





//----Event listener for chat bar; sends data to server----\\
  addChatMessage(event) {
    const timeStamp = uuidV1();
    if(event.key === 'Enter') {
      const newChatMessage = {
          key: timeStamp,
          name: this.state.currentUser.name,
          content: event.target.value,
          type: "postMessage"
        }
      this.socket.send(JSON.stringify(newChatMessage));
      event.target.value = "";
    }
  };


//----Function to handle Username Change----\\
  changeUser(event) {
      const timeStamp = Date.now();
      this.setState({ currentUser: { name: event.target.value }});
      const newUserName = {
        type: "postNotification",
        name: event.target.value,
        notification: `${this.state.currentUser.name} has changed their name to ${event.target.value}.`,
        key: timeStamp
        }
      this.socket.send(JSON.stringify(newUserName));
  }

//----Rendering HTML----\\
  render() {
    console.log('App render');
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
}//----end of componenet----\\



/* adding colour set random colour in props then send over send back and assign*/


export default App;