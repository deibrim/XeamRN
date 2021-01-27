exports.addStory = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "story added",
    },
  });
};
exports.deleteStory = async (req, res) => {
  res.status(401).json({
    status: "success",
    data: null,
  });
};
