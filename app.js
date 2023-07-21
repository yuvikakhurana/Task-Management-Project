const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const mongoose = require("mongoose");
const _ = require("lodash");

let day = date.getDate();;

// console.log(date());

const app = express();

//const in arrays allows to push new items
// const items = ['Buy Food', 'Cook Food', 'Eat Food'];

// const workItems = [];

app.use(express.static("public"));


app.use(bodyParser.urlencoded( {
        extended:true
 })); 

app.set('view engine', 'ejs');

//For Local:
//mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

//For Cloud:

mongoose.connect("mongodb+srv://admin-yuvika:Test123@cluster0.ewjrgvh.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
        name: String
});


const listSchema = new mongoose.Schema({
    name: String, 
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

const Item =  mongoose.model("Item", itemsSchema);


const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item ({
    name: "Hit the + button to add anew item."
});

const item3 = new Item ({
    name: "<-- Hit this to delete an item."
});


const defaultItems = [item1, item2, item3];




app.get("/", function(req, res) {
    
    //var a = 3+5;
    //res.send(a);

     //day = date.getDate();

    Item.find({})
        .then(function (foundItems) {
        //mongoose.connection.close();
        

        //Insert only is array is empty
        if(foundItems.length === 0) {

            Item.insertMany(defaultItems)
                .then(() => {
                    console.log("Successfully Added Default Items to the DB!");
                })
                .catch((err) => {
                    console.log(err);
                }
            );

            res.redirect("/");
        } else {
            res.render('list', {listTitle: day, newListItems: foundItems});
        }

    })
        .catch(function (err) {
            console.log(err);
    });


});

app.get("/about", function(req, res) {
    res.render("about");
})

// app.get("/work", function(req, res) {
//     res.render('list', {listTitle: "Work List", newListItems: workItems});
// })

app.get("/:customListName", function(req, res) {
     const customListName = _.capitalize(req.params.customListName);
    
  
    List.findOne({name: customListName})
        .then (function(foundList) {
            if(!foundList) {
            //If list deosn't exist
                //Create a new List
                const list = new List({
                    name: customListName, 
                    items: defaultItems
                 });
            
                 list.save();

                 res.redirect("/" + customListName);
            } else {

                //Show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items} )
            }
        })
        .catch(function (err) {
            console.log(err);
        });;

    

});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;

    const newItem = new Item ({
        name: itemName
    })

    const listName = req.body.button;


    if(listName == day) {
        newItem.save();
        res.redirect("/");    
    } else {
        List.findOne({name: listName})
            .then(function(foundList) {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
        })
    }

    // if(req.body.button === "Work List") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {

    //     items.push(item);

    //     res.redirect("/");
    // }

});


app.post("/delete", function(req, res) {
        const checkedItemId = req.body.checkbox;

        const listName = req.body.listName;

        if(listName === day) {
            Item.deleteOne({_id : checkedItemId})
            .then(() => {
                console.log("Successfully Deleted");
                res.redirect("/");
            })
            .catch((err) => {
                console.log(err);
            });


        } else {

            List.findOneAndUpdate({name: listName}, { $pull: {items: {_id : checkedItemId}}})
            .then(() => {
                console.log("Successfully Updated");
            })
            .catch((err) => {
                console.log(err);
            });

            res.redirect("/" + listName);
        }

   

       

});






app.listen(3000, function() {
    console.log("Server has started on port 3000");
});

