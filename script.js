'use strict';
const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals')

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtn = document.getElementById('close-popup');


getRandomMeal();
fetchFavMeals();

async function getRandomMeal(){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    // console.log(randomMeal);
    addMeal(randomMeal, true);
   
}

async function getMealById(id){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;
}


async function getMealsBySearch(term){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const respData = await resp.json();
    const meals = respData.meals;

    // console.log(meals);

    return meals;
}

function addMeal(mealData, random = false) {
    console.log(mealData);
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
    <div class="meal-header">
        ${random ? `<span class="random">Random Recipe</span>` : ''}
      
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn" onclick="">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    </div>
`;
    const btn = meal.querySelector('.meal-body .fav-btn');
    btn.addEventListener('click', () => {
        if(btn.classList.contains('active')){
            removeMealLS(mealData.idMeal);
            btn.classList.remove('active');
        } else{  addMealLS(mealData.idMeal);
            btn.classList.add('active');}
            //Clean container
         
            fetchFavMeals();
        
    });
    meal.addEventListener('click', () => {
        showMealInfo(mealData);
    });


    mealsEl.appendChild(meal);
}

function addMealLS(mealId){
    const mealIds = getMealsLS();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId){
    const mealIds = getMealsLS();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealsLS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    //Clean container
    favoriteContainer.innerHTML = '';
    const mealIds = getMealsLS();

    const meals = [];
    let meal;
    for(let i=0; i< mealIds.length; i++){
        const mealId = mealIds[i];

        meal = await getMealById(mealId);
        addMealFav(meal);   
    }
}

function addMealFav(mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
    <button class="clear"><i class= "fas fa-window-close"></i></button>
`;

const btn = favMeal.querySelector('.clear');
btn.addEventListener('click', () => {
    removeMealLS(mealData.idMeal)

    fetchFavMeals();
});

favMeal.addEventListener('click', () => {
    showMealInfo(mealData);
});

 favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData){
    //clean it
    mealInfoEl.innerHTML = '';

    //update meal info
    const mealEl = document.createElement('div');

        const ingredients = [];
    //get ingredients and measurements
    for(let i = 1; i<=20; i++){
        if(mealData['strIngredient' + i]){
            ingredients.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`)

        } else{
            break;
        }
    }

    mealEl.innerHTML = `  <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">


  <p>${mealData.strInstructions}</p>
  <h3>Ingredients & Measurments:</h3>
  <ul>
    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
  </ul>`

    mealInfoEl.appendChild(mealEl);

    //show popup
    mealPopup.classList.remove('hidden');
}

searchBtn.addEventListener('click', async () => {
    // clean container
    mealsEl.innerHTML = '';
    const search = searchTerm.value;
    // console.log(await getMealsBySearch(search));
    const meals = await getMealsBySearch(search);

    if(meals){
        meals.forEach(meal => {
            addMeal(meal);
        });
    }
 
})

popupCloseBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden');
})