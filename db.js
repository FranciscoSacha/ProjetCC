const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Mongo connected !");
});

const MessageSchema = new mongoose.Schema({
    content: {
        type:String,
        required: true,
    }
})

const Message = mongoose.model("messages", MessageSchema);

module.exports = Message;