const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/Chat_Message");

// router.post("/send", async (req, res) => {
//   try {
//     const { toSender, message, toReceiver } = req.body;
//     if (!toSender || !message || !toReceiver) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     let chatMessage;
//     chatMessage = await ChatMessage.findOne({
//       $and: [
//         { "participants.toSender": toSender || toReceiver},
//         { "participants.toReceiver": toReceiver || toSender}
//       ]
//     });
//     console.log(chatMessage);
//     if (!chatMessage) {
//       chatMessage = new ChatMessage({
//         participants: { toSender, toReceiver },
//         messages: [],
//       });
//     }
//     chatMessage.messages.push({ toSender, toReceiver, message });
//     await chatMessage.save();
//     res.status(201).json({ message });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.post("/send", async (req, res) => {
//   try {
//     const { toSender, message, toReceiver } = req.body;
//     if (!toSender || !message || !toReceiver) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
//     let chatMessage = await ChatMessage.findOne({
//       $or: [
//         {
//           $and: [
//             { "toSender": toSender },
//             { "toReceiver": toReceiver },
//           ],
//         },
//         {
//           $and: [
//             { "toSender": toReceiver },
//             { "toReceiver": toSender },
//           ],
//         },
//       ],
//     });

//     if (!chatMessage) {
//       chatMessage = new ChatMessage({toSender, toReceiver, messages:[] });
//     }
//     chatMessage.messages.push({
//       toSender: toSender,
//       toReceiver: toReceiver,
//       message,
//     });
//     await chatMessage.save();
//     res.status(201).json({ message });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/send", async (req, res) => {
  try {
    const { toSender, message, toReceiver } = req.body;
    if (!toSender || !message || !toReceiver) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newMessage = new ChatMessage({ toSender, toReceiver, message });
    await newMessage.save();
    res.status(201).json({ message: message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/:toSender/messages", async (req, res) => {
//   try {
//     const toSender = req.params.toSender;
//     const messages = await ChatMessage.find({
//       "toSender": toSender,
//     }).sort("-timestamp");
//     res.json(messages);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ error: "Error fetching messages" });
//   }
// });

router.get("/:toSender/:toReceiver/messages", async (req, res) => {
  try {
    const { toSender, toReceiver } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { toSender: toSender, toReceiver: toReceiver },
        { toSender: toReceiver, toReceiver: toSender }
      ]
    }).sort({ timestamp: +1 });
    res.json(messages || "message not found");
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

module.exports = router;
