const { category, episode, film } = require("../models");
const Joi = require("@hapi/joi");

module.exports =
{
//Membaca Data Film
  read:async (req, res) => {
    try {
      const Films = await film.findAll(
        {   
            include: {
              model: category,
              as: "category",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            attributes: {
              exclude: ["categoryId", "createdAt", "updatedAt"],
            },
        }
      );
      res.send({
		  messege:"200",
		  status:"success",
		  data: Films 
		});
    } catch (error) {
      res.send(500,{"error":"Internal Server Error"});
    }
  },

  detail:async (req,res) => {
    try {
      const {id} = req.params;
      const Films = await film.findOne({
       include: [
        {
          model: episode,
          as: "episodes",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
        attributes: {
          exclude: ["filmId","categoryId", "createdAt", "updatedAt"],
        },
          where: {
            id,
          }
        });
		res.send({
			messege:"200",
			status:"success",
			data: Films 
		})
    } catch (error){
      res.send(500,{"error":"Internal Server Error"});
    }
  },
//Menambah data film

  create:async(req,res) => {
    try
    {
      const schema = Joi.object({
        title: Joi.string().min(3).max(30).required(),
        thumbnailFilm: Joi.string().min(3).max(150).required(),
        year: Joi.string().min(4).max(4).required(),
        categoryId: Joi.string().min(1).max(2).required(),
        description: Joi.string().min(20).max(225).required(),
      });
      
      const { error } = schema.validate(req.body);
      if(error) res.send(400,{"error":error.details[0].message})
      
      const Category= await category.findOne({where:{"id":req.body.categoryId}})
      if(!Category) return res.send(400,{"message":"Category not found"})
        const filmnew = await film.create(req.body)
        const created = await film.findOne({
          include: {
            model: category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          attributes: {
            exclude: ["categoryId", "createdAt", "updatedAt"],
          },
          where:{
            "id":filmnew.id
          }
          });
          res.send(200,{data:created})
      }catch(error){
          res.send(500,{"error":"Internal Server Error"})
      }
    },

//mengedit data film
update:async(req, res) => {
  try
  {

    const schema = Joi.object({
      title: Joi.string().min(3).max(30).required(),
      thumbnailFilm: Joi.string().min(10).max(150).required(),
      year: Joi.string().min(4).max(4).required(),
      categoryId: Joi.string().min(1).max(2).required(),
      description: Joi.string().min(20).max(225).required(),
    });
  
      const { error } = schema.validate(req.body);
      const {id}=req.params

      if(error) res.send(400,{"error":error.details[0].message})
      const Category= await category.findOne({where:{"id":req.body.categoryId}})
      if(!Category) return res.send(400,{"message":"Category not found"})
      const filmupt = await film.update(
        req.body,
        {where:{id}
        })
      if(filmupt <= 0) res.send(400,{"message":"Update Not Success"})
      const updated = await film.findOne({
        include: {
          model: category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["categoryId", "createdAt", "updatedAt"],
        },
        where:
          {id}
        });
      res.send(200,{data:updated})
    }catch(error){
      res.send(500,{"error":"Internal Server Error"})
    }
  },

 //Menampilkan untuk perkategori
 kategori:async (req,res) => {
  try {
    const Films = await film.findAll({
      include: {
        model: category,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["categoryId", "createdAt", "updatedAt"],
      },
        where: {
          "categoryId":req.params.id,
        }
      });
      res.send(200,{data: Films})
  } catch (error){
    res.send(500,{"error":"Internal Server Error"});
  }
},

//Menghapus data Film
  delete :async(req, res) => {
  try {

      const {id} = req.params;
      const Films = await film.destroy({
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