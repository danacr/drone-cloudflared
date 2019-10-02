const functions = require("firebase-functions");

const axios = require("axios");
const replace = require("replace-in-file");
const fs = require("fs");

// accessToken = functions.config().git.key;
accessToken = process.argv.slice(2);

dan = "danacr/drone-cloudflared/commits";
cloudflare = "cloudflare/cloudflared/tags";
github = "https://api.github.com/repos/";
readme = github + "danacr/drone-cloudflared/contents/README.md";
tagme = github + "danacr/drone-cloudflared/git/tags";
referenceurl = github + "danacr/drone-cloudflared/git/refs/";

var config = {
  headers: { Authorization: "bearer " + accessToken }
};

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  console.log("file encoded successfully");
  return new Buffer.from(bitmap).toString("base64");
}

async function getLatestDan() {
  try {
    result = await axios(github + dan);
    return result.data[0].commit.message;
  } catch (error) {
    console.error(error);
  }
}
async function getLatestCF() {
  try {
    result = await axios(github + cloudflare);
    return result.data[0].name;
  } catch (error) {
    console.error(error);
  }
}

async function getsha(url) {
  try {
    result = await axios(url, config);
    return result.data.sha;
  } catch (error) {
    console.error(error);
  }
}

async function updateReadMe(url, version) {
  console.log("starting encode");
  file = base64_encode("README.md");
  console.log("getting sha");
  sha = await getsha(url);
  console.log("ready to update");
  data = {
    message: version,
    content: file,
    sha: sha
  };
  // console.log(data);

  try {
    await axios.put(url, data, config);
  } catch (error) {
    console.error(error);
  }
}

const compare = async () => {
  if ((await getLatestDan()) != (await getLatestCF())) {
    console.log("different");
    return true;
  } else {
    console.log(
      "Version sync OK, time: ",
      new Date().getTime(),
      " version: ",
      await getLatestDan()
    );
    return false;
  }
};

async function replaceReadMe(version) {
  const options = {
    files: "README.md",
    from: /REPLACE_ME/g,
    to: version
  };
  try {
    const results = await replace(options);
    console.log("Replacement results:", results);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// exports.compare = functions
//   .region("europe-west1")
//   .pubsub.schedule("every 5 minutes")
//   .onRun(async context => {
//     if (await compare()) {
//       version = await getLatest(cloudflare);
//       await replaceReadMe(version);
//       console.log("time to update");
//       await updateReadMe(readme, version);
//     } else {
//       console.log("nevermind...");
//     }
//   });

// old way of running things
async function main() {
  if (await compare()) {
    version = await getLatest(cloudflare);
    await replaceReadMe(version);
    console.log("time to update");
    await updateReadMe(readme, version);
  } else {
    console.log("nevermind...");
  }
}
main();
