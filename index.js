import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "postgres16",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {

  try {
    const getItems = (await db.query("select * from todo_list")).rows
    console.log(getItems);

    items = getItems
    console.log(items);
  } catch (err) {
    console.log(err);
  }
  res.render("index.ejs", {
    listTitle: "To-Do List",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    const add = await db.query("Insert into todo_list(title) values ($1)", [item])
    console.log("added title: " + item);
  } catch (err) {
    console.log(err);;
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => { 
  const updatedItemId = req.body.updatedItemId
  const updatedTitle = req.body.updatedItemTitle

  // console.log(itemId, updatedTitle);

  try {
    const update = await db.query("UPDATE todo_list SET title = $1 where id = $2" , [updatedTitle, updatedItemId]);
    console.log("Title Updated to: " + updatedTitle);
  } catch (err) {
    console.log(err);
  }
  res.redirect('/')
});

app.post("/delete", async (req, res) => { 
  const itemId = req.body['deleteItemId']

  try {
    const deleteItem = await db.query("DELETE FROM todo_list WHERE id = $1" , [itemId])
  } catch (error) {
    console.log(error);
  }

  res.redirect('/')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
