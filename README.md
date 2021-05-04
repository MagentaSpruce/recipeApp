# recipeApp
Recipe app project using CSS, HTML, JS & an API to load in data dynamically.

This project has helped me to better understand and practice the following:
1) Mobile first design
2) object-fit property
3) border-top-right-radius property
4) Flexbox
5) async/await
6) fetch() and retrieving data from an API using .json()
7) HTML and DOM manipulation including data insertion
8) Setting default values
9) text-overflow: ellipsis property
10) pointer-events: none property
11) 11) Working with local storage

//There are various improvements which can be made to this project, including the method of GET request and fetching, and some UI bugs like the favorites heart triggering the pop-up.


A general walkthrough of the code is provided below:

This project uses the random meal public API provided through Github to provide the app recipe content: https://www.themealdb.com/api.php

Create getRandomMeal function.
```JavaScript
async function getRandomMeal(){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    addMeal(randomMeal, true); 
}
```

Create getMealById function.
```JavaScript
async function getMealById(id){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;
}
```

Create addMeal function to add the cut HTML dynamically upon page load.
```JavaScript
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
```

Create addMealToLs, getMealsFromLS and removeMealFromLS functions.
```JavaScript
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
```

To add the new favorite to the favorite meals list, the fetchFavMeals function is created.
```JavaScript
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
```

Create addMealToFav function.
```JavaScript
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
```

Create getMealsBySearch function.
```JavaScript
async function getMealsBySearch(term){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
}
```

Create the showMealInfo function to dynamiclly fill the popup with the specified recipe content.
```JavaScript
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
```

***End walkthrough
