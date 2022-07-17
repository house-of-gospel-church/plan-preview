const SPREADSHEET_API_KEY = "AIzaSyCmd6x4AlpzVw-_nf5dGkaSL0TlW7uGPXc";
const SPREADSHEET_ID = "1JYU9KPNd3BGqQSnWwXx3B-_LU9PoVmJ-ZVRvdZRx5Aw";
const SPREADSHEET_RANGE = "D10:I1000";

const BIBLE_BOOKS_LOCALE = [
  { human: "Буття", usfm: "GEN" },
  { human: "Вихід", usfm: "EXO" },
  { human: "Левит", usfm: "LEV" },
  { human: "Числа", usfm: "NUM" },
  { human: "Повторення Закону", usfm: "DEU" },
  { human: "Iсус Навин", usfm: "JOS" },
  { human: "Книга Суддiв", usfm: "JDG" },
  { human: "Рут", usfm: "RUT" },
  { human: "1-а Самуїлова", usfm: "1SA" },
  { human: "2-а Самуїлова", usfm: "2SA" },
  { human: "1-а царiв", usfm: "1KI" },
  { human: "2-а царiв", usfm: "2KI" },
  { human: "1-а хронiки", usfm: "1CH" },
  { human: "2-а хронiки", usfm: "2CH" },
  { human: "Ездра", usfm: "EZR" },
  { human: "Неемія", usfm: "NEH" },
  { human: "Естер", usfm: "EST" },
  { human: "Йов", usfm: "JOB" },
  { human: "Псалми", usfm: "PSA" },
  { human: "Приповiстi", usfm: "PRO" },
  { human: "Екклезiяст", usfm: "ECC" },
  { human: "Пiсня над пiснями", usfm: "SNG" },
  { human: "Iсая", usfm: "ISA" },
  { human: "Єремiя", usfm: "JER" },
  { human: "Плач Єремiї", usfm: "LAM" },
  { human: "Єзекiїль", usfm: "EZK" },
  { human: "Даниїл", usfm: "DAN" },
  { human: "Осiя", usfm: "HOS" },
  { human: "Йоїл", usfm: "JOL" },
  { human: "Амос", usfm: "AMO" },
  { human: "Овдiй", usfm: "OBA" },
  { human: "Йона", usfm: "JON" },
  { human: "Михей", usfm: "MIC" },
  { human: "Наум", usfm: "NAM" },
  { human: "Авакум", usfm: "HAB" },
  { human: "Софонiя", usfm: "ZEP" },
  { human: "Огiй", usfm: "HAG" },
  { human: "Захарiя", usfm: "ZEC" },
  { human: "Малахiї", usfm: "MAL" },
  { human: "Вiд Матвiя", usfm: "MAT" },
  { human: "Вiд Марка", usfm: "MRK" },
  { human: "Вiд Луки", usfm: "LUK" },
  { human: "Вiд Iвана", usfm: "JHN" },
  { human: "Дiї", usfm: "ACT" },
  { human: "До римлян", usfm: "ROM" },
  { human: "1-е до коринтян", usfm: "1CO" },
  { human: "2-е до коринтян", usfm: "2CO" },
  { human: "До галатiв", usfm: "GAL" },
  { human: "До ефесян", usfm: "EPH" },
  { human: "До филип'ян", usfm: "PHP" },
  { human: "До колоссян", usfm: "COL" },
  { human: "1-е до солунян", usfm: "1TH" },
  { human: "2-е до солунян", usfm: "2TH" },
  { human: "1-е Тимофiю", usfm: "1TI" },
  { human: "2-е Тимофiю", usfm: "2TI" },
  { human: "До Тита", usfm: "TIT" },
  { human: "До Филимона", usfm: "PHM" },
  { human: "До євреїв", usfm: "HEB" },
  { human: "Якова", usfm: "JAS" },
  { human: "1-е Петра", usfm: "1PE" },
  { human: "2-е Петра", usfm: "2PE" },
  { human: "1-е Iвана", usfm: "1JN" },
  { human: "2-е Iвана", usfm: "2JN" },
  { human: "3-е Iвана", usfm: "3JN" },
  { human: "Юда", usfm: "JUD" },
  { human: "Об'явлення", usfm: "REV" },
];

const fetchPlan = async () => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?ranges=${SPREADSHEET_RANGE}&key=${SPREADSHEET_API_KEY}`
    )
      .then((r) => r.json())
      .then((response) => {
        resolve(
          response.valueRanges[0].values.map((row) => ({
            date: new Date(row[4]),
            book: row[3],
            chapter: row[2],
            comment: row[5],
          }))
        );
      })
      .catch(reject);
  });
};

const getNextWeekPlan = (plan) => {
  const now = new Date();
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const finishDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 6,
    23,
    59,
    59,
    999
  );

  return plan.filter((i) => i.date >= startDate && i.date <= finishDate);
};

const getBookName = (code) =>
  BIBLE_BOOKS_LOCALE.find((i) => i.usfm === code).human;

const e = React.createElement;
const root = ReactDOM.createRoot(document.getElementById("root"));

const PlanItem = ({ date, book, chapter }) => [
  e("div", { className: "date" }, [
    e(
      "span",
      {},
      date.toLocaleDateString("uk-UA", {
        weekday: "long",
      })
    ),
    `(${date.toLocaleDateString("uk-UA", {
      month: "long",
      day: "numeric",
    })})`,
  ]),
  e("div", { className: "chapter" }, [
    getBookName(book),
    e("span", {}, chapter),
  ]),
];

(async () => {
  const plan = await fetchPlan();
  const nextWeekPlan = getNextWeekPlan(plan);

  root.render([
    e("h1", {}, "План читання"),
    e(
      "div",
      { className: "plan" },
      nextWeekPlan.map((i) => e(PlanItem, i))
    ),
    e("div", { className: "bot" }, [
      e("div", { className: "link" }, "Telegram: @DEBiblePlanBot"),
    ]),
  ]);
})();
