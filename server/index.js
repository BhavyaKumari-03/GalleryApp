const express = require('express');
const multer = require('multer');
const path= require('path'); 
const jwt = require('jsonwebtoken');
const sequelize = require('./database')
const User = require('./user');
const Post= require('./posts');
const { Op } = require("sequelize");
const crypto = require('crypto');
const fs = require('fs');



function generateRandomString(length) {
    const characters ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    
    let result = "";
    for (let i= 0 ; i<length;i++){
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex);
    }
    return result;
}

sequelize.sync().then(() => console.log('Database is ready'));

const app = express();

const storage = multer.memoryStorage();
    
const upload = multer({ storage});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/upload', express.static(path.join(__dirname, 'uploads')));

app.post('/users', async (req, res) => {
  await User.create(req.body);
  res.send('User created');

});

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

app.put('/users/:email', async (req, res) => {
  const requestedEmail = req.params.email;
  const user = await User.findOne({ where: { email: requestedEmail } });
  user.username = req.body.username;
  await user.save();
  res.send('User updated');
});

app.delete('/users/:email', async (req, res) => {
  const requestedEmail = req.params.email;
  await User.destroy({ where: { email: requestedEmail } });
  res.send('User removed');
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // validate the credentials (db)
  const user = await User.findOne({
    where: {
      email: {
        [Op.eq]: email,
      },
      password: {
        [Op.eq]: password,
      },
    },
  });

  if (user === null) {
    res.json({ "message": "Email or password invalid", "status": "failed" });
    return;
  }

  // add the token to the response and send it
  const token = jwt.sign({ userId: user.id }, "super-secret", { expiresIn: "1d" });

  res.json({ "status": "ok", token: token });
});


// Create a new post
app.post('/posts', upload.single('imageUrl'), async (req, res) => {
  const {title,Name } = req.body;
  const token = req.headers["authorization"].split(' ')[1];
  console.log("token", token);
  const decoded = jwt.verify(token, "super-secret");
  const user = await User.findByPk(decoded.userId);
  
  // generate a random string -> 83ksdkfsdf25 

  // save the file with random string name (blog_images -> 83ksdkfsdf25.png, sdfsdf23ssdf.png)

  // in database you store the file name in the image column
  
  const randomString = crypto.randomBytes(8).toString('hex');

  const directoryPath = 'uploads';

  // save the file with a random string name
 const fileName =  `${randomString}.png`;
 // Path to the file
const filePath = path.join(directoryPath,fileName);


  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // save the file with a random string name

// const fileBuffer = req.file.buffer;
// fs.writeFileSync(filePath,fileBuffer);


  // random string user_id

  const post = await Post.create({
    title,
    Name,
    imageUrl:fileName,
    userId: User.id, 
  });
  
  res.json(post);
});

// Get all posts
app.get('/posts', async (req, res) => {

  const posts = await Post.findAll({
    include: [{ model: User, attributes: ['id', 'f_name', 'email'] }],
  });

  "http://localhost:3000/image/" + "83ksdkfsdf25"
  res.json(posts);
});

app.get('/image/:imageName',(req,res)=>{
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname,'uploads',imageName);
  res.sendFile(imagePath);
})


app.set("view engine","ejs");

app.get("/uploads",(req,res)=> {
    res.render("upload");
  });
  
// route that fetches all images from db
app.get('/', async (req, res) => {
  const images = await Image.findAll();
  res.render('index', { images });
});

app.listen(3000,() => {
      console.log("App is Running");
    });
