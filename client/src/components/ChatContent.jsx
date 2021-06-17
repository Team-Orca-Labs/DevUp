import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import * as actions from '../actions/actions';
import { Switch, Route, Link, useParams, useRouteMatch } from 'react-router-dom';
import { API_URL } from "../env";

function mapStateToProps(state) {
  return {
    matches: state.onlyDevs.matches,
  };
}

function ChatContent(props) {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.onlyDevs.id);

  const [message, setMessage] = useState('');

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

  let matchesNames = [];
  let matchesChats = [];
  let sampleNames = ['victor', 'jeff', 'raubern', 'matt', 'davette','victor', 'jeff', 'raubern', 'matt', 'davette','victor', 'jeff', 'raubern', 'matt', 'davette','victor', 'jeff', 'raubern', 'matt', 'davette'];

  let { path, url } = useRouteMatch();

  for (let i = 0; i < sampleNames.length; i++) {
    matchesNames.push(
      <Link 
        to={`${url}/:${sampleNames[i]}`} 
        id='chatlink'
        key={i}
      >
      {sampleNames[i]}
      </Link>
    );
    matchesChats.push(
      <Route
        path={`${url}/:${sampleNames[i]}`}
        key={i}
      >
      </Route>
    )
  }

  // for (let i = 0; i < props.matches; i++) {
  //   matchesNames.push(
  //     <div id='chatName'>
  //       <Link to={`${url}/:${props.matches[i].username}`} />
  //     </div>
  //   );
  // }

  function sendMessage() {
    // something something websockets
    // whats the endpath for database updates?
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
          dispatch(actions.updateMessages(data.messages));
        })
        .catch((err) => console.log(err));
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

  return (
    <div id='chatContent'>
      <center>
        <h1 className="textPopIn">Let's talk code bbygorl</h1>
      </center>
        
      {/* <nav>{matchesNames}</nav> */}
      <nav>{matchesNames}</nav>
      {/* ROUTER???? to switch  */}
      <main id='singlechat'>

        <Switch>
          <Route exact path={path}>
            <h2>No chat selected</h2>
          </Route>
          {matchesChats}
        </Switch>
        
        <div id='inputsend'>
          <input
            id="messageInput"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}>
          </input>
          <button onClick={sendMessage}>Send</button>
        </div>
      
      </main> 
    </div>
  )
}

export default connect(mapStateToProps, null)(ChatContent);