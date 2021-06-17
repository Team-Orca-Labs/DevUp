import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as actions from "../actions/actions";
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { API_URL } from "../env";
import socket from "../socket";

function mapStateToProps(state) {
  return {
    matches: state.onlyDevs.matches,
  };
}

function ChatContent(props) {
  const [usersState, setUsersState] = useState([]);
  const [messageDisplay, setmessageDisplay] = useState();

  const dispatch = useDispatch();
  const id = useSelector((state) => state.onlyDevs.id);

  const [message, setMessage] = useState();
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    if (id) {
      const url = API_URL + `/matches?userId=${id}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          dispatch(actions.updateMatches(data.matches));
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  useEffect(() => {
    if (selectedUser) {
      messageDisplayFunc();
    }
  }, [selectedUser]);

  // *******************************************
  // socket.io
  // *******************************************
  const initReactiveProperties = (user) => {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
  };

  socket.on("users", (users) => {
    users.forEach((user) => {
      console.log(user.userId, socket.id);
      user.self = user.id === socket.id;
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
    console.log("user", user);
    initReactiveProperties(user);
    setUsersState([...usersState, user]);
    // users.push(user);
  });

  // after state change
  useEffect(() => {
    console.log("usersState", usersState);
    console.log("selectedUser", selectedUser);
  }, [usersState, selectedUser]);

  console.log("usersState", usersState);

  let matchesNames = [];
  let matchesChats = [];
  let sampleNames = [
    "victor",
    "jeff",
    "raubern",
    "matt",
    "davette",
    "victor",
    "jeff",
    "raubern",
    "matt",
    "davette",
    "victor",
    "jeff",
    "raubern",
    "matt",
    "davette",
    "victor",
    "jeff",
    "raubern",
    "matt",
    "davette",
  ];

  let { path, url } = useRouteMatch();

  for (let i = 0; i < usersState.length; i++) {
    matchesNames.push(
      <Link
        to={`${url}/:${usersState[i].userId}`}
        onClick={() => {
          setSelectedUser(usersState[i]);
        }}
        id="chatlink"
        key={i}
      >
        {usersState[i].username}
        {usersState[i].self && " (yourself)"}
        {/* checks if user is connected and displays connected if they are */}
        {usersState[i].connected && " connected!"}
      </Link>
    );
    matchesChats.push(
      <Route path={`${url}/:${usersState[i].userId}`} key={i}></Route>
    );
  }

  // for (let i = 0; i < props.matches; i++) {
  //   matchesNames.push(
  //     <div id='chatName'>
  //       <Link to={`${url}/:${props.matches[i].username}`} />
  //     </div>
  //   );
  // }

  function sendMessage(content) {
    //when user sends message, it emits the userId of user they're sending it to
    //need to grab selectedUser from when the user clicks the link
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.id,
      });
      //pushes to message to selectedUser. We'd want to push to state and db
      selectedUser.messages.push({
        content,
        fromSelf: true,
      });
      messageDisplayFunc();
    }
    // whats the endpath for database updates?
    //still need to push to db

    // fetch(url)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     dispatch(actions.updateMessages(data.messages));
    //   })
    //   .catch((err) => console.log(err));
  }

  // useEffect(() => {
  //   if (id) {
  //     const url = API_URL + `/matches?userId=${id}`;
  //     fetch(url)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         dispatch(actions.updateMatches(data.matches));
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, []);

  // }
  socket.on("private message", ({ content, from }) => {
    //finds the user from users in state that matches the userId we sent message to
    for (let i = 0; i < usersState.length; i++) {
      const user = usersState[i];
      console.log("user.userId", user.userID, from);
      if (user.userID === from) {
        //pushes message to that user's messages prop
        user.messages.push({
          content,
          fromSelf: false,
        });
        //checks if the user we sent message to doesn't match the selectedUser
        if (user !== this.selectedUser) {
          user.hasNewMessages = true;
        }
        break;
      }
    }
  });

  //connect and disconnect ares pecial events that are run upon connection and disconnection
  //when socket connects, sets user.connected for self to true
  socket.on("connect", () => {
    usersState.forEach((user) => {
      if (user.self) {
        user.connected = true;
      }
    });
  });
  //when socket connects, sets user.connected for self to false
  socket.on("disconnect", () => {
    usersState.forEach((user) => {
      if (user.self) {
        user.connected = false;
      }
    });
  });

  const messageDisplayFunc = () => {
    const messages = selectedUser.messages.map((ele) => {
      if (ele.fromSelf) {
        return <p>{`(you) ${ele.content}`}</p>;
      } else {
        return <p>{`(${selectedUser.username}) ${ele.content}`}</p>;
      }
    });
    setmessageDisplay(messages);
  };

  return (
    <div id="chatContent">
      <center>
        <h1 className="textPopIn">Let's talk code bbygorl</h1>
      </center>

      {/* <nav>{matchesNames}</nav> */}
      <nav>{matchesNames}</nav>
      {/* ROUTER???? to switch  */}
      <main id="singlechat">
        <Switch>
          <Route exact path={path}>
            <h2>No chat selected</h2>
          </Route>
          {matchesChats}
        </Switch>
        <div id="chatbox">{selectedUser && messageDisplay}</div>
        <div id="inputsend">
          <input
            id="messageInput"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button onClick={() => sendMessage(message)}>Send</button>
        </div>
      </main>
    </div>
  );
}

export default connect(mapStateToProps, null)(ChatContent);
