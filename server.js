import "./env.js";
import { server } from "./index.js";
import { connectMongoose } from "./db.config.js";

server.listen(process.env.PORT,()=>{
    console.log(`App is listening on ${process.env.PORT}` );
    connectMongoose();
});