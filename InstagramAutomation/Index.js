"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const instagram_web_api_1 = __importDefault(require("./instagram-web-api"));
const tough_cookie_filestore2_1 = __importDefault(require("tough-cookie-filestore2"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const https_1 = __importDefault(require("https"));
dotenv_1.default.config();
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https_1.default.get(url, (res) => {
            if (res.statusCode === 200) {
                res
                    .pipe(fs_1.default.createWriteStream(filepath))
                    .on("error", reject)
                    .once("close", () => resolve(filepath));
            }
            else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}
console.log("working ...");
// Upload new Pixel Mike post to Instagram every day at 12:00 PM
// cron.schedule("* * * * *",
const postToInstagram = (postData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("postData?.image", postData);
    // Persist cookies after Instagram client log in
    const cookieStore = new tough_cookie_filestore2_1.default("./cookies.json");
    const client = new instagram_web_api_1.default({
        username: process.env.INSTAGRAM_USERNAME,
        password: process.env.INSTAGRAM_PASSWORD,
        cookieStore,
    }, {
        language: "en-US",
    });
    const instagramPostFunction = (currentClient) => __awaiter(void 0, void 0, void 0, function* () {
        let triesCounter = 0;
        while (triesCounter < 3) {
            console.log(`Try #${triesCounter}`);
            try {
                if (currentClient) {
                    yield downloadImage(postData === null || postData === void 0 ? void 0 : postData.image, "./InstagramAutomation/it.png");
                    return yield currentClient
                        .uploadPhoto({
                        photo: "./InstagramAutomation/it.png",
                        caption: (postData === null || postData === void 0 ? void 0 : postData.title) + " " + (postData === null || postData === void 0 ? void 0 : postData.postLink),
                        post: "feed",
                    })
                        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                        const media = res.media;
                        console.log(`https://www.instagram.com/p/${media.code}/`);
                        yield currentClient.addComment({
                            mediaId: media.id,
                            text: `Source:${postData === null || postData === void 0 ? void 0 : postData.source} ${postData === null || postData === void 0 ? void 0 : postData.description} #wwe #aew #impact #news #wrestlebreak #wrestlingnews #wwe #wweraw #wwenetwork #wwememes #wweuniverse #WWE2k18 #wwenxt #wwesmackdown #wwelive #wwedivas  #WWEFans`,
                        });
                    }));
                }
                else {
                    console.log("Instagram client does not exist!");
                    return;
                }
                break;
            }
            catch (err) {
                console.log(err);
            }
            triesCounter++;
        }
    });
    const loginFunction = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Logging in...");
        yield client
            .login()
            .then(() => {
            console.log("Login successful!");
            instagramPostFunction(client);
        })
            .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Login failed!");
            console.log(err);
            console.log("Deleting cookies, waiting 2 minutes, then logging in again and setting new cookie store");
            fs_1.default.unlinkSync("./cookies.json");
            const newCookieStore = new tough_cookie_filestore2_1.default("./cookies.json");
            const newClient = new instagram_web_api_1.default({
                username: process.env.INSTAGRAM_USERNAME,
                password: process.env.INSTAGRAM_PASSWORD,
                cookieStore: newCookieStore,
            }, {
                language: "en-US",
            });
            const delayedLoginFunction = (timeout) => __awaiter(void 0, void 0, void 0, function* () {
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("Logging in again.");
                    yield newClient
                        .login()
                        .then(() => {
                        console.log("Login successful on the second try!");
                        instagramPostFunction(newClient);
                    })
                        .catch((err) => {
                        console.log("Login failed again!");
                        console.log(err);
                    });
                }), timeout);
            });
            // Wait 2 minutes before trying to log in again
            yield delayedLoginFunction(120000);
        }));
    });
    loginFunction();
});
// );
module.exports = {
    postToInstagram,
};
