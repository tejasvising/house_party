import React, { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Res from "./Res";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link,
  Redirect,
  Navigate
} from "react-router-dom";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    const fetchUserRoom = async () => {
      try {
        const response = await fetch("/api/user-in-room");
        const data = await response.json();
        console.log(data);
        setRoomCode(data.code);
      } catch (error) {
        console.error("Error fetching user room:", error);
      }
    };

    fetchUserRoom();
  }, []);

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  return (

    <Router>
      <Routes>
        
      <Route
  exact
  path="/"
  element={
    roomCode ? (
      <Navigate to={`/room/${roomCode}`} />
    ) : (
      renderHomePage()
    )
  }
/>
        <Route path="/join/*" element={<RoomJoinPage/>} />
        <Route path="/res/*" element={<Res/>} />
        <Route path="/create/" element={<CreateRoomPage/>} />
        <Route
            path="/room/:roomCode"
            element={<Room leaveRoomCallback={clearRoomCode} />}
          />
     </Routes>
    </Router>
  );
};

export default HomePage;
