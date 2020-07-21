const { user } = require("../models");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async(req, res) =>{

    try {

        const schema = Joi.object({
            email: Joi.string().email().min(6).required(),
            password: Joi.string().min(6).required(),
        });
        
        const { error } = schema.validate(req.body);
      
        if (error)
            res.status(400).send({
              error: {
                message: error.details[0].message,
              },
            });

        const {email, password} = req.body;
        const User = await user.findOne({
            where: {email},
        });

        if (!User) return res.status(400).send({error: {message: "Invalid Login"}});
        const validPass = await bcrypt.compare(password,User.password);
        if(!validPass) return res.status(400).send({error: {message: "Invalid Login"}});
        var token = jwt.sign({ id: User.id }, process.env.SECRET_KEY);
        
        res.send({
            status:200,
            message:"Success",
            data:{
                email,
                token
            }
        })   
    }catch(error){
        console.log(error);
    }
}

exports.register = async(req,res) => {
    try {

        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com','id'] } }).required(),
            password: Joi.string().min(6).required(),
            fullName: Joi.string().min(3).max(30).required(),
            gender: Joi.string().min(4).max(6).required(),
            phone: Joi.number().required(),
            address: Joi.string().min(20).max(150).required()
        });
        
        const { error } = schema.validate(req.body);
    
        if (error) {
            res.status(400).send({
                error: {
                    message: error.details[0].message,
                },
            });

        }else{
			
            const { email, password } = req.body;
			const Cek = await user.findOne({
				where: {email},
			});
			
			if (Cek) return res.status(400).send({error: {message: "Email has been used"}});
			
            const hashedPassword = await bcrypt.hash(password, 10);
            const User = await user.create({ ...req.body, password: hashedPassword });
            const token = jwt.sign({ id: User.id }, process.env.SECRET_KEY);
			if(!User) {
				res.send({
					status:"410",
					message:"Login Field",
				});
			}
            res.send({
				status:"200",
				message:"Success",
                data: {
                    email,
                    token,
                },
            });
        }
        
    } catch (error) {
        console.log(error);
    }
}