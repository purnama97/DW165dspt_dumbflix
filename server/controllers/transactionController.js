const { transaction, user } = require("../models");
const Joi = require("@hapi/joi");
const dayjs = require("dayjs");
const fs = require("fs");

const subscribeUser = async (status,id) => {
	if(status === "Approve"){
		await user.update({ subscribe: 1 }, { where: { "id": id} });
	} else {
		await user.update({ subscribe: 0 }, { where: { "id": id} });
	}
}

const deleteUpload = async (img) => {
  fs.stat(__dirname + "/../trxImg/" + img, function (err, stats) {
    if (err) {
      return console.error(err);
    }
    fs.unlink(__dirname + "/../trxImg/" + img, function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  });
};


exports.create = async(req,res) => {
    try {

        const schema = Joi.object({
            userId: Joi.number().required(),
            attache: Joi.string().required()
        });
        
        const { error } = schema.validate({...req.body, attache:req.file.filename});
    
        if (error) {
            res.status(400).send({
                error: {
                    message: error.details[0].message,
                },
            });

        }else{
			const cekStatus = await transaction.findAll({where:{"status":"Pending",userId:req.body.userId}})
			if(cekStatus.length > 0) {
				res.status(400).send({error: {message:"There are still transactions that have not yet been processed"}});
				await deleteUpload(req.file.filename);
            //const Transaction = await transaction.create(req.body);
			}else{
				let d1 = dayjs().format('YYYY-MM-DD HH:mm:ss');
				let d2 = dayjs().add(30, "day").format('YYYY-MM-DD HH:mm:ss');
				const tranNew = {
					"startDate":d1,
					"dueDate":d2,
					"attache":req.file.filename,
					"status":"Pending",
					"userId":req.body.userId
				}
				
				const Transaction = await transaction.create(tranNew)
				const transactionNew = await transaction.findOne(
				{
					include: {
					  model: user,
					  as:"user",
					  attributes: {
						exclude: ["password","createdAt", "updatedAt"],
					  },
					},
					attributes: {
					  exclude: ["artistId","createdAt","updatedAt"],
					},
					where:{"id":Transaction.id}
				});
				res.send({
					status:"200",
					message:"Success",
					type:"Transaction",
					data: transactionNew,
				});
			}
		}
    } catch (error) {
        res.send({ 
		status:500,
		message:"Internal Server Error"
		});
    }
}

exports.read = async(req,res) => {
    try {
		const User = await user.findOne({where:{"id":req.user.id}})
		const Transactions = await transaction.findAll(
            {
				include: {
				  model: user,
				  as:"user",
				  attributes: {
					exclude: ["password","createdAt", "updatedAt"],
				  },
				  where: User.role === 1 ? "" : {"id":req.user.id},
				},
                attributes: {
                  exclude: ["artistId","createdAt","updatedAt"],
                },
            });
            res.send({
				status:"200",
				message:"Success",
				type:"Transaction",
                data: Transactions,
            });
    } catch (error) {
        res.send({ 
		status:500,
		message:"Internal Server Error"
		});
    }
}

exports.update = async(req,res) => {
	  try {

        const schema = Joi.object({
            startDate: Joi.string().required(),
            dueDate: Joi.string().required(),
            attache: Joi.string().required(),
            status: Joi.string().required(),
            userId: Joi.number().required()
        });
        
        const { error } = schema.validate(req.body);
			
        if (error) {
            res.status(400).send({
                error: {
                    message: error.details[0].message,
                },
            });

        }else{
			const User= await user.findOne({where:{"id":req.body.userId}})
			if(!User) return res.send(400,{"message":"User not found"})
			const transUpt = await transaction.update(
				req.body,
				{
					where:{"id":req.params.id}
				}
			);
			await subscribeUser(req.body.status,req.body.userId);
			const transactionUpt = await transaction.findOne(
            {
				include: {
				  model: user,
				  as:"user",
				  attributes: {
					exclude: ["password","createdAt", "updatedAt"],
				  },
				},
                attributes: {
                  exclude: ["artistId","createdAt","updatedAt"],
                },
                where:{"id":req.params.id}
            });
            res.send({
				status:"200",
				message:"Success",
				type:"Transaction",
                data: transactionUpt,
            });
        }
    } catch (error) {
        res.send({ 
		status:500,
		message:"Internal Server Error"
		});
		console.log(error + req.params.id)
    }
}