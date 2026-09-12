const search = document.getElementById("search-input");
const recipe = document.getElementById("recipe-card");
const recipeImage = document.getElementById("recipe-image");
const searchBtn = document.getElementById("search-btn");
const title= document.querySelector("h3");
const recipeDetails = document.getElementById("recipe-details");
const recipeImage1 = document.getElementById("recipe-image1");
const ingredients = document.getElementById("recipe-ingredients");
const instructions = document.getElementById("recipe-instructions");
const recipeTitle = document.getElementById("recipe-title");
const loading = document.getElementById("loading");
const category = document.getElementById("categories");
const filters = document.getElementById("filter");
const random =document.getElementById("random-recipe");

let meal;
let recipeName;
let response;
let result;

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
    meal = result.meals[0];
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
    recipeImage.src = meal.strMealThumb;
    title.textContent = meal.strMeal;

    recipe.style.display = "flex";
    recipeDetails.style.display = "none";
}

searchBtn.addEventListener("click", searchRecipe);
 async function searchRecipe(){
     await APIDetails();

     if(!meal){
        return;
     }
    showRecipeCard();

}

recipe.addEventListener("click", cookingDetails);
function cookingDetails(){
     ingredients.textContent="Ingredients: ";
    for(let i=1;i<=20;i++){
        const ingredient= meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if(ingredient){
            ingredients.textContent+= measure+" "+ingredient+ ", ";
        }
    }

    recipeTitle.textContent= `${meal.strMeal}`;
    recipeImage1.src=`${meal.strMealThumb}`;
    instructions.textContent = "Instructions: "+meal.strInstructions;
    recipe.style.display="none";
    recipeDetails.style.display="flex";

}

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
    catch{
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

random.addEventListener("click", randomRecipe);
async function randomRecipe() {
    loading.textContent = "Loading...";
    if(recipe.style.display==="flex")
    {
        recipe.style.display="none";
            loading.textContent = "";

        return;
    }
    loading.textContent = "Loading...";

    try{
    const surprise= await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    if(!surprise.ok){
        throw new Error("API request failed")
    }
    result = await surprise.json();

        meal = result.meals[0];

        showRecipeCard();

    } catch(error) {
        alert(error.message);
        meal = null;

    } finally {
        loading.textContent = "";
    }
}

