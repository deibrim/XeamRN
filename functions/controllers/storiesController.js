const admin = require("firebase-admin");
const schedule = require("node-schedule");
exports.create = async (req, res) => {
  const { storyId, userId, endTime, accountType } = req.body;

  schedule.scheduleJob(endTime, async () => {
    const storyRef = admin
      .firestore()
      .collection(
        accountType === "personal"
          ? "userStories"
          : accountType === "tv"
          ? "tvStories"
          : "storeStories"
      )
      .doc(userId);
    const snapshot = await storyRef.get();
    const action = {
      type: "DELETE",
      payload: storyId,
      userId,
    };
    if (snapshot.exists) {
      const stories = snapshot.data().stories;
      if (stories.length) {
        const filterOut = stories.filter((item, index) => item.id !== storyId);
        const postData = {
          stories: filterOut,
          updatedAt: snapshot.data().updatedAt,
          action,
        };
        storyRef.update(postData);
      }
    }
  });
  res.status(200).json({
    status: "success",
    data: {
      message: "Story added",
    },
  });
};
exports.test = async (req, res) => {
  const { storyId, userId, endTime } = req.body;

  schedule.scheduleJob(endTime, () => {
    console.log(`${storyId} has been deleted`);
  });
  res.status(200).json({
    status: "success",
    data: {
      message: "Story added",
    },
  });
};
