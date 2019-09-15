const axios = require("axios");
const functions = require("firebase-functions");
var result;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
dan = "danacr/drone-cloudflared/tags";
cloudflare = "cloudflare/cloudflared/tags";
github = "https://api.github.com/repos/";
// exports.accountcleanup = functions.pubsub
//   .schedule("every day 00:00")
//   .onRun(async context => {
// Fetch all user details.
async function getLatest(url) {
  result = await axios(github + url);
  return result.data[0].name;
}
// async function compare() {
//     if ((getLatest(dan) =! getLatest(cloudflare))
//     console.log("need to push")
// }
// compare()
const compare = async () => {
  if ((await getLatest(dan)) != (await getLatest(cloudflare)))
    console.log("different");
  else {
    console.log("same");
  }
};

compare();
// Use a pool so that we delete maximum `MAX_CONCURRENT` users in parallel.
// const promisePool = new PromisePool(
//   () => deleteInactiveUser(inactiveUsers),
//   MAX_CONCURRENT
// );
// await promisePool.start();
// console.log("User cleanup finished");
//   });
