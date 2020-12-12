import React, { Component } from "react";
import Message from "./Message";
import Loading from "./Loading";

export class Messages extends Component {
  constructor() {
    super();
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
      //jesli nie ma wiadomosci z danego pokoju zapisanych w pamieci
      messdb.get().then((messages) => {
        // pobranie wiadomosci z danego pokoju
        let array = messages.docs.map((message) => {
          return message.data();
        });
        mes.props.saveMessages(mes.props.room, array); // zapisanie wiadomosci w komponencie wyzej
      });
    }
  }
  componentDidUpdate() {
    this.props.scroll();
  }

  render() {
    if (this.props.messages) {
      return this.props.messages.map((msg) => (
        <Message //komponent pojedynczej wiadomosci
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
