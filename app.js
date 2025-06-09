const fs = require("fs");

const express = require("express");

const app = express();

//midd
app.use(express.json());

//router
app.get("/", (req, res, next) => {
  try {
    fs.readFile("./DATA.json", (err, data) => {
      if (err) {
        const error = new Error("خطای از سمت سرور پیش امده");
        error.statusCode = 500;
        throw error;
      }
      data = JSON.parse(data);
      res.status(200).json({ data });
    });
  } catch (err) {
    next(err);
  }
});

app.get("/search", async (req, res, next) => {
  const codes = [];
  let dataFile = [];
  try {
    dataFile = fs.readFileSync("./DATA.json");
    dataFile = JSON.parse(dataFile);

    if (req.query.code) {
      for (item in dataFile) {
        if (item.slice(6, 9) == req.query.code) {
          codes.push({
            code: item.slice(6, 9),
            title: dataFile[item].title,
            body: dataFile[item].body,
          });
        }
      }
    }

    if (req.query.keyword) {
      for (item in dataFile) {
        if (
          dataFile[item].body.includes(req.query.keyword) ||
          dataFile[item].title.includes(req.query.keyword)
        ) {
          codes.push({
            code: item.slice(6, 9),
            title: dataFile[item].title,
            body: dataFile[item].body,
          });
        }
      }
    }

    if (req.query.category) {
      for (item in dataFile) {
        if (item.slice(6, 7) == req.query.category) {
          codes.push({
            code: item.slice(6, 9),
            title: dataFile[item].title,
            body: dataFile[item].body,
          });
        }
      }
    }


    res.status(200).json({data: codes})
  } catch (err) {
    next(err);
  }
});

//handel error
app.use(require("./middleware/errors").error);

app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log("start");
});
