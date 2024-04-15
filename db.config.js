import mongoose from "mongoose";
const url = process.env.DB_URL;
export const connectMongoose = async () => {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("<----->Connected Using Mongoose On Mongodb<----->");
    } catch (error) {
      console.log("Something went wrong while connecting to DataBase");
      console.log(error);
    }
  };