import React, { Component, Suspense } from "react";
import Alert from "react-bootstrap/Alert";
import FullView from "./FullView";
import Loading from "./Loading";
const Image = React.lazy(() => import("react-bootstrap/Image"));

export class Message extends Component {
  constructor() {
    super();
    this.state = {
      fullview: false,
    };
  }

  render() {
    if (this.props.pic === true) {
      return (
        <div>
          {this.props.username === this.props.author && (
            <div id="self">
              <Alert id="messageself" variant="primary">
                <Suspense fallback={<Loading />}>
                  <div id="msgtxt">{this.props.author}:</div>{" "}
                  <Image
                    alt={this.props.id}
                    onClick={() => {
                      this.setState({ fullview: true });
                    }}
                    loading="lazy"
                    id="msgpic"
                    src={this.props.message}
                  />
                </Suspense>
              </Alert>
              {this.props.userpic && (
                <img
                  alt={this.props.author}
                  id="userpic"
                  src={this.props.userpic}
                />
              )}
            </div>
          )}
          {this.props.username !== this.props.author && (
            <div>
              {this.props.userpic && (
                <img
                  alt={this.props.author}
                  id="userpic"
                  src={this.props.userpic}
                />
              )}
              <Alert id="message" variant="primary">
                <Suspense fallback={<Loading />}>
                  <div id="msgtxt">{this.props.author}:</div>{" "}
                  <Image
                    alt={this.props.id}
                    onClick={() => {
                      this.setState({ fullview: true });
                    }}
                    loading="lazy"
                    id="msgpic"
                    src={this.props.message}
                  />
                </Suspense>
              </Alert>
            </div>
          )}
          <FullView
            show={this.state.fullview}
            onHide={() => this.setState({ fullview: false })}
            pic={this.props.message}
          />
        </div>
      );
    } else
      return (
        <div>
          {this.props.username === this.props.author && (
            <div id="self">
              <Alert id="messageself" variant="primary">
                {this.props.author}: {this.props.message}
              </Alert>
              {this.props.userpic && (
                <img
                  alt={this.props.author}
                  id="userpic"
                  src={this.props.userpic}
                />
              )}
            </div>
          )}
          {this.props.username !== this.props.author && (
            <div style={{ display: "flex" }}>
              {this.props.userpic && (
                <img
                  alt={this.props.author}
                  id="userpic"
                  src={this.props.userpic}
                />
              )}
              <Alert id="message" variant="primary">
                {this.props.author}: {this.props.message}
              </Alert>
            </div>
          )}
        </div>
      );
  }
}

export default Message;
