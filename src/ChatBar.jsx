import React from'react';

class ChatBar extends React.Component {

  render() {
    console.log('ChatBar render');
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          onBlur={this.props.changeUser}
          placeholder="Username"
          defaultValue={this.props.user.name}
        />
        <input className="chatbar-message" onKeyPress={this.props.addChatMessage} placeholder="Message" />
      </footer>
    );
  }
}
export default ChatBar;
