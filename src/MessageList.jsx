import React from'react';

class MessageList extends React.Component {
  render() {
    return (
      <main className="messages">
          <span className="message-username">{this.props.username}</span>
          <span className="message-content">{this.props.content}</span>
          <div className="message system">
            <span>{this.props.notification}</span>
          </div>
      </main>
    );
  }
}
export default MessageList;
