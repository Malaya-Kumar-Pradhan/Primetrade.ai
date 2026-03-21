const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise')
const app = express()
require('dotenv').config();
app.use(cors())
app.use(express.json())
let db=null

const intializeDBServer = async () =>{
    try{
        db = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            ssl: { rejectUnauthorized: false }
        });
        const createUserTable = `
            CREATE TABLE IF NOT EXISTS user (
                id INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Email VARCHAR(255) NOT NULL,
                Gender VARCHAR(50),
                PhoneNo VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user'
            );
        `;
        await db.query(createUserTable);

        const createTasksTable = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status ENUM('pending', 'completed') DEFAULT 'pending',
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
               );
        `;
        await db.query(createTasksTable);
        
        console.log("Database tables checked and ready!");
        const port = process.env.PORT || 3000;
        app.listen(port,()=>{
            console.log("Server Running")
        })
    }
    catch(error){
        console.log(`DB Error: ${error.message}`)
        process.exit(1)
    }
}

intializeDBServer()

const authenticateToken = (request,response,next)=>{
    let jwtToken
    const authHeader = request.headers['authorization']
    if(authHeader!==undefined){
        jwtToken=authHeader.split(' ')[1]
    }
    if(jwtToken===undefined){
        response.status(401).send("Invalid JWT token")
    }
    else{
        jwt.verify(jwtToken,"MY_SECRET_TOKEN",async (error,payload)=>{
            if(error){
                response.status(401).send("Invalid JWT Token");
            }
            else{
                request.username = payload.username;
                request.userId = payload.userId;
                request.role = payload.role;
                next();
            }
        })
    }
}

const authorizeAdmin = (request,response,next)=>{
    if(request.role!='admin'){
        return response.status(403).send("Access Denied: Admins only");
    }
    next()
}

app.post('/api/v1/register',async (request,response)=>{
    const {name,email,gender,phoneNo,password,role='user'} = request.body
    if (!password || password.length < 8) {
        return response.status(400).json({ error_msg: "Password must be at least 8 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password,8)
    const userQuery = `select * from user where Name = ? ;`
    const [result] = await db.query(userQuery,[name])
    const res = result[0]
    if(res===undefined){
        const insertQuery = `Insert into user(Name,Email,Gender,PhoneNo,Password,role) values (?,?,?,?,?,?);`
        await db.query(insertQuery,[name, email, gender, phoneNo, hashedPassword, role])
        return response.status(200).json({msg:"Registered Successfully"})
    }
    else{
        response.status(409).json({error_msg:"User already exists"})
    }
})

app.post('/api/v2/login',async (request,response)=>{
    const {username,password} = request.body
    const loginQuery = `Select * from user where Name = ?;`
    const [userDetails] = await db.query(loginQuery,[username])
    const user = userDetails[0]
    if(user===undefined){
        return response.status(400).json({ error_msg: "Invalid Username" });
    }
    else{
        const checkPassword = await bcrypt.compare(password,user.password)
        if(checkPassword){
            const payload = {username:user.name, userId:user.id, role:user.role}
            const jwtToken = jwt.sign(payload,"MY_SECRET_TOKEN")
            response.send({jwtToken})
        }
        else{
            return response.status(400).json({error_msg:"Invalid Password"})
        }
    }
})

app.get('/api/v1/tasks', authenticateToken, async (request, response) => {
    const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [request.userId]);
    response.json(tasks);
});

app.post('/api/v1/tasks', authenticateToken, async (request, response) => {
    const { title, description } = request.body;
    await db.query('INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)', [title, description, request.userId]);
    response.status(201).json({ msg: "Task Created" });
});

app.delete('/api/v1/tasks/:id', authenticateToken, async (request, response) => {
    const { id } = request.params;
    await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, request.userId]);
    response.json({ msg: "Task Deleted" });
});
