import React, { Component } from "react";
import Message from "./Message";
import Loading from "./Loading";

export class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    const db = this.props.db;
    let mes = this;
    let messdb = db
      .collection("rooms")
      .doc(this.props.room)
      .collection("messages");
    if (this.props.messages && this.props.messages.length > 1) {
    } else {
      messdb.get().then((messages) => {
        let array = messages.docs.map((message) => {
          return message.data();
        });
        mes.props.saveMessages(mes.props.room, array);
      });
    }
  }
  componentDidUpdate() {
    this.props.scroll();
  }

  render() {
    if (this.props.messages) {
      return this.props.messages.map((msg) => (
        <Message
          key={msg.id}
          message={msg.content}
          date={msg.id}
          author={msg.author}
          pic={msg.pic}
          username={this.props.username}
          userpic={msg.userpic}
          user
        />
      ));
    } else return <Loading />;
  }
}

export default React.memo(Messages);
