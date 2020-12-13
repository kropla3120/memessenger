import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/messaging";
import Interface from "./components/Interface";
import { isMobile } from "react-device-detect";
import LandingPage from "./components/LandingPage";

const firebaseConfig = {
  //konfiguracja projektu firebase
  apiKey: "AIzaSyBX-Yk-BKl0TsHjkTgQo2GeM9cl-4H_IbQ",
  authDomain: "memessenger-578e5.firebaseapp.com",
  databaseURL: "https://memessenger-578e5.firebaseio.com",
  projectId: "memessenger-578e5",
  storageBucket: "memessenger-578e5.appspot.com",
  messagingSenderId: "1078024062877",
  appId: "1:1078024062877:web:4e39f8cec60aba90cad174",
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
const messaging = firebase.messaging();
var storage = firebase.storage();
var provider = new firebase.auth.FacebookAuthProvider();
messaging.usePublicVapidKey("BA3_8NAH-mcmZ3XExCxm_-Y-Frr6df87DmLhehR10IfyBpZKLnC8afb56jgcCPLuH0_lXEj0fdr_6ZE_KdAMKks");

class App extends Component {
  constructor() {
    super();
    this.state = {
      userid: "",
      islogged: undefined,
      username: "",
      valid: true,
      error: "",
      userpic: "",
      connected: true,
      register: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleFbLogin = this.handleFbLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillUnmount() {}

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        //wylogowano
        console.log("signed out");
      })
      .catch(function (error) {
        // blad
        console.error(error);
      });
  }
  handleLogin(email, password) {
    let app = this;
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .catch(function (error) {
            // nie ma potrzeby aktualizacji state o uzytkowniku poniewaz funkcja w componentdidmount to zrobi
            app.setState({ valid: false, error: error.message });
          });
      });
  }
  handleRegister(email, password, usernameinput) {
    let app = this;
    this.setState({ register: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password) // rejestracja
      .then((e) => {
        if (e.user) {
          db.collection("rooms")
            .doc("default")
            .update({
              users: firebase.firestore.FieldValue.arrayUnion(e.user.uid), // dodanie nowo utworzonego uzytkownika do domyslnego pokoju
            });
          e.user.updateProfile({ displayName: usernameinput }); // zaktualizowanie nazwy uzytkownika
          sessionStorage.setItem("islogged", true);
          app.setState({
            // wczytanie informacji o uzytkowniku do state
            islogged: true,
            username: usernameinput,
            userid: e.user.uid,
            userpic: e.user.photoURL,
          });
          app.refs.interface.getRoomsOnAuth(e.user); // wywoalnie funkcji do zaladowania pokoji uzytkownika
        } else {
        }
      })
      .catch(function (error) {
        app.setState({ valid: false, error: error.message }); // wyswietlenie bledow
      });
  }
  handleFbLogin() {
    const app = this;
    let fbauth;
    if (isMobile) {
      // jesli na telefonie logowanie przez fb musi byc poprzez przekierowanie
      fbauth = firebase.auth().signInWithRedirect(provider);
    } else {
      // na komputerze popup
      fbauth = firebase.auth().signInWithPopup(provider);
    }
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        return fbauth.catch(function (error) {
          // nie ma potrzeby aktualizacji state o uzytkowniku poniewaz funkcja w componentdidmount to zrobi
          app.setState({ valid: false, error: error.message }); // jesli wystapi blad w autoryzacji, zostanie wyswietlony
          console.log(error);
        });
      });
  }

  componentDidMount() {
    let app = this;
    // console.log(this.refs.interface);
    firebase.auth().onAuthStateChanged((user) => {
      if (!this.state.register) {
        if (user) {
          // uzytkownik zalogowany
          sessionStorage.setItem("islogged", true); // zapisanie stanu zalogowania w sessionstorage
          app.setState({
            // wczytanie informacji o uzytkowniku do state
            islogged: true,
            username: user.displayName,
            userid: user.uid,
            userpic: user.photoURL,
          });
          app.refs.interface.getRoomsOnAuth(user); // wywolanie funkcji do wczytania pokojów
        } else {
          // uzytkownik niezalogowany
          sessionStorage.setItem("islogged", false); // zapisanie stanu zalogowania w sessionstorage
          app.setState({ islogged: false });
        }
      }
    });
  }

  render() {
    let islogged = sessionStorage.getItem("islogged");
    return (
      <div>
        {/* renderowanie warunkowe w zaleznosci od stanu zalogowania */}
        {islogged === "true" ? (
          <Interface // komponent widocznyh po zalogowaniu (podstrona)
            ref="interface"
            userpic={this.state.userpic}
            storage={storage}
            db={db}
            id={this.state.userid}
            logout={this.logout}
            username={this.state.username}
          />
        ) : (
          <LandingPage // ekran logowania
            fblogin={this.handleFbLogin}
            err={this.state.error}
            valid={this.state.valid}
            connected={this.state.connected}
            login={this.handleLogin}
            register={this.handleRegister}
          />
        )}
      </div>
    );
  }
}

export default App;
