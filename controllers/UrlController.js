const mongoose = require("mongoose");
const arrayUniquePlugin = require("mongoose-unique-array");

const moment = require("moment");

const Url = require("../models/Url");
const Store = require("../models/Shop");

exports.url_redirect = async (req, res)=>{
  try {
    console.log(Store);
    let url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      //price, converted, followUp[], checkoutId
      console.log("/index follwUp", url.followUp);

      try {
        let ourConverted = await Store.updateOne(
          {
            name: url.shop,
            clicked: {
              $elemMatch: {
                checkoutId: url.id
              }
            }
          },
          {
            $set: {
              "clicked.$.followUp": url.followUp
            }
          }
        );
        console.log(ourConverted.nModified);
        if (!ourConverted.nModified) {
          Store.findOneAndUpdate(
            { name: url.shop },
            {
              $addToSet: {
                clicked: {
                  checkoutId: url.id,
                  followUp: url.followUp,
                  price: url.price
                }
              }
            },
            { new: true, useFindAndModify: false },
            (err, data) => {
              if (!err) {
                console.log(data);
              } else {
                console.log(err);
              }
            }
          );
        }
        console.log("ourConverted");
      } catch (error) {
        console.error(error);
        console.log("unable to mark as purchase true");
      }

      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No url found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
}
