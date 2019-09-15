const axios = require("axios");
const functions = require("firebase-functions");

dan = "danacr/drone-cloudflared/tags";
cloudflare = "cloudflare/cloudflared/tags";
github = "https://api.github.com/repos/";

async function getLatest(url) {
  result = await axios(github + url);
  return result.data[0].name;
}

const compare = async () => {
  if ((await getLatest(dan)) != (await getLatest(cloudflare)))
    console.log("different");
  else {
    console.log("same");
  }
};

compare();
