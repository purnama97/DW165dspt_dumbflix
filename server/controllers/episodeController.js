const { film, category, episode } = require("../models");
const Joi = require("@hapi/joi");

module.exports =
{
    //membaca 
    read:async(req,res) => {
        try
        {
            const Episode = await episode.findAll({
                include: {
                    model: film,
                    include: {
                      model: category,
                      as: "category",
                      attributes: {
                        exclude: ["createdAt", "updatedAt"],
                      },
                    },
                    attributes: {
                        exclude: ["role","createdAt","updatedAt"],
                      },
                  },
                  attributes: {
                    exclude: ["userId","createdAt","updatedAt"],
                  },
            });
            res.send(200,{data:Episode})
        }catch(err)
        {
            return res.send(500,{"error":"Internal Server Error"})
        }
    },

    //Menambah data transaski
    create:async(req,res) => {
        try
        {
          const schema = Joi.object({
            titleEpi: Joi.string().min(8).max(50).required(),
            thumbnailEpi: Joi.string().min(8).max(150).required(),
            linkFilm: Joi.string().min(8).max(150).required(),
            filmId: Joi.number().required(),
          });
          
          const { error } = schema.validate(req.body);
          if(error) res.send(400,{"error":error.details[0].message})
          
          const Films= await film.findOne({where:{"id":req.body.filmId}})
          if(!Films) return res.send(400,{"message":"Film not found"})
          const epiNew = await episode.create(req.body)
          const created = await episode.findOne(
             {
                include: {
                  model: film,
                  attributes: {
                      exclude: ["role","createdAt","updatedAt"],
                    },
                },
                attributes: {
                  exclude: ["filmId","createdAt","updatedAt"],
                },
                where:{"id":epiNew.id}
            });
          res.send(200,{data:created})
        }catch(error){
            res.send(500,{"error":"Internal Server Error"})
        }
    },

    //Mengubah data transaski
    update:async(req,res) => {
      try{
        const schema = Joi.object({
          title: Joi.string().min(8).max(25).required(),
          thumbnailFilm: Joi.string().min(8).max(150).required(),
          linkFilm: Joi.string().min(8).max(150).required(),
          filmId: Joi.string().min(1).max(15).required(),
        });
          
          const { error } = schema.validate(req.body);
          if(error) res.send(400,{"error":error.details[0].message})
          
          const {id} = req.params

          const Films= await film.findOne({where:{"id":req.body.filmId}})
          if(!Films) return res.send(400,{"message":"Film not found"})
          const epiUpt = await episode.update(
              req.body,
              {where:
                {id}
              });

          const updated = await episode.findOne({
                include: {
                    model: film,
                    attributes: {
                        exclude: ["role","createdAt","updatedAt"],
                      },
                  },
                attributes: {
                    exclude: ["filmId","createdAt","updatedAt"],
                  },
                where:{id}
            });

            res.send(200,{data:updated})
        }catch(error){
              res.send(500,{"error":"Internal Server Error"})
        }
    },

    //Membaca data film dengan kriteria
  detail:async (req,res) => {
    try {
      const filId = req.params.filId;
      const Films= await film.findOne({where:{"id":filId}})
      if(!Films) return res.send(400,{"message":"Film not found"})
     
      
      const epiId = req.params.epiId;
      const Episodes= await episode.findOne({where:{"id":epiId}})
      if(!Episodes) return res.send(400,{"message":"Episode not found"})
     
      const epiDetail = await episode.findOne({
          include: {
            model: film,
            attributes: {
                exclude: ["role","createdAt","updatedAt"],
              },
            where:{"id":filId}
          },
          attributes: {
            exclude: ["filmId","createdAt","updatedAt"],
          },
          where:{"id":epiId}
        });
        res.send(200,{data: epiDetail})
    } catch (error){
      res.send(500,{"error":"Internal Server Error"});
    }
  },

    //Menghapus data transaction
    delete :async(req, res) => {
      try {
    
          const {id} = req.params;
          const Episodes = await episode.destroy({
              where: {id}
            }) 
            res.send(200,{data:{id}})
        }catch(error){
          res.send(500,{"error":"Internal Server Error"});
        }
    }

}