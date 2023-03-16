import fs from "fs";

const mergeArray = (lines: string[], maxLen: Number) => {
  const joined: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let join = lines[i];
    let len = join.length;
    if (i + 1 < lines.length && len + lines[i + 1].length < maxLen) {
      join += lines[i + 1];
      len = join.length;
      i++;
      if (i + 1 < lines.length && len + lines[i + 1].length < maxLen) {
        join += lines[i + 1];
        len = join.length;
        i++;
        joined.push(join);
      } else {
        joined.push(join);
      }
    } else {
      joined.push(join);
    }
  }
  return joined;
};

const content = fs
  .readFileSync("./subtitles/01.srt")
  .toString()
  .split(/\r?\n/)
  .filter((l) => l.length > 0);

const alllines: string[] = [];

content.forEach((l) => {
  let line = l.trim().replace(/转\*轮/g, "转法轮");
  const matches = line.matchAll(/，|。|；|？/g);

  const chunks = [];
  let start = 0;
  for (const m of matches) {
    if (m.index) {
      const chunk = line.substring(start, m.index + 1);
      chunks.push(chunk);
      start = m.index + 1;
    }
  }
  alllines.push(...mergeArray(chunks, 24));
});

const processed: string[] = [];
alllines.reduce((acc, cur, idx) => {
  acc.push(`${idx + 1}\r\n00:00:00,000 --> 00:00:00,000\r\n${cur}\r\n`);
  return acc;
}, processed);

fs.writeFileSync("./subtitles/01.process.srt", processed.join("\r\n"));
