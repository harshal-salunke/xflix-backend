const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  videoLink: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    enum: ["Education", "Sports", "Comedy", "Lifestyle", "Movies"],
    required: true
  },
  contentRating: {
    type: String,
    enum: ["Anyone", "7+", "12+", "16+", "18+"],
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  previewImage: {
    type: String,
    required: true
  },

  votes: {
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 }
  },
  viewCount: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {

      // 🔁 Rename _id → id
      ret.id = ret._id;
      delete ret._id;

      // ❌ Remove unwanted fields
      delete ret.__v;
    //   delete ret.createdAt;
    //   delete ret.updatedAt;

      // 📅 Format releaseDate → "12 Jan 2021"
      const options = { day: "2-digit", month: "short", year: "numeric" };
      ret.releaseDate = new Date(ret.releaseDate)
        .toLocaleDateString("en-GB", options);

      // 🔢 Convert numbers → strings
      ret.votes = {
        upVotes: ret.votes.upVotes.toString(),
        downVotes: ret.votes.downVotes.toString()
      };
      ret.viewCount = ret.viewCount.toString();

      return ret;
    }
  }
});

module.exports = mongoose.model("Video", videoSchema);
