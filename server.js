const fs = require("fs");
const path = require("path");
const express = require("express");
const {animals} = require("./data/animals.json");
const PORT = process.env.PORT || 3001;
const app = express();
//parse incoming string or array data
app.use(express.urlencoded({extended: true}));
//parse incoming JSON data
app.use(express.json());


const filterByQuery = (query, animalsArray) => {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if(query.personalityTraits){
        //save personalityTraits as an array, if personalityTraits 
        //is a string place it in a new array
        if(typeof query.personalityTraits === "string"){
            personalityTraitsArray = [query.personalityTraits];
        }
        else{
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through each trait
        personalityTraitsArray.forEach(trait => {
            //filter trait through each animal in the filtered results 
            //array to once the loop is complete only animals with the 
            //traits are in the array
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

const findById = (id, animalsArray) => {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result
}

const createNewAnimal = (body, animalsArray) => {
    const animal = body;
    //this add animal to local array, need fs to add it to json file
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, "./data/animals.json"),
        JSON.stringify({animals: animalsArray}, null, 2)
    );

    return animal;
}

const validateAnimal = (animal) => {
    if(!animal.name || typeof animal.name !== "string"){
        return false;
    }
    if(!animal.species || typeof animal.species !== "string"){
        return false;
    }
    if(!animal.diet || typeof animal.diet !== "string"){
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }
    return true
};

app.get("/api/animals", (req, res) => {
    let results = animals;
    if(req.query){
        results = filterByQuery(req.query, results)
    }
    res.json(results);
});

//param route must come after the prevois GET route
app.get("/api/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    }
    else{
        res.send(404);
    }
})

app.post("/api/animals", (req, res) => {
    //set id based on what the next index of the array will be (length is always 1 more than array index)
    req.body.id = animals.length.toString();
    //if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)){
        res.status(400).send("The animal is not properly formatted");
    }
    else{
        const animal = createNewAnimal(req.body, animals);
        res.json(req.body);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});