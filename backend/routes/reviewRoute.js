let express = require("express");
let reviewRouter = express.Router({ mergeParams: true });
const ReviewController = require("../controllers/reviewController");
const isAuthenticated = require("../middlewere/isAuthenticated");
const isAdmin = require("../middlewere/isAdmin");

reviewRouter.post("/",isAuthenticated, ReviewController.createReview);
reviewRouter.get("/", ReviewController.getAllReviews);
reviewRouter.get("/:reviewId", ReviewController.getReview);
reviewRouter.patch("/:reviewId",isAuthenticated, ReviewController.updateReview);
reviewRouter.delete("/:reviewId",isAuthenticated, ReviewController.deleteReview);



module.exports = reviewRouter;