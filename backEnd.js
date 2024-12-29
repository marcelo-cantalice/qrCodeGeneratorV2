//1)create a file called backEnd.js, which will have qr-image
//2)import data txtInput from index.js, to use qr.image in backEnd.js
import qr from "qr-image";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/submit", async (req, res) => {
    
    const url = req.body.url;

    try {
      const buffer = await new Promise((resolve, reject) => {
        const chunks = [];
        const qrSvg = qr.image(url, { type: "png" });
        qrSvg.on("data", (chunk) => chunks.push(chunk));
        qrSvg.on("end", () => resolve(Buffer.concat(chunks)));
        qrSvg.on("error", reject);
      });
  
      const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;
      res.send(`<img src="${base64Image}" alt="QR Code" />`);
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).send("Error generating QR code");
    }
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
async function generateQrCode(){
    var qrSvg = qr.image(req.body.url);
    await qrSvg.pipe(fs.createWriteStream("qr_imageNew.png"));
    return "qr_imageNew.png";
}
/*
$("button").click(function(){
  var txtInput = $("#txtField").val();
  var qrSvg= qr.image(txtInput);
  qrSvg.pipe(fs.createWriteStream('qr_imageNew.png')); 
  fs.writeFile("URLnew.txt", url, (err)=>{
    if(err) throw err;
    console.log("The new file has been saved!");
  }); 
});
*/
