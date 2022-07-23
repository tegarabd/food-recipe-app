
initDetail()

function initDetail() {

  const url = window.location.search
  let id = url.lastIndexOf('?id=')
  id = url.substring(id + 4, id + 9)

  const nameEl = document.getElementById('detailName')
  const imgEl = document.getElementById('detailImg')
  const loveIconEl = document.createElement('div')
  const areaCategoryEl = document.getElementById('detailAreaCategory')
  const ingredientsEl = document.getElementById('detailIngredients').querySelector('tbody')
  const instructionsEl = document.getElementById('detailInstructions')
  const detailUpperFirstChild = document.querySelector('.detail__upper').querySelector('div')

  fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)
    .then(resp => resp.json())
    .then(({ meals }) => {
      const food = meals[0]

      nameEl.innerText = food.strMeal
      imgEl.src = food.strMealThumb
      areaCategoryEl.innerText = food.strArea + " | " + food.strCategory
      loveIconEl.setAttribute('id', 'detailLoveIcon')
      loveIconEl.addEventListener('click', () => {
        handleFoodToLocalStorage(food)
        loveIconEl.classList.toggle('active')
      })
      detailUpperFirstChild.appendChild(loveIconEl)

      let favFoods = localStorage.getItem('favFoods') ?? "[]"
      favFoods = JSON.parse(favFoods)
      if (favFoods.some(favFood => favFood.idMeal == food.idMeal)) loveIconEl.classList.add('active')

      for (let i = 0; i < 20; i++) {
        let ingredient = food['strIngredient' + (i + 1)]
        let measure = food['strMeasure' + (i + 1)]
        if (ingredient == "" || ingredient == null) break

        const tr = document.createElement('tr')
        const tdNo = document.createElement('td')
        const tdIngredient = document.createElement('td')
        const tdMeasure = document.createElement('td')

        tdNo.innerText = i + 1
        tdIngredient.innerText = ingredient
        tdMeasure.innerText = measure

        tr.append(tdNo, tdIngredient, tdMeasure)
        ingredientsEl.appendChild(tr)
      }

      instructionsEl.innerText = food.strInstructions
    })

}

function handleFoodToLocalStorage(food) {
  let favFoods = localStorage.getItem('favFoods') ?? "[]"
  favFoods = JSON.parse(favFoods)
  if (favFoods.some(favFood => favFood.idMeal == food.idMeal)) {
    favFoods = favFoods.filter(favFood => favFood.idMeal != food.idMeal)
  } else {
    favFoods = [...favFoods, food]
  }
  favFoods = JSON.stringify(favFoods)
  localStorage.setItem('favFoods', favFoods)
}