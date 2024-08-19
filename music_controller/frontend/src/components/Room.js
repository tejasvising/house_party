import React, { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const navigate = useNavigate();
  const { roomCode } = useParams();

  useEffect(() => {
    getRoomDetails();

    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoomDetails = () => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);

        if (data.is_host) {
          authenticateSpotify();
        }
      });
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
  .then((response) => {
    // Check if the response is OK and not empty
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Handle cases where the response might be empty
    return response.text().then((text) => {
      return text ? JSON.parse(text) : {};
    });
  })
  .then((data) => {
    console.log("Data received:", data);
    setSong(data);
    // Handle the data received
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });

    //fetch("/spotify/current-song")
   //   .then((response) => response.json())
      //   {console.log(response.ok)
      //   if (!response.ok) {
      //     return {};
      //   }
      //   return response.json();
        
      // }
      
    //  .then((data) => {
     //   setSong(data);
     // });
  };

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then(() => {
      props.leaveRoomCallback();
      navigate("/");
    });
  };

  const renderSettings = () => (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage
          update={true}
          votesToSkip={votesToSkip}
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setShowSettings(false)}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const renderSettingsButton = () => (
    <Grid item xs={12} align="center">
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowSettings(true)}
      >
        Settings
      </Button>
    </Grid>
  );

  if (showSettings) {
    return renderSettings();
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <MusicPlayer {...song} />
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}
