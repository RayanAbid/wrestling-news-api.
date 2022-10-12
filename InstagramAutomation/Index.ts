// @ts-ignore
import Instagram from "./instagram-web-api";
import FileCookieStore from "tough-cookie-filestore2";
import cron from "node-cron";
import fs from "fs";
import dotenv from "dotenv";
import client from "https";

dotenv.config();

function downloadImage(url: string, filepath: string) {
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
}

console.log("working ...");

// Upload new Pixel Mike post to Instagram every day at 12:00 PM
cron.schedule("* * * * *", async () => {
  // Persist cookies after Instagram client log in
  const cookieStore = new FileCookieStore("./cookies.json");

  const client = new Instagram(
    {
      username: process.env.INSTAGRAM_USERNAME,
      password: process.env.INSTAGRAM_PASSWORD,
      cookieStore,
    },
    {
      language: "en-US",
    }
  );

  const instagramPostFunction = async (currentClient: typeof client) => {
    let triesCounter = 0;

    while (triesCounter < 3) {
      console.log(`Try #${triesCounter}`);
      try {
        if (currentClient) {
          await downloadImage(
            "https://www.wwe.com//f/styles/wwe_16_9_s/public/all/2022/09/20220928_HHavoc_Match_TripleThreat_FC_Date--7f4b6cdc06f1095e41ba0119c62d5523.jpg",
            "./InstagramAutomation/it.png"
          );

          return await currentClient
            .uploadPhoto({
              photo: "./InstagramAutomation/it.png",
              caption:
                "Bron Breakker set to defend NXT Title against heated rivals Ilja Dragunov and JD McDonagh in Triple Threat Match",
              post: "feed",
            })
            .then(async (res: { [key: string]: { [key: string]: string } }) => {
              const media = res.media;

              console.log(`https://www.instagram.com/p/${media.code}/`);

              await currentClient.addComment({
                mediaId: media.id,
                text: "#wwe #aew #impact #news",
              });
            });
        } else {
          console.log("Instagram client does not exist!");
          return;
        }

        break;
      } catch (err) {
        console.log(err);
      }
      triesCounter++;
    }
  };

  const loginFunction = async () => {
    console.log("Logging in...");

    await client
      .login()
      .then(() => {
        console.log("Login successful!");
        instagramPostFunction(client);
      })
      .catch(async (err: Error) => {
        console.log("Login failed!");
        console.log(err);

        console.log(
          "Deleting cookies, waiting 2 minutes, then logging in again and setting new cookie store"
        );
        fs.unlinkSync("./cookies.json");
        const newCookieStore = new FileCookieStore("./cookies.json");

        const newClient = new Instagram(
          {
            username: process.env.INSTAGRAM_USERNAME,
            password: process.env.INSTAGRAM_PASSWORD,
            cookieStore: newCookieStore,
          },
          {
            language: "en-US",
          }
        );

        const delayedLoginFunction = async (timeout: number) => {
          setTimeout(async () => {
            console.log("Logging in again.");
            await newClient
              .login()
              .then(() => {
                console.log("Login successful on the second try!");
                instagramPostFunction(newClient);
              })
              .catch((err: Error) => {
                console.log("Login failed again!");
                console.log(err);
              });
          }, timeout);
        };

        // Wait 2 minutes before trying to log in again
        await delayedLoginFunction(120000);
      });
  };

  loginFunction();
});
