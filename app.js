const express = require('express');
const https = require('https');
const bp = require('body-parser');


const app=express();
app.set('view engine', 'ejs');
app.use(bp.urlencoded({extended: true}));

//server action part
app.get("/", (req, res)=>{
   res.render('index');
});

app.post("/",function(req, res){
    //externel url import
    const cityname = req.body.city;//possible with body-paarser
    const id = "d8f7a34be887ad99d0b3708ae857f6ee";
    const unit = "metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+ cityname +"&appid="+ id +"&units="+unit;
    https.get(url, function(response){
    console.log(response.statusCode); 

    
    response.on("data", function(data){
        const weatherData = JSON.parse(data)//converting this data to JSON 
        const cod = weatherData.cod;
        console.log(cod);
        if(cod == 404){
                res.render('404');
        }else{
        const digree = weatherData.main.temp;
        const country = weatherData.sys.country;
        const name = weatherData.name;
        const home = "/";
        const icon = weatherData.weather[0].icon;
        const iconlink = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";
        res.send("<title>Weather | "+ name +"</title><img src=" + iconlink + "><br><h3>Country: "+country+"</h3><br><h3>City: " + name + "</h3><br><h2>Digree: "+digree+"</h2><br><a href="+ home +">Go back to Home</a>");
        }
    })
    })
})

//default 404
app.use((req, res)=>{
    const home="/";
    res.status('404').render('404');
});
//creating a server
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});