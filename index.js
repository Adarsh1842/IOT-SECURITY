import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import { ReturnDocument } from "mongodb";

const app = express();
app.use(express.json())
app.use(express.urlencoded());
app.use(cors());

const PORT = 8080;

const mongourl = `mongodb+srv://shantanu200:jayabhusari@mongodbcluster.f3t5i.mongodb.net/sensordata?retryWrites=true&w=majority`;

mongoose.connect(mongourl,{
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log("DB Connected");
});

const sensorSchema = mongoose.Schema(
  {
    temperature : String,
    humidity: String,
    gasLevel: String
  },
  {
    timestamps: true
  }
);

const Sensor = new mongoose.model("Sensor",sensorSchema);

app.post("/postData",(req,res) => {
  if(!req.body) res.sendStatus(400);

  console.log(req.body);

  const {temperature,humidity,gasLevel} = req.body;

  if(!isNaN(temperature) && !isNaN(humidity) && !isNaN(gasLevel)){
    const sensor = new Sensor({
      temperature,
      humidity,
      gasLevel
    });
    sensor.save().then((sensor) => {
      res.send({
        msg : "Data is added to data base"
      });
    })
    .catch((err) => {
      res.send({
        msg : "Error Occured"
      });
    });
  }else{
    res.send({
      msg: "NAN value is posted"
    })
  }
});
function decrypt(encryptedText) {
  let  d = private_key ;    // Add a private key 
  let decrypted = 1;
  let n=187;
  while (d--) {
    decrypted *= encryptedText;
    decrypted %= privaen;
  }
  return decrypted;
}
function decrypt_data(sensor)
{
  let s=sensor.length;
  let data = [];
  for(let i=0;i<s;i++)
    {
      data.push({
        temperature:decrypt(sensor[i].temperature),
        humidity:decrypt(sensor[i].humidity),
        gasLevel:decrypt(sensor[i].gasLevel)
      })
    }
     return data;
}

app.get("/record",(req,res) => {
  Sensor.find(function(err,sensor){
    if(err){
      console.log(err);
    }else{
      let data = decrypt_data(sensor);
      console.log(data);
      res.json(data);
    }
  })
})

app.listen(PORT,()=>{
  console.log(`Server is connected at PORT ${PORT}`);
})
