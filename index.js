let express = require("express");
let cors = require("cors");

let app = express();
app.use(cors());

//server-side value
let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

function totalcartprice(newItemPrice, cartTotal){
  let TotalPrice = newItemPrice + cartTotal;
  return TotalPrice.toString()
}
app.get("/cart-total", (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice); //spell correctly 
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(totalcartprice(newItemPrice, cartTotal));
});

function finalPrice(cartTotal, isMember){
  let result;
  if(isMember === true){
    result =  cartTotal - (cartTotal * discountPercentage) / 100; 
  }else {
    result = cartTotal;
  }
  return result.toString()
}

app.get("/membership-discount",(req, res)=>{
  let cartTotal = parseFloat( req.query.cartTotal);
  let isMember = req.query.isMember === "true";
  res.send(finalPrice(cartTotal, isMember));
});

function taxonCart(cartTotal){
  let totaltax = (cartTotal * taxRate) / 100;
  return totaltax.toString()
}

app.get("/calculate-tax",(req, res) =>{
  let cartTotal = req.query.cartTotal;
  res.send(taxonCart(cartTotal));
});

function deliveryTime(shippingMethod, distance){
  let deliverydays;
  if (shippingMethod === "standard" ){
    deliverydays = Math.ceil (distance / 50) ; //"per day"
  } else if(shippingMethod ==="express") {
    deliverydays = Math.ceil (distance / 100);
  } else {
    return "invalid shippingMethod Option";
  }
  return deliverydays.toString();
}; // don't use here () brackets. give error.

app.get("/estimate-delivery",(req, res) =>{
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(deliveryTime(shippingMethod, distance));
});


function totalShippingCost(weight,distance){
  let calculateShippingcost = (weight*distance*0.1)
  return calculateShippingcost.toString()
}

app.get("/shipping-cost", (req, res)=> {
  let weight = parseFloat(req.query.weight)
  let distance = parseFloat(req.query.distance)
  res.send(totalShippingCost(weight,distance))
});

function totalLoyaltypoint(purchaseAmount){
  let calculateLoyaltypoint =(purchaseAmount*loyaltyRate);
  return calculateLoyaltypoint.toString()
}

app.get("/loyalty-points",(req, res)=> {
  let purchaseAmount = parseFloat(req.query.purchaseAmount)
  res.send(totalLoyaltypoint(purchaseAmount));
});

let PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
