const app=require("./index")

const connect= require("./src/configs/db")

app.listen(2245, async function(){
    await connect()
    console.log("listening on port 2245")
})