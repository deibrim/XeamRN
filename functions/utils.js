const fetch = require("node-fetch");

exports.set24HoursTimer = async (storyId, userId, accountType) => {
  const timestamp = Date.now();
  // const endTime = new Date(timestamp + 60 * 60 * 24 * 1000)
  const endTime = new Date(timestamp + 60 * 60 * 24 * 1000);
  try {
    const url =
      "https://us-central1-chattie-3eb7b.cloudfunctions.net/api/v1/stories/create";
    // const url = "http://192.168.43.199:5000/stories";
    const postRes = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storyId,
        userId,
        timestamp,
        endTime,
        accountType,
      }),
    });
    const res = await postRes.json();
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
