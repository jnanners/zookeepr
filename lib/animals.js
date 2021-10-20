const fs = require("fs");
const path = require("path");

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
        path.join(__dirname, "../data/animals.json"),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
}