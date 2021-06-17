import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import "./index.scss";
import MainContainer from "./containers/MainContainer";
import LoginContainer from "./containers/LoginContainer";
import Github from "./components/GitHub";
import * as actions from "./actions/actions";
import store from "./store";
import { API_URL } from "./env";
import Onboard from "./components/Onboard";
import socket from "./socket";

function App() {
  const [usersState, setUsersState] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    const githubToken = localStorage.getItem("githubToken");
    if (githubToken) {
      dispatch(actions.githubToken(githubToken));

      fetch(API_URL + `/users/github`, {
        headers: {
          Authorization: `token ${githubToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.user.username) {
            return history.push("/onboard");
          }
          // put the user in the github store
          dispatch(actions.updateUser(data.user));
          //store userId in socket.auth and start socket connection
          socket.auth = { username: data.user.id };
          socket.connect();
        })
        .then(() => console.log("pp", socket))
        .catch(console.log);
    }
  }, []);

  //error handler for invalid username
  socket.on("connect_error", (err) => {
    //listens for err message of invalid username, would be cast in server.js
    if (err.message === "invalid username") {
      usernameAlreadySelected = false;
    }
  });

  const initReactiveProperties = (user) => {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
  };

  socket.on("users", (users) => {
    users.forEach((user) => {
      user.self = user.userID === socket.id;
      initReactiveProperties(user);
    });
    // put the current user first, and then sort by username
    users = users.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });
    setUsersState(users);
  });

  //sets user self to active and push to users array
  socket.on("user connected", (user) => {
    initReactiveProperties(user);
    this.users.push(user);
  });

  //after state change
  // useEffect(() => {
  //   console.log(setUsersState);
  // }, [usersState]);

  console.log("usersState", usersState);
  return (
    <Switch>
      <Route path="/edit" component={Onboard} />
      <Route path="/onboard" component={Onboard} />
      <Route path="/auth" component={LoginContainer} />
      <Route path="/github" component={Github} />
      <Route component={MainContainer} />
    </Switch>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
}

render(<Root />, document.getElementById("root"));
