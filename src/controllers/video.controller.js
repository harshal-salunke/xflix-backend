const mongoose = require("mongoose");
const Video = require("../models/Video");

exports.getAllVideos = async (req, res) => {
  try {
    const { title, genres, contentRating, sortBy } = req.query;

    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (genres) {
      const genreList = genres.split(",");
      if (!genreList.includes("All")) {
        filter.genre = { $in: genreList };
      }
    }

    if (contentRating) {
    const ratings = ["Anyone", "7+", "12+", "16+", "18+"];
    const index = ratings.indexOf(contentRating);

    if (index !== -1) {
        filter.contentRating = {
        $in: ratings.slice(0, index + 1)
        };
    }
    }

    let sortOptions = { releaseDate: -1 };

    if (sortBy === "viewCount") {
      sortOptions = { viewCount: -1 };
    }

    const videos = await Video.find(filter).sort(sortOptions);

    return res.status(200).json({ videos });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const {
      videoLink,
      title,
      genre,
      contentRating,
      releaseDate,
      previewImage,
    } = req.body;

    if (
      !videoLink ||
      !title ||
      !genre ||
      !contentRating ||
      !releaseDate ||
      !previewImage
    ) {
      return res.status(400).json({
        code: 400,
        message: "All fields are required",
      });
    }

    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        code: 409,
        message: "Video already exists",
      });
    }

    res.status(400).json({
      code: 400,
      message: error.message,
    });
  }
};

exports.updateVotes = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { vote, change } = req.body;

        if(!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ 
                code: 400,
                message: "\"videoId\" must be valid id" });
        }

        if(!vote) {
            return res.status(400).json({ 
                code: 400,
                message: "\"vote\" is required" });
        }

        if(!change) {
            return res.status(400).json({ 
                code: 400,
                message: "\"change\" is required" });
        }

        if(!["upVote", "downVote"].includes(vote)) {
            return res.status(400).json({ 
                code: 400,
                message: "\"vote\" must be one of [upVote, downVote]" });
        }

        if(!["increase", "decrease"].includes(change)) {
            return res.status(400).json({ 
                code: 400,
                message: "\"change\" must be one of [increase, decrease]" });
        }

        const updateField =
            vote === "upVote"
                ? "votes.upVotes"
                : "votes.downVotes";

        const incrementValue = change === "increase" ? 1 : -1;

        await Video.findByIdAndUpdate(videoId, { $inc: { [updateField]: incrementValue } });

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ 
            code: 400,
            message: error.message 
        });
    }
};


exports.updateViews = async (req, res) => {
    try {
        const { videoId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ 
                code: 400,
                message: "\"videoId\" must be valid id" });
        }

        await Video.updateOne(
            { _id: videoId },
            { $inc: { viewCount: 1 } }
            );

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ 
            code: 400,
            message: error.message 
        });
    }
}