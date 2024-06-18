import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import io from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "81vh",
    display: "flex",
  },
  userList: {
    backgroundColor: "#ededed",
    // border: "1px solid",
    height: "auto",
    overflowY: "auto",
    width: "25%",
    borderRight: "1px solid #ddd",
    padding: "0.5rem",
  },
  selectedUser: {
    fontWeight: "bold",
    backgroundColor: "#e5ddd5",
    borderRadius: "5px",
  },
  user: {
    padding: theme.spacing(1.5),
    fontSize: "1.3rem",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "gray",
      transition: "background-color 0.3s",
    },
  },
  chatContainer: {
    height: "100%",
    backgroundColor: "#e5ddd5",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
  },
  messageInputContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    backgroundColor: "#fff",
    borderTop: "1px solid #ddd",
  },
  messageInput: {
    flexGrow: 1,
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  sendButton: {
    marginBottom: theme.spacing(1),
    padding: "1rem",
  },
  messageBubbleContainer: {
    borderRadius: "10px",
    display: "flex",
    justifyContent: "flex-end",
    margin: theme.spacing(1),
  },
  messageBubble: {
    borderRadius: "10px",
    padding: theme.spacing(1),
    backgroundColor: "#dcf8c6",
    fontSize: "1.2rem",
  },
  receiverMessageBubble: {
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
}));

const socket = io("http://localhost:8000");
const Chat = ({ selectedUser }) => {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [myMessages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/api/chat/${
          selectedUser.email
        }/${localStorage.getItem("email")}/messages`
      );
      setMessages(response.data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    fetchMessages();
    if (selectedUser) {
      socket.emit("joinRoom", localStorage.getItem("email"));
      socket.on("receiveMessage", (newMessage) => {
        if (
          (newMessage.toSender === selectedUser.email &&
            newMessage.toReceiver === localStorage.getItem("email")) ||
          (newMessage.toReceiver === selectedUser.email &&
            newMessage.toSender === localStorage.getItem("email"))
        ) {
          setMessages((prevMessages) => [newMessage, ...prevMessages]);
        }
      });
    }
    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message) return;
    const newMessage = {
      toSender: selectedUser.email,
      message,
      toReceiver: localStorage.getItem("email"),
    };
    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  return (
    <Grid
      item
      style={{
        width: "75%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className={classes.chatContainer} ref={chatContainerRef}>
        {myMessages.map((msg, index) => (
          <div
            key={index}
            className={`${classes.messageBubbleContainer} ${
              msg.toSender === selectedUser.email
                ? ""
                : classes.receiverMessageBubble
            }`}
          >
            <div className={classes.messageBubble}>
              <span>{msg.message}</span>
              <span
                style={{
                  fontSize: "0.8rem",
                  marginLeft: "auto",
                  display: "flex",
                  flexDirection: "row-reverse",
                  marginTop: "0.3rem",
                }}
              >
                {`${new Date(msg.timestamp).getHours()}:${new Date(
                  msg.timestamp
                ).getMinutes()}`}
              </span>
            </div>
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
        const loggedInemail = localStorage.getItem("email");
        const filteredUsers = response.data.filter(
          (user) => user.email !== loggedInemail
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
    <div className={classes.root}>
      <Grid item className={classes.userList}>
        <h2>Available Users:</h2>
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`${classes.user} ${
              selectedUser === user ? classes.selectedUser : ""
            }`}
          >
            <p>
              {user.email} ({user.department})
            </p>
          </div>
        ))}
      </Grid>
      {selectedUser && <Chat selectedUser={selectedUser} />}
    </div>
  );
};

export default TwoColumnChat;
