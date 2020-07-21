const { user } = require("../models");

exports.read = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: {
        exclude: ["password","createdAt","updatedAt"],
      }
    });
    res.send({ status:200, message:"success", data: users });
  } catch (error) {
    console.log(error);
  }
};


exports.detail = async (req, res) => {
  try {
    const Users = await user.findOne({
      attributes:{
        exclude:["password","createdAt","updatedAt"],
      },
      where: {
        "id":req.user.id,
      }
    });

    res.send({ data: Users });
  } catch (error) {
    console.log(error);
  }
};


exports.delete = async(req, res) => {
  try {

    const {id} = req.params;
    const Users = await user.destroy({
        where: {
          id,
        }
      });

    res.status(200).send({data:{id}});
  }catch(error){

  }
}