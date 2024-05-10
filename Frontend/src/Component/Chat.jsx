import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  userList: {
    // borderRight: "1px solid #ccc", 
    padding: theme.spacing(2),
    backgroundColor: "#f0f0f0",
    height: "100%",
    overflowY: "auto",
    // border:"2px solid black "

  },
  chatContainer: {
    // padding: theme.spacing(2),
    height: "calc(100vh)",
    backgroundColor:"white", 
    overflowY: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    // border:"2px solid black "

  },
  messageInputContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    marginTop: "auto",
    // border:"2px solid black "

  },
  messageInput: {
    flexGrow: 1,
    marginBottom: theme.spacing(3),

  },
  sendButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),

  },
  messageBubbleContainer: {
    display: "flex",
    // backgroundColor: "red",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(1),
    // border:"2px solid black "

  },
  messageBubble: {
    borderRadius: "20px",
    padding: theme.spacing(1),
    // backgroundColor: "rgb(118,155,228)",
    wordWrap: "break-word",
    maxWidth: "100%",
    fontSize: "1.2rem",
    // color: "black",
    fontFamily:"sans-serif",

  },
  //reciever
    receiverMessageBubble: {
    // backgroundColor: "rgb(118,155,228)",
    alignSelf: "flex-start",
    borderRadius:"10px",
    // color:"white",
    marginLeft:"2rem",
    // border:"2px solid black"
  },
}));

const Chat = ({ selectedUser }) => {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [myMessages, setMessages] = useState([]);

  const chatContainerRef = useRef(null);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (!selectedUser) return;
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8000/api/chat/${selectedUser.userName}/${localStorage.getItem("userName")}/messages`
  //       );
  //       setMessages(response.data.reverse());
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

  //   fetchMessages();
  // }, [selectedUser]);

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/chat/${selectedUser.userName}/${localStorage.getItem("userName")}/messages`
      );
      setMessages(response.data.reverse());
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.status);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Unexpected error occurred:", error.message);
      }
    }
  };
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages,50); 
    return () => clearInterval(interval); 
  }, [selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message) return;
    try {
      const response = await axios.post("http://localhost:8000/api/chat/send", {
        toSender: selectedUser.userName,
        message,
        toReceiver: localStorage.getItem("userName"),
      });
      setMessage("");
      setMessages([response.data, ...myMessages]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Grid
      item
      xs={10}
      style={{ height: "78vh", display: "flex", flexDirection: "column" }}
    >
      <div className={classes.chatContainer} ref={chatContainerRef}>
        {myMessages.map((msg, index) => (
          <div
            key={index}
            className={`${classes.messageBubbleContainer} ${
              msg.toSender === selectedUser.userName
                ? classes.messageBubble
                : classes.receiverMessageBubble
            }`}
          >
            <div className={classes.messageBubble}>{msg.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={classes.messageInputContainer}>
          <TextField
            className={classes.messageInput}
            variant="outlined"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedUser}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.sendButton}
            endIcon={<SendIcon />}
            disabled={!selectedUser || !message}
          >
            Send
          </Button>
        </div>
      </form>
    </Grid>
  );
};

const TwoColumnChat = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users");
        const loggedInUserName = localStorage.getItem("userName");
        const filteredUsers = response.data.filter(
          (user) => user.userName !== loggedInUserName
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Grid container className={classes.root}>
        <Grid item xs={2} className={classes.userList}>
          <h2>Available Users:</h2>
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              style={{
                cursor: "pointer",
                padding: "0.5rem",
                fontSize: "1.3rem",
                borderRadius: "0.4rem",
                backgroundColor:
                  selectedUser === user ? "white" : "transparent",
              }}
            >
              <p>
                {user.userName} ({user.department})
              </p>
            </div>
          ))}
        </Grid>
        {selectedUser && <Chat selectedUser={selectedUser} />}
      </Grid>
    </div>
  );
};

export default TwoColumnChat;
