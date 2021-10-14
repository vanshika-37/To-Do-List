const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-vanshika:Test123@cluster0.ceaw2.mongodb.net/itemsDB', { useNewUrlParser: true });

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please specify task!"]
    }
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Good Luck!"
});

const item2 = new Item({
    name: "Hit the + button to add task"
})

const item3 = new Item({
    name: "Hit the checkbox to delete a task"
})

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {

    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options)

    Item.find(function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Successfully added the items to ItemDB");
                }
            });
            res.redirect("/");
        }
        else {
            res.render("list", { kindOfDay: day, newListItems: foundItems });
        }
    });
});

app.post("/", function (req, res) {

    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/");
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, function (err) {
        if (!err) {
            console.log("Succcessully deleted checked items!");
            res.redirect("/");
        }
    })
});


app.listen(process.env.PORT || 80, function () {
    console.log("Server started on port 80");
});


