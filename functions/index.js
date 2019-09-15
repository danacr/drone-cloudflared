const functions = require("firebase-functions");

const axios = require("axios");
const replace = require("replace-in-file");
const fs = require("fs");

// accessToken = functions.config().git.key;
accessToken = process.argv.slice(2);

dan = "danacr/drone-cloudflared/tags";
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

async function getLatest(url) {
  try {
    result = await axios(github + url);
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
  if ((await getLatest(dan)) != (await getLatest(cloudflare))) {
    console.log("different");
    return true;
  } else {
    console.log(
      "Version sync OK, time: ",
      new Date().getTime(),
      " version: ",
      await getLatest(dan)
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

exports.compare = functions.pubsub
  .schedule("every day 00:00")
  .onRun(async context => {
    if (await compare()) {
      version = await getLatest(cloudflare);
      await replaceReadMe(version);
      console.log("time to update");
      await updateReadMe(readme, version);
    } else {
      console.log("nevermind...");
    }
  });

// async function main() {
//   if (await compare()) {
//     version = await getLatest(cloudflare);
//     await replaceReadMe(version);
//     console.log("time to update");
//     await updateReadMe(readme, version);
//   } else {
//     console.log("nevermind...");
//   }
// }
// main();

// async function deleteref() {
//   console.log("deleting reference");
//   try {
//     await axios.delete(
//       "https://api.github.com/repos/danacr/drone-cloudflared/git/refs/tags/2019.9.0",
//       config
//     );
//   } catch (error) {
//     console.error(error);
//   }
// }
// deleteref();
