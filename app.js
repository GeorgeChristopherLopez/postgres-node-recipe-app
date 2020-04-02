const { Client } = require("pg");
const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// connecting to postgres
const client = new Client({
    user: 'whateveryoulike',
    host: '127.0.0.1',
    database: 'recipebookDB',
    password: 'AlcheMax217512',
    port: 5432,
})
async function start() {

    await connect();
    /*
    const todos = await readToDos();
    console.log("todo:",todos)

     const successCreate = await createToDo("Trader Joes","Go to Trader Joes")
      console.log(`Create was ${successCreate}`);

        const successDelete = await deleteToDo(1)
        console.log(`Delete was ${successDelete}`)
        */


}
start();
// CONNECT
async function connect() {
    try {
        await client.connect();

    } catch (e) {
        console.log('Failed to connect', e)
    }
}

//READ
async function readRecipes() {
    try {
        const { rows } = await client.query("SELECT * FROM recipes")

        return rows;
    } catch (e) {
        console.log("error reading Recipes", e);
        return [];
    } 
}
//WRITE
async function addRecipe(name, ingredients, directions) {
    try {

        await client.query(`INSERT into recipes (name, ingredients, directions)VALUES($1,$2,$3)`, [name, ingredients, directions]);
        let created = await client.query("SELECT from recipes where id = lastval()");
        console.log(created);
        return true;
    } catch (e) {
        console.log("error adding recipe", e)
        return false;
    }
}

// DELETE
async function deleteRecipe(id) {
    try {

        let deleting = await client.query("SELECT from recipes where id = $1", [id]);
        await client.query("DELETE from recipes where id = $1", [id])

        return true;
    } catch (e) {
        console.log("error deleting recipes", e)
        return false;
    }
}

//EDIT
async function editRecipe(id, name, ingredients, directions) {
    try {

        let updating = await client.query("SELECT from recipes where id = $1", [id]);
        console.log("updating: " + updating)
        await client.query('UPDATE recipes SET name = ($1), ingredients = ($2), directions=($3) WHERE id = ($4)', [name, ingredients, directions, id])

        return true;
    } catch (e) {
        console.log("error UPDATING recipes", e)
        return false;
    }
}

// set up template views
app.set("views", path.join(__dirname, 'views'));
// Set Default PUG extension
app.set("view engine", "pug");

// set Public folder
app.use(express.static(path.join(__dirname, 'public')));


// Home route

app.get('/', async function (req, res) {
    const rows = await readRecipes();
    // send data
  
    res.render('index', {
        title: 'Recipes',
        recipes: rows
    });

});


// Home route
app.get('/recipes/add', function (req, res) {
    res.render('add_recipe', {
        title: 'Add Recipe'
    });
})

app.post('/add', async function (req, res) {
    let result = {};

    try {
        console.log("request: " + JSON.stringify(req.body));
        await addRecipe(req.body.name, req.body.ingredients, req.body.directions);
        result.success = true;
    } catch (e) {
        console.log("error:", e);
        result.success = false;
    } finally {
        // send data
        console.log(result);
        res.redirect('/');
    }

    // send data
   
   


});

app.delete('/delete', async function (req, res) {
    let result = {}
    try {
        console.log("request: " + (req.body.id));
   
        await deleteRecipe(req.body.id);
        res.redirect('/');
    } catch (e) {
        console.log("error:", e);
        result.success = false;
    } finally {
        // send data
        console.log(result);
        res.redirect('/');
    }


});

app.put('/edit', async function (req, res) {
    let result = {}
    try {
        console.log("request: " + (req.body.id));

        await editRecipe(req.body.id, req.body.name, req.body.ingredients, req.body.directions);
        res.redirect('/');
    } catch (e) {
        console.log("error:", e);
        result.success = false;
    } finally {
        // send data
        console.log(result);
        res.redirect('/');
    }


});
//server
app.listen(8080, function () {
    console.log('server started on port 8080')
   

})

