import React, {Component} from 'react';
import MessageList from './MessageList.jsx';


class Message extends Component {
  render() {
    return (
      <div>
          <div className="message system">
            <MessageList messages={this.props.messages}/>
          </div>
      </div>
    );
  }
}

export default Message;