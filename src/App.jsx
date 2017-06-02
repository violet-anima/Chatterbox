import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
const uuidV1 = require('uuid/v1');

class App extends Component {

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
          const user = this.state.user.concat(data.value);
          this.setState({ value: user });
          break;
        default:
        throw new Error(`Unknown event type ${data.type}`);
      }
    }
  }; //----end of Socket connection----\\

//----Settings states currentUser and messages----\\
  constructor(props) {
    super(props);
    this.state = {
      currentUser: { username: "Anonymous" },
      messages: [],
      user: []
    };
  this.addChatMessage = this.addChatMessage.bind(this);
  this.changeUser = this.changeUser.bind(this);
  };

//----Event listener for chat bar; sends data to server----\\
  addChatMessage = function(event) {
    const timeStamp = uuidV1();
    if(event.key === 'Enter') {
      const newChatMessage = {
          key: timeStamp,
          username: this.state.currentUser.username,
          content: event.target.value,
          type: "postMessage"
        }
      this.socket.send(JSON.stringify(newChatMessage));
      event.target.value = "";
    }
  };

//----Function to handle Username Change----\\
  changeUser = (event) => {
      const timeStamp = Date.now();
      this.setState({ currentUser: { username: event.target.value }});
      const newUserName = {
        type: "postNotification",
        username: event.target.value,
        notification: `${this.state.currentUser.username} has changed their name to ${event.target.value}.`,
        key: timeStamp
        }
      this.socket.send(JSON.stringify(newUserName));
  }
//----Rendering HTML----\\
  render() {
    return (
      <div>
        <nav className="navbar">
        <img className="logo" src="/logo.png" />
         <a href="/" className="navbar-brand">Chatty Cathy</a>
          <div className="online-users">
            <p>{this.state.value} User(s) Online</p>
          </div>
        </nav>
        {this.state.messages.map((message) =>
          <MessageList key={message.key} username={message.username} content={message.content} notification={message.notification} />
        )}
        <ChatBar addChatMessage={this.addChatMessage} changeUser={this.changeUser} />
      </div>
    )
  }
}//----end of componenet----\\


/* adding colour set random colour in props then send over send back and assign*/


export default App;