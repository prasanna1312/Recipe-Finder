const search = document.getElementById("search-input");
const recipe = document.getElementById("recipe-card");
const searchBtn = document.getElementById("search-btn");
const recipeDetails = document.getElementById("recipe-details");
const recipeImage1 = document.getElementById("recipe-image1");
const ingredients = document.getElementById("recipe-ingredients");
const instructions = document.getElementById("recipe-instructions");
const recipeTitle = document.getElementById("recipe-title");
const loading = document.getElementById("loading");
const category = document.getElementById("categories");
const filters = document.getElementById("filter");
const random =document.getElementById("random-recipe");
const favourite = document.getElementById("favourite");
const addFavourite = document.getElementById("add-favourite");
const favouritesContainer = document.getElementById("favourites-container");
const backBtn = document.getElementById("back-btn");

let selectedMeal;
let meal;
let recipeName;
let response;
let result;
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

async function APIDetails()
{
    recipeName = search.value.trim();
    if(recipeName==="")
    {
        alert("Please enter a recipe name");
        meal = null;
        return;
    }
    loading.textContent = "Loading...";

    try{
    response= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
   
    if(!response.ok)
    {
        throw new Error("API request failed");
    }
    result = await response.json();  
    if(!result.meals)
    {
        throw new Error("No recipes found");
    }
    meal = result.meals;

    }

    catch(error){
        alert(error.message);
        meal=null;
    }
    finally{
        loading.textContent="";
    }
}

function showRecipeCard() {
    recipe.innerHTML="";
    for(let i=0;i<meal.length;i++){
        const card = document.createElement("div");
        card.classList.add("recipe-item");
        card.innerHTML =`
        <img src= "${meal[i].strMealThumb}">
        <h3>${meal[i].strMeal}</h3>`;
        
    card.addEventListener("click", function() {
            cookingDetails(meal[i]);
        });
        recipe.append(card);
    }
   
    recipe.style.display = "flex";
    recipeDetails.style.display = "none";
}

searchBtn.addEventListener("click", searchRecipe);
 async function searchRecipe(){
     await APIDetails();
     favouritesContainer.style.display = "none";

     if(!meal){
        return;
     }

    showRecipeCard();



}

function cookingDetails(selectedRecipe){
        selectedMeal = selectedRecipe;

            const alreadyFavourite = favourites.some(function(item) {
        return item.idMeal === selectedMeal.idMeal;
    });

    if (alreadyFavourite) {
        addFavourite.classList.add("active");
    } else {
        addFavourite.classList.remove("active");
        }

     ingredients.textContent="Ingredients: ";
    for(let i=1;i<=20;i++){
        const ingredient= selectedMeal[`strIngredient${i}`];
        const measure = selectedMeal[`strMeasure${i}`];

        if(ingredient){
            ingredients.textContent+= measure+" "+ingredient+ ", ";
        }
    }

    recipeTitle.textContent= selectedMeal.strMeal;
    recipeImage1.src=selectedMeal.strMealThumb;
    instructions.textContent = "Instructions: "+selectedMeal.strInstructions;
    recipe.style.display="none";
    recipeDetails.style.display="flex";

}

backBtn.addEventListener("click", function() {

    recipeDetails.style.display = "none";
    recipe.style.display = "flex";

    favouritesContainer.style.display = "none";

    search.value = "";
});

category.addEventListener("click",categories);
async function categories(){
    if (filters.style.display === "block") {
        filters.style.display = "none";
        return;
    }
    try{
    const filter = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
    if(!filter.ok)
    {
        throw new Error("API request failed");
    }
    result = await filter.json();

    }
    catch(error){
        alert(error.message);
    }
    filters.innerHTML="";
   for(let i = 0; i < result.meals.length; i++) {

        const categoryName = result.meals[i].strCategory;

        const categoryButton = document.createElement("button");

        categoryButton.textContent = categoryName;

        filters.appendChild(categoryButton);
    }

    filters.style.display = "block";
}

function showRandomRecipe() {

    recipe.innerHTML = "";

    const card = document.createElement("div");

    card.classList.add("recipe-item");

    card.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
    `;

    card.addEventListener("click", function() {
        cookingDetails(meal);
    });

    recipe.append(card);

    recipe.style.display = "flex";
    recipeDetails.style.display = "none";
}

random.addEventListener("click", randomRecipe);
async function randomRecipe() {
    favouritesContainer.style.display = "none";
    loading.textContent = "Loading...";
    try{
    const surprise= await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    if(!surprise.ok){
        throw new Error("API request failed")
    }
    result = await surprise.json();

        meal = result.meals[0];

        showRandomRecipe();

    } catch(error) {
        alert(error.message);
        meal = null;

    } finally {
        loading.textContent = "";
    }
}
function addToFavourites() {
    if (!selectedMeal) {
        return;
    }

    const index = favourites.findIndex(function(item) {
        return item.idMeal === selectedMeal.idMeal;
    });

    if (index !== -1) {
        // Remove from favourites
        favourites.splice(index, 1);
        addFavourite.classList.remove("active");
    } else {
        // Add to favourites
        favourites.push(selectedMeal);
        addFavourite.classList.add("active");
    }

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );
}

addFavourite.addEventListener("click", addToFavourites);
addFavourite.addEventListener("click", addToFavourites);

function showFavourites() {

    favouritesContainer.innerHTML = "";

    if (favourites.length === 0) {
        favouritesContainer.textContent = "No favourite recipes yet.";
        return;
    }

    favourites.forEach(function(item) {

        const favouriteCard = document.createElement("div");

        favouriteCard.classList.add("favourite-card");

        favouriteCard.innerHTML = `
            <img src="${item.strMealThumb}">
            <h3>${item.strMeal}</h3>
        `;

        favouritesContainer.appendChild(favouriteCard);

        favouriteCard.addEventListener("click", function() {
            showFavouriteDetails(item);
        });

    });
}
function showFavouriteDetails(item) {

    favouritesContainer.innerHTML = "";

    let ingredientText = "";

    for (let i = 1; i <= 20; i++) {

        const ingredient = item[`strIngredient${i}`];
        const measure = item[`strMeasure${i}`];

        if (ingredient) {
            ingredientText += measure + " " + ingredient + ", ";
        }
    }

    const favouriteDetails = document.createElement("div");

    favouriteDetails.classList.add("favourite-details");

    favouriteDetails.innerHTML = `
        <h2>${item.strMeal}</h2>

        <img src="${item.strMealThumb}">

        <p>
            <strong>Ingredients:</strong>
            ${ingredientText}
        </p>

        <p>
            <strong>Instructions:</strong>
            ${item.strInstructions}
        </p>

        <button class="remove-btn">Remove</button>

        <button class="back-btn">Back to Favourites</button>
    `;

    favouritesContainer.appendChild(favouriteDetails);

    favouriteDetails
        .querySelector(".remove-btn")
        .addEventListener("click", function() {

            removeFavourite(item.idMeal);

        });

    favouriteDetails
        .querySelector(".back-btn")
        .addEventListener("click", function() {

            showFavourites();

        });
}
function removeFavourite(id) {

    favourites = favourites.filter(function(item) {
        return item.idMeal !== id;
    });

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );

    showFavourites();
}
favourite.addEventListener("click", function() {

    if (favouritesContainer.style.display === "flex") {

        favouritesContainer.style.display = "none";

        return;
    }

    recipe.style.display = "none";
    recipeDetails.style.display = "none";

    favouritesContainer.style.display = "flex";

    showFavourites();
});