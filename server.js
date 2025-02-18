const express = require("express")
const server = express()

//config servidor p/ arq estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended: true}))

//configurar conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

//configurar template
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
}) // pasta maratonadev


//

//config apresentaçao da pagina
server.get("/", function(req, res){
    db.query('SELECT * FROM "donors";', function(err, result){
        if (err) return res.send("Erro no banco de dados.")

        const donors = result.rows 
        return res.render("index.html", {donors})
    })
    
})

server.post("/", function(req,res){
//pegar dados do formulario
    const name = req.body.name
    const email = req.body.name
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocar valores no bd
    const query = `INSERT INTO "donors" ("name", "email", "blood") 
                   VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        if(err) return res.send("Erro no banco de dados.")
    })

    return res.redirect("/")
})

//porta
server.listen(3000, function(){
    return console.log("Server started.")
})