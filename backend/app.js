const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise')
const app = express()
app.use(cors())
app.use(express.json())
let db=null

const intializeDBServer = async () =>{
    try{
        db = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'ShivRambhaktmkp@123',
        database: 'primetrade_db',
    });
    app.listen(3000,()=>{
        console.log("Server Running at http://localhost:3000/")
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