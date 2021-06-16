import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import * as actions from '../actions/actions';
import { Switch, Route, Link, useParams, useRouteMatch } from 'react-router-dom';

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
  let sampleNames = 
    [
      <div id='chatNames'>victor</div>, 
      <div id='chatNames'>jeff</div>,
      <div id='chatNames'>raubern</div>,
      <div id='chatNames'>matt</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
      <div id='chatNames'>davette</div>,
    ]
  let { path, url } = useRouteMatch();

  for (let i = 0; i < props.matches; i++) {
    matchesNames.push(
      <div id='chatName'>
        <Link to={`${url}/:${props.matches[i].username}`} />
      </div>
    );
  }

  function sendMessage() {
    // something something websockets
  }

  return (
    <div id='chatContent'>
      <center>
        <h1 className="textPopIn">Let's talk code bbygorl</h1>
      </center>
        
      {/* <nav>{matchesNames}</nav> */}
      <nav>{sampleNames}</nav>
      {/* ROUTER???? to switch  */}
      <main id='singlechat'>
        <Switch>
          <Route exact path={path}>
            <h2>No chat selected</h2>
          </Route>
          <Route path={path}>
          {/* <Route path={`${path}/${props.matches[i].username}`}> */}
            {/* {DISPLAY CHAT MESSAGES HERE} */}
            <div>
              {/* {something something websockets} */}
            </div>
            <input
              id="nameInput"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}>
            </input>
            <button onClick={sendMessage}>Send</button>
          </Route>
        </Switch>
      </main>  
    </div>
  )
}

export default connect(mapStateToProps, null)(ChatContent);