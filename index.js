const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const sql = require("mssql");
const config = require("./config");

app.use("/", express.static("public"));
app.use(express.json());

app.post("/login", (req, res) => {
    const conn = sql.connect(config, (err) => {
      if (err) console.log(err);
      const request = new sql.Request();
      let query =
        "select * from Usuarios where correo='" + req.body.correo + "'";
      console.log(query);
      request.query(query, (err, { recordset }) => {
        if (err) console.log(err);
        console.log(recordset);
        let login = false;
        if (recordset.length > 0) {
          if (
            recordset[0].correo === req.body.correo &&
            recordset[0].contrasena === req.body.pass
          ) {
            login = true;
          }
        }
        res.json({
          login: login,
        });
      });
    });
    console.log("Post LOGIN");
    console.log(req.body);
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });