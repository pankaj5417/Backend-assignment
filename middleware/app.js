const express=require("express")
const mongoose = require("mongoose")





//step1

const connect=()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/book")}
//step2

const bookSchema=new mongoose.Schema({
    book_name:{type:String, required: true},
    author:{ type: String, required: true},
    language:{ type: String, required: false},

    pages: {type: Number , required: false},
    year: {type: Number , required: true},
    

},
{
    versionKey: false,
    timestamps: true,
})
//step 3

const Book = mongoose.model("book", bookSchema)


const app=express()
app.use(express.json())


const auth=(req,res,next)=>{
    console.log("before")

    next()

    console.log("after")
}
app.use(auth)
const authenticate=(req,res,next)=>{
    console.log("aunthenticate")
    next()
}
/*
const authorise=(permission)=>{
return (req,res,next)=>{
    console.log("authorise")
    next()
}
}
*/

const authorise = (permission) => {
    return (req, res, next) => {
     // const originalSendFunc = res.send.bind(res);
     // res.send = function (body) {
     //   body.name = "Nrupul Dev";
      //  console.log(body);
        req.name="Pankaj kumar" // do whatever here
      //  return originalSendFunc(body);
     // };
      next();
    };
  };

  
  
//does not require auth

app.get("/books" , async (req, res)=> {
    //thennable

    try{

        const book= await Book.find().lean().exec();

        res.send({ book })
    }catch(e){
        res.status(500).json({ message: e.message, status:"Failed" })
    }
})




app.get("/users",auth,(req,res)=>{
    //console.log(req.body)
   
    res.send(users)
})


//require auth

app.post("/users",auth,(req,res)=>{
    //console.log(req.body)
   
    res.send(users)
})

/*

app.post("/books",authenticate,authorise(["author","book name"]),async(req,res)=>{
    //console.log(req.body)
    const book = await Book.create(req.body);
    return res.status(201).send(book)

  //  res.send("api requested by"+" "+req.name)
})
*/
//does not require auth

app.post("/books",authorise(["author","book_name"]),async(req,res)=>{
    //console.log(req.body)
    try{
        const book = await Book.create(req.body);
       return res.status(201).send(book+"api requested by"+" "+req.name)
    }catch(e){
        res.status(500).json({ status: e.message })
    }
    
    
})


/*
app.get("/books" , async (req, res)=> {
    //thennable

    try{

        const book= await Book.find().lean().exec();

        res.send({ book })
    }catch(e){
        res.status(500).json({ message: e.message, status:"Failed" })
    }
})
*/

app.get("/books/:id" , async (req, res)=> {
    //thennable

    try{

        const book= await Book.findById(req.params.id).lean().exec();

        res.send({ book })
    }catch(e){
        res.status(500).json({ message: e.message, status:"Failed" })
    }
})

app.patch("/books/:id" ,  async(req, res)=> {
    //thennable

    try{

        const book= await Book.findByIdAndUpdate(req.params.id,req.body).lean().exec();

        return res.status(201).send({ book })
    }catch(e){
       return res.status(500).json({ message: e.message, status:"Failed" })
    }
})


app.delete("/books/:id" , async (req, res)=> {
    //thennable

    try{

        const book= await Book.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(201).send({ books })
    }catch(e){
        res.status(500).json({ message: e.message, status:"Failed" })
    }
})



app.listen(2345,async function(){
    await connect()
    console.log("listening on port 2345")
})
