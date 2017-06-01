import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import index from './index.jsx';
let getLocation = require('./getLocation').getLocation;
let getURL = require('./getURL').getURL;


class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      enterMessage: function(e) {
        if (e.key === 'Enter') {
          this.socket.send(JSON.stringify(
                { type: 'postMessage',
                  username: this.state.currentUser.name,
                  content: e.target.value,
                  colour: window.colour
                })
          );
        }
      }.bind(this),

      changeName: function(e) {
        if (e.key === 'Enter') {
          this.socket.send(JSON.stringify(
            {"type": "postNotification",
             "content": `${this.state.currentUser.name} has changed their name to ${e.target.value}.`
            })
          );
          this.setState({currentUser: {name: e.target.value}});
        }
      }.bind(this),

      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      notification: '',
      clientCount: 0
    };
    getLocation = getLocation.bind(this);
    getURL = getURL.bind(this);
  }

  componentDidMount() {

    const socketServer = new WebSocket("ws://localhost:4000");
    this.socket = socketServer;
    console.log("componentDidMount <App />");

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch(data.type) {

      case "incomingMessage":

        let url = getURL(data.content);
        let isImage = false;
        if (url) {
          let pathname = getLocation(url).pathname;
          if (['png', 'jpg', 'gif', 'jpeg'].indexOf(pathname.split('.').pop()) > -1) {
            isImage = true;
            data.content = data.content.replace(url, '');
          }
        }

        const newMessage = {username: data.username,
                            content: data.content,
                            colour: data.colour,
                            img: isImage ? url : null};

        const messages = this.state.messages.concat(newMessage);
        this.setState({messages: messages});
        break;

      case "incomingNotification":
        console.log('this in incoming notification', this);

        console.log('data.content', data.content);
        const notification = data.content;
        this.setState({notification: data.content});
        break;

      case "clientCount":

        this.setState({clientCount: data.count})
        break;

      case "changeColour":
        window.colour = data.colour;
        // $("#" + data.).css({"background-color": data.color});
        break

      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + data.type);
      }

    }


  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <span className="clientCount">
            Active users: {this.state.clientCount}
          </span>
        </nav>

        <div className="message system">
          {this.state.notification}
        </div>
        <main className="messages">
          <Message messages= {this.state.messages} />
        </main>
        <ChatBar currentUser ={this.state.currentUser}
                 enterMessage ={this.state.enterMessage}
                 changeName = {this.state.changeName} />
      </div>
    );
  }
}
export default App;

//https://en.wikipedia.org/wiki/File:June_odd-eyed-cat.jpg