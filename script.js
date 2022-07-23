const searchInput = document.getElementById('searchInput')
const resultTitleElement = document.getElementById('searchFood__title')
const resultElement = document.getElementById('searchFood')
const featuredFoodElement = document.getElementById('featuredFood')
const refreshBtn = document.getElementById('refreshBtn')

refreshFeaturedFood()
initFavoriteFood()
eventRefreshButton()
eventSearchButton()

function initFeaturedFood(featuredFood) {

  let featuredFoodEl = []

  featuredFood.map(food => {
    const featuredFoodItem = document.createElement('div')
    const featuredFoodItemImg = document.createElement('img')
    const featuredFoodItemName = document.createElement('p')
    featuredFoodItem.classList.add('featuredFood__item')
    featuredFoodItemImg.classList.add('featuredFood__item__img')
    featuredFoodItemName.classList.add('featuredFood__item__name')

    featuredFoodItemImg.src = food.strMealThumb + '/preview'
    featuredFoodItemImg.onerror = () => { featuredFoodItemImg.src = food.strMealThumb }
    featuredFoodItemName.innerText = food.strMeal.substring(0, Math.min(18, food.strMeal.length))
    featuredFoodItemName.innerText = (food.strMeal.length > 18) ? featuredFoodItemName.innerText += '...' : featuredFoodItemName.innerText
    let currLocation = window.location.href.replace('/index.html', '')
    featuredFoodItem.addEventListener('click', () => window.location.href = currLocation + '/detail.html?id=' + food.idMeal)

    featuredFoodItem.append(featuredFoodItemImg, featuredFoodItemName)
    featuredFoodEl.push(featuredFoodItem)
  })
  featuredFoodElement.classList.remove('loading')
  featuredFoodElement.replaceChildren(...featuredFoodEl)
}

function initFavoriteFood() {
  const favoriteFoodElement = document.getElementById('favoriteFood')
  let favoriteFoods = []
  let favoriteFoodsElement = []
  favoriteFoods = localStorage.getItem('favFoods')

  if (!favoriteFoods) {
    favoriteFoodElement.replaceChildren(errorMessage("You don't have any favorite food yet..."))
    return
  }

  favoriteFoods = JSON.parse(favoriteFoods)

  favoriteFoods.map(favFood => {
    const favoriteFoodItem = document.createElement('div')
    const favoriteFoodItemImg = document.createElement('img')
    const favoriteFoodItemName = document.createElement('p')
    favoriteFoodItem.classList.add('favoriteFood__item')
    favoriteFoodItemImg.classList.add('favoriteFood__item__img')
    favoriteFoodItemName.classList.add('favoriteFood__item__name')
    favoriteFoodItemImg.src = favFood.strMealThumb + '/preview'
    favoriteFoodItemImg.onerror = () => { favoriteFoodItemImg.src = favFood.strMealThumb }
    favoriteFoodItemName.innerText = favFood.strMeal.substring(0, Math.min(30, favFood.strMeal.length))
    favoriteFoodItemName.innerText = (favFood.strMeal.length > 30) ? favoriteFoodItemName.innerText += '...' : favoriteFoodItemName.innerText
    favoriteFoodItem.append(favoriteFoodItemImg, favoriteFoodItemName)
    let currLocation = window.location.href.replace('/index.html', '')
    favoriteFoodItem.addEventListener('click', () => window.location.href = currLocation + '/detail.html?id=' + favFood.idMeal)
    favoriteFoodsElement.push(favoriteFoodItem)
  })

  favoriteFoodElement.replaceChildren(...favoriteFoodsElement)
}

function refreshFeaturedFood(force = false) {
  let featuredFoodPromises = []

  let featuredFood = localStorage.getItem('featuredFoods')
  if (featuredFood != null && !force) {
    initFeaturedFood(JSON.parse(featuredFood))
    return
  }

  for (let i = 0; i < 10; i++) {
    featuredFoodPromises.push(fetch('https://www.themealdb.com/api/json/v1/1/random.php'))
  }

  Promise.all(featuredFoodPromises)
    .then(values => {
      return Promise.all(values.map(resp => resp.json()))
    })
    .then(values => {
      const featuredFood = Array.from(values.map(({ meals }) => meals[0]))
      localStorage.setItem('featuredFoods', JSON.stringify(featuredFood))
      initFeaturedFood(featuredFood)
    })

}

function eventRefreshButton() {
  const loadingImg = loadingImgEl()
  refreshBtn.addEventListener('click', () => {
    featuredFoodElement.classList.add('loading')
    featuredFoodElement.replaceChildren(loadingImg)
    refreshFeaturedFood(true)
  })
}

function loadingImgEl() {
  const loadingImg = document.createElement('img')
  loadingImg.src = './assets/gif/loading.gif'
  loadingImg.width = 150
  loadingImg.height = 150
  return loadingImg
}

function eventSearchButton() {

  searchInput.addEventListener('input', ({ target }) => {
    if (target.value.length > 0) {
      resultTitleElement.innerText = 'Result for ' + target.value
      resultTitleElement.classList.add('active')
      resultElement.classList.add('active')
      resultElement.classList.add('loading')
      resultElement.replaceChildren(loadingImgEl())
      updateSearchResut(target.value)
    } else {
      resultTitleElement.classList.remove('active')
      resultElement.classList.remove('active')
      resultElement.replaceChildren()
    }
  })
}

function errorMessage(message) {
  const errmsg = document.createElement('h4')
  errmsg.innerText = message
  errmsg.classList.add('errorMsg')
  return errmsg
}

function updateSearchResut(query) {
  let itemsElement = []
  fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + query)
    .then(resp => resp.json())
    .then(({ meals }) => {

      if (!meals) resultElement.replaceChildren(errorMessage("Search not found"))

      meals.map(meal => {
        const item = document.createElement('div')
        const img = document.createElement('img')
        const name = document.createElement('p')
        item.classList.add('searchFood__item')
        img.classList.add('searchFood__item__img')
        name.classList.add('searchFood__item__name')
        img.src = meal.strMealThumb + '/preview'
        name.innerText = meal.strMeal
        item.append(img, name)
        let currLocation = window.location.href.replace('/index.html', '')
        item.addEventListener('click', () => window.location.href = currLocation + '/detail.html?id=' + meal.idMeal)
        itemsElement.push(item)
      })

      resultElement.classList.remove('loading')
      resultElement.replaceChildren(...itemsElement)

    })
}
