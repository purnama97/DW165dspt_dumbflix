const { category } = require("../models");
const Joi = require("@hapi/joi");

module.exports =
{
//Membaca Data Kategori
  read:async (req, res) => {
    try {
      const Category = await category.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
      });
      res.send(200,{data: Category });
    } catch (error) {
      res.send(500,{"error":"Internal Server Error"});
    }
  },

//Menambah data kategori

  create:async(req,res) => {
    try
    {
      const schema = Joi.object({
        name: Joi.string().min(3).max(15).required()
      });
      
      const { error } = schema.validate(req.body);
      if(error) res.send(400,{"error":error.details[0].message})
      const catNew = await category.create(req.body)
      const created = await category.findOne(
         {
            attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            where:{"id":catNew.id}
          }
          );
      res.send(200,{data:created})
      }catch(error){
          res.send(500,{"error":"Internal Server Error"})
      }
    },

//mengedit data kategori
  update:async(req, res) => {
  try
  {
    const schema = Joi.object({
        name: Joi.string().min(3).max(15).required()
    });
  
      const { error } = schema.validate(req.body);
      if(error) res.send(400,{"error":error.details[0].message})
      
      const {id}=req.params
      const catUpt = await category.update(
        req.body,
        {where:{id}
        })

      if(catUpt <= 0) res.send(400,{"message":"Update Not Success"})
      const updated = await category.findOne({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          where:{
              id
            }
        });
        
      res.send(200,{data:updated})
    }catch(error){
      res.send(500,{"error":"Internal Server Error"})
    }
  },

//Menghapus data Kategori
  delete :async(req, res) => {
  try {

      const {id} = req.params;
      const Category = await category.destroy({
          where: {
            id,
          }
        }) 
        res.send(200,{data:{id}})
    }catch(error){
      res.send(500,{"error":"Internal Server Error"});
    }
  }
}