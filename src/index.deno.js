import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";

const env = await load();
const url = env["TARGET_URL"];
const email = env["GOOGLE_EMAIL"];
const password = env["GOOGLE_PASSWORD"];
const studentId = env["STUDENT_ID"];
const name = env["NAME"];
const contactName = env["CONTACT_NAME"];
const contactRelation = env["CONTACT_RELATION"];
const contactPhone = env["CONTACT_PHONE"];
let studyPlace = env["STUDY_PLACE"];
let studyReason = env["STUDY_REASON"];
let faculty = env["FACULTY"] ?? 0;
let grade = env["GRADE"] ?? 0;

const args = parse(Deno.args)
console.log(args)
if (args.reason) {
  studyReason = args.reason
}
if (args.place) {
  studyPlace = args.place
}
if (args.faculty) {
  faculty = args.faculty
}
if (args.grade) {
  grade = args.grade
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(url);

// =============== Googleログイン ===============

await page.type('input[type="email"]', email);

let element = await page.$x(`//*[contains(text(), 'Next')]`)
let nextButton = element[0];

await Promise.all([
    page.waitForNavigation({ waitUntil: 'load'}),
    nextButton.click(),
]);


// =============== keio.jpログイン ===============

await page.waitForSelector('input[type="text"]')
await page.type('input[type="text"]', email);
await page.type('input[type="password"]', password);

await Promise.all([
    page.waitForNavigation({ waitUntil: 'load'}),
    page.click('button[type="submit"]'),
]);

await page.waitForSelector('div[role="option"]')
await page.waitForTimeout(1000)

console.log('ログイン完了')

// =============== 学生情報 ===============

let checks = await page.$$(".uVccjd")
await checks[0].click()

// select項目
let items = await page.$$(".ry3kXd")
await items[0].click()

await page.waitForTimeout(1000)

let wrappers = await page.$$(".OA0qNb")
const facultyOptions = await wrappers[0].$$(".MocG8c")

// 環境情報学部
// 1:総合 2:環境 3:政策 4:その他
await facultyOptions[faculty].click()
await page.waitForTimeout(1000)

await items[1].click()
await page.waitForTimeout(1000)

wrappers = await page.$$(".OA0qNb")
const gradeOptions = await wrappers[1].$$(".MocG8c")

// 学部3年生
// 1:1年生 2:2年生 3:3年生 4:4年生 5:修士1年生 6:修士2年生 7:博士1年生 8:博士2年生 9:博士3年生
await gradeOptions[grade].click()
await page.waitForTimeout(1000)


let inputItems = await page.$$(".whsOnd")

await inputItems[0].type(studentId)
await page.waitForTimeout(1000)
await inputItems[1].type(name)
await page.waitForTimeout(1000)
await inputItems[2].type(email)
await page.waitForTimeout(1000)

let buttons = await page.$$(".NPEfkd")
nextButton = buttons[0];

await nextButton.click()
await page.waitForTimeout(1000)

console.info('学生情報入力完了')

// =============== 緊急連絡先 ===============

await page.waitForSelector(".whsOnd")

inputItems = await page.$$(".whsOnd")
await page.waitForTimeout(1000)
await inputItems[0].type(contactName)
await page.waitForTimeout(1000)
await inputItems[1].type(contactRelation)
await page.waitForTimeout(1000)
await inputItems[2].type(contactPhone)
await page.waitForTimeout(1000)

buttons = await page.$$(".NPEfkd")
await buttons[1].click()
await page.waitForTimeout(1000)

console.info('緊急連絡先入力完了')

// =============== 授業情報 ===============

await page.waitForSelector(".whsOnd")

inputItems = await page.$$(".whsOnd")
await page.waitForTimeout(1000)
await inputItems[0].type('藤井研 x-music')
await page.waitForTimeout(500);

buttons = await page.$$(".NPEfkd")
await buttons[1].click()
await page.waitForTimeout(500);

console.info('授業情報入力完了')

// =============== 教員情報 ===============

await page.waitForSelector(".ry3kXd")

items = await page.$$(".ry3kXd")
await page.waitForTimeout(1000)
await items[0].click()
await page.waitForTimeout(1000)

wrappers = await page.$$(".OA0qNb")
await page.waitForTimeout(1000)
const facultyNameOptions = await wrappers[0].$$(".MocG8c")
await page.waitForTimeout(1000)

// 藤井先生
await facultyNameOptions[95].click()
await page.waitForTimeout(500);

buttons = await page.$$(".NPEfkd")
await page.waitForTimeout(1000)
await buttons[1].click()
await page.waitForTimeout(1000)

console.info('教員情報入力完了')

// =============== 残留詳細 ===============

await page.waitForSelector(".whsOnd")

inputItems = await page.$$(".whsOnd")
await page.waitForTimeout(1000)
await inputItems[0].type(studyPlace)
await page.waitForTimeout(500);
await inputItems[1].type(studyReason)
await page.waitForTimeout(500);

checks = await page.$$(".uHMk6b")
await checks[0].click()
await page.waitForTimeout(1000)
await checks[1].click()
await page.waitForTimeout(500);

buttons = await page.$$(".NPEfkd")
await page.waitForTimeout(1000)
await buttons[1].click()
await page.waitForTimeout(500);

await page.waitForSelector(".vHW8K")

console.info('送信完了')
await page.screenshot({path: "./screenshots/result.png", fullPage: true});

await browser.close();
