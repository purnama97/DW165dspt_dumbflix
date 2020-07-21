const express = require("express");
const router = express.Router();
const {auth,privilege} = require("../middleware/auth");
const {upload} = require("../middleware/upload");

const {
  read: findUsers,
  //delete: deleteUsers,
  detail:detailUsers
  } = require("../controllers/userController")


const {
  login,
  register
} = require("../controllers/authController");

const {
  create: createFilm,
  read : findFilms,
  update : updateFilms,
  detail : detailFilm,
  //delete: deleteFilm,
  kategori: catFilms
} = require("../controllers/filmController");

const {
  create:createCategory,
  read:findCategories,
  update:updateCategory,
  //delete:deleteCategory
} = require("../controllers/categoryController")

const {
  create:createTransaction,
  read:findTransactions,
  update:updateTransaction,
  //delete:deleteTransaction
} = require("../controllers/transactionController")

const {
  read:findEpisodes,
  create:createEpisode,
  update:updateEpisode,
  //delete:deleteEpisode,
  detail:detailEpisode
} = require("../controllers/episodeController")

//users
router.get("/users",auth, privilege, findUsers)
router.get("/profil/",auth, detailUsers)
//router.delete("/user/:id",auth, privilege,deleteUsers)

//Film
router.post("/film", auth, privilege,createFilm)
router.get("/films", findFilms)
router.patch("/film/:id",auth, privilege,updateFilms)
router.get("/film/:id", detailFilm)
//router.delete("/film/:id",auth, privilege, deleteFilm)
router.get("/film/category/:id", catFilms)

//Category
router.post("/category",auth, privilege,createCategory)
router.get("/category",findCategories)
router.patch("/category/:id",auth, privilege,updateCategory)
//router.delete("/category/:id",auth, privilege,deleteCategory)

//trasactions
router.get("/transactions",auth, findTransactions)
router.post("/transaction", upload, auth, createTransaction)
router.patch("/transaction/:id",auth, privilege,updateTransaction)
//router.delete("/transaction/:id",auth, privilege,deleteTransaction)

//Episode
router.get("/episodes", findEpisodes)
router.post("/episode",auth, privilege,createEpisode)
router.patch("/episode/:id",auth, privilege,updateEpisode)
//router.delete("/episode/:id",auth, privilege,deleteEpisode)
router.get("/film/:filId/episode/:epiId", privilege,detailEpisode)

//Authentication
router.post("/login", login)
router.post("/register", register)

      
module.exports = router;
