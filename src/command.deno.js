#!/usr/bin/env -S deno run -A

import $ from "https://deno.land/x/dax@0.39.2/mod.ts";

const description = `
残留届を簡単に出してくれるCLIツールです

名前などの情報を入力してください
`;

console.log("============zanryu fucker=============");
console.log(description);
console.log("======================================");
console.log("")




const faculty = await $.select({
  message: "学部を入力してください:",
  options: [
    'デフォルト値',
    '総合政策学部',
    '環境情報学部',
    '政策・メディア研究科',
    'その他',
  ]
});
const facultyMap = {
  0: 'default',
  1: '総合政策学部',
  2: '環境情報学部',
  3: '政策・メディア研究科',
  4: 'その他',
}
console.log(`学部  : ${facultyMap[faculty] ?? 'default'}`)

const grade = await $.select({
  message: "残留理由を入力してください:",
  options: [
    'デフォルト値',
    '学部1年生',
    '学部2年生',
    '学部3年生',
    '学部4年生',
    '修士1年生',
    '修士2年生',
    '博士1年生',
    '博士2年生',
    '博士3年生',
  ]
});

const gradeMap = {
  0: 'デフォルト値',
  1: '学部1年生',
  2: '学部2年生',
  3: '学部3年生',
  4: '学部4年生',
  5: '修士1年生',
  6: '修士2年生',
  7: '博士1年生',
  8: '博士2年生',
  9: '博士3年生',
}
console.log(`学部  : ${gradeMap[grade] ?? 'default'}`)

const reason = await $.prompt({
  message: "残留理由を入力してください:",
});
console.log(`残留理由: ${reason}`);

const place = await $.prompt("残留教室を入力してください:");
console.log(`残留教室: ${place}`);

if (reason || place) {
  const result = await $.confirm("上記の内容で登録してよろしいですか？", {
    default: true,
    noClear: true,
  })

  if (!result) {
    console.log("操作がキャンセルされました。やり直してください")
    Deno.exit(0)
  }
}

await $`deno task run --reason=${reason} --place=${place} --faculty=${faculty} --grade=${grade}`
