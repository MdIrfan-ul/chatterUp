import mongoose from "mongoose";
function getTimeInHoursAndMinutes() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
const chatSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: {
      type: String,
      default: getTimeInHoursAndMinutes,
    },
      

});

export const Chat = mongoose.model("Chats",chatSchema);