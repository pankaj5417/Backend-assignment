const express = require("express");
const { body, validationResult } = require('express-validator');

const Product = require("../models/user.model");

const router = express.Router();

router.post(
  "/",
  body("first_name")
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Name of product has to be at least 4 characters and maximum 20 characters"
    ),
    body("last_name")
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Name of product has to be at least 4 characters and maximum 20 characters"
    ),
    /*
  body("price").custom((value) => {
    // value = 1900
    const isNumber = /^[0-9]*$/.test(value); // true or false
    if (!isNumber || value <= 0) {
      throw new Error("Price cannot be 0 or negative");
    }
    return true;
  }),
  */
  body("email").custom(async (value) => {
    // value = a@a.com
    const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);

    const listDomain=["gmail.com","yahoo.com","email.com","hotmail.com"]

    const email=value.split("@")

    if(!listDomain.includes(email[1])){

   throw new Error("We don't accept emails from thos domain")

    }
    if (!isEmail) {
      throw new Error("Please enter a proper email address");
    
}


    const productByEmail = await Product.findOne({ email: value })
      .lean()
      .exec();
    if (productByEmail) {
      throw new Error("Please try with a different email address");
    }
    return true;
  }),
  body("age")
  .isLength({min:1, max:100})
  .withMessage("Age should be between 1 to 100"),

  body("pincode")
  .isLength({min:6, max:6})
  .withMessage("Pincode should be length 6"),

  /*body("gender").custom(async (value) => {
  if(value!="Male"||value!="Female"||value!="Others")
  throw new Error("Gender should be either Male,Female or Others")
  }),*/
 
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let newErrors = errors.array().map(({ msg, param, location }) => {
        return {
          [param]: msg,
        };
      });
      return res.status(400).json({ errors: newErrors });
    }
    try {
      const product = await Product.create(req.body);

      return res.status(201).json({ product });
    } catch (e) {
      return res.status(500).json({ status: "failed", message: e.message });
    }
  }
);


router.get("/", async(req,res)=>{

    try{
        
        const user= await Product.find().lean().exec()

        return res.status(201).send(user)
    }catch(e){
        return res.status(500).send({message:e.message,status:"failed"})
    }
})

module.exports = router;