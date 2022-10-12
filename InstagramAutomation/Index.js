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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var instagram_web_api_1 = __importDefault(require("./instagram-web-api"));
var tough_cookie_filestore2_1 = __importDefault(require("tough-cookie-filestore2"));
var node_cron_1 = __importDefault(require("node-cron"));
var fs_1 = __importDefault(require("fs"));
var dotenv_1 = __importDefault(require("dotenv"));
var https_1 = __importDefault(require("https"));
dotenv_1.default.config();
function downloadImage(url, filepath) {
    return new Promise(function (resolve, reject) {
        https_1.default.get(url, function (res) {
            if (res.statusCode === 200) {
                res
                    .pipe(fs_1.default.createWriteStream(filepath))
                    .on("error", reject)
                    .once("close", function () { return resolve(filepath); });
            }
            else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error("Request Failed With a Status Code: ".concat(res.statusCode)));
            }
        });
    });
}
console.log("working ...");
// Upload new Pixel Mike post to Instagram every day at 12:00 PM
node_cron_1.default.schedule("* * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var cookieStore, client, instagramPostFunction, loginFunction;
    return __generator(this, function (_a) {
        cookieStore = new tough_cookie_filestore2_1.default("./cookies.json");
        client = new instagram_web_api_1.default({
            username: process.env.INSTAGRAM_USERNAME,
            password: process.env.INSTAGRAM_PASSWORD,
            cookieStore: cookieStore,
        }, {
            language: "en-US",
        });
        instagramPostFunction = function (currentClient) { return __awaiter(void 0, void 0, void 0, function () {
            var triesCounter, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        triesCounter = 0;
                        _a.label = 1;
                    case 1:
                        if (!(triesCounter < 3)) return [3 /*break*/, 9];
                        console.log("Try #".concat(triesCounter));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        if (!currentClient) return [3 /*break*/, 5];
                        return [4 /*yield*/, downloadImage("https://www.wwe.com//f/styles/wwe_16_9_s/public/all/2022/09/20220928_HHavoc_Match_TripleThreat_FC_Date--7f4b6cdc06f1095e41ba0119c62d5523.jpg", "./InstagramAutomation/it.png")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, currentClient
                                .uploadPhoto({
                                photo: "./InstagramAutomation/it.png",
                                caption: "Bron Breakker set to defend NXT Title against heated rivals Ilja Dragunov and JD McDonagh in Triple Threat Match",
                                post: "feed",
                            })
                                .then(function (res) { return __awaiter(void 0, void 0, void 0, function () {
                                var media;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            media = res.media;
                                            console.log("https://www.instagram.com/p/".concat(media.code, "/"));
                                            return [4 /*yield*/, currentClient.addComment({
                                                    mediaId: media.id,
                                                    text: "#wwe #aew #impact #news",
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        console.log("Instagram client does not exist!");
                        return [2 /*return*/];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 8];
                    case 8:
                        triesCounter++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        loginFunction = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Logging in...");
                        return [4 /*yield*/, client
                                .login()
                                .then(function () {
                                console.log("Login successful!");
                                instagramPostFunction(client);
                            })
                                .catch(function (err) { return __awaiter(void 0, void 0, void 0, function () {
                                var newCookieStore, newClient, delayedLoginFunction;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log("Login failed!");
                                            console.log(err);
                                            console.log("Deleting cookies, waiting 2 minutes, then logging in again and setting new cookie store");
                                            fs_1.default.unlinkSync("./cookies.json");
                                            newCookieStore = new tough_cookie_filestore2_1.default("./cookies.json");
                                            newClient = new instagram_web_api_1.default({
                                                username: process.env.INSTAGRAM_USERNAME,
                                                password: process.env.INSTAGRAM_PASSWORD,
                                                cookieStore: newCookieStore,
                                            }, {
                                                language: "en-US",
                                            });
                                            delayedLoginFunction = function (timeout) { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    console.log("Logging in again.");
                                                                    return [4 /*yield*/, newClient
                                                                            .login()
                                                                            .then(function () {
                                                                            console.log("Login successful on the second try!");
                                                                            instagramPostFunction(newClient);
                                                                        })
                                                                            .catch(function (err) {
                                                                            console.log("Login failed again!");
                                                                            console.log(err);
                                                                        })];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); }, timeout);
                                                    return [2 /*return*/];
                                                });
                                            }); };
                                            // Wait 2 minutes before trying to log in again
                                            return [4 /*yield*/, delayedLoginFunction(120000)];
                                        case 1:
                                            // Wait 2 minutes before trying to log in again
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        loginFunction();
        return [2 /*return*/];
    });
}); });
