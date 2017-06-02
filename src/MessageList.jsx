import React from 'react';
import Message from './Message.jsx';

class MessageList extends React.Component {
  render() {
    let messageElements = [];
    let index = 0;
    for (let message of this.props.messages) {
      console.log(message);
       messageElements.push(
         <Message key={index} username={message.user.name} content={message.content} />
       );
      index += 1;
    }
    console.log('MessageList render');
    return (
      <main className="messages">
        {messageElements}
        <div className="message system">
          <span>{this.props.notification}</span>
        </div>
      </main>
    );
  }
}
export default MessageList;
