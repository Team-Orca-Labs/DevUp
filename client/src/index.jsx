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
          //store userId in socket.auth and start socket connection\
          console.log("data of user", data.user);
          console.log("id", data.user.id);
          socket.auth = {
            username: data.user.username,
            userId: JSON.stringify(data.user.id),
            id: data.user.id,
          };
          console.log();
          socket.connect(data.user.id);
        })
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
