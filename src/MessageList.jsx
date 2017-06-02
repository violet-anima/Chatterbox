import React from 'react';
import MessageComponent from './Message.jsx';
import NotificationComponent from './Notification.jsx';
import Message from './Models/Message.js';
import Notification from './Models/Notification.js';

class MessageList extends React.Component {
  render() {
    let messageElements = [];
    for (let message of this.props.messages) {
      if (message instanceof Notification) {
        messageElements.push(
          <NotificationComponent key={message.key} content={message.content} />
        );
      } else if (message instanceof Message) {
        messageElements.push(
         <MessageComponent
          key={message.key}
          username={message.user.name}
          content={message.content}
          colour={message.user.colour} />
       );
      }

    }
    //console.log('MessageList render');
    return (
      <main className="messages">
        {messageElements}
      </main>
    );
  }
}
export default MessageList;
