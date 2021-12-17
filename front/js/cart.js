const cart = []; //une array


retrieveItemsFromStorage()
cart.forEach(item => displayItem(item))

function retrieveItemsFromStorage(){
    const numberOfItems = localStorage.length
    for(let i = 0; i < numberOfItems; i++){ //tant que i < taille du storage i augmente
        const item = localStorage.getItem(localStorage.key(i))
        const itemObject = JSON.parse(item) //on transforme item(string) en objet via parse
        cart.push(itemObject)//Qd on a un objet on le push dans la var cart
    }
}

function displayItem(item){
    const article = makeArticle(item)
    const imageDiv = makeImageDiv(item)
    article.appendChild(imageDiv)

    const cardItemContent = makeCartContent(item)
    article.appendChild(cardItemContent)
    displayArticle(article)
    displayTotalPrice()
    displayTotalQuantity()
}


function displayTotalPrice(){
    let total = 0;
    const totalPrice = document.querySelector('#totalPrice')
    cart.forEach(item => {
        const totalUnitprice = item.price * item.quantity
        total += totalUnitprice
    })
    totalPrice.textContent = total
}

function displayTotalQuantity(){
    let total = 0;
    const totalQuantity = document.querySelector('#totalQuantity')
    cart.forEach(item => {
        const totalUnitprice = item.quantity
        total += totalUnitprice
    })
    totalQuantity.textContent = total
}

function makeCartContent(item){
    const cardItemContent = document.createElement('div')
    cardItemContent.classList.add('cart__item__content')

    const description = makeDescription(item)
    const settings = makeSettings(item)

    cardItemContent.appendChild(description)
    cardItemContent.appendChild(settings)
    return cardItemContent
}

function makeDescription(item){
    const description = document.createElement('div')
    description.classList.add('cart__item__content__description')

    const h2 = document.createElement('h2')
    h2.textContent = item.name
    const p = document.createElement('p')
    p.textContent = item.color
    const p2 = document.createElement('p')
    p2.textContent = item.price + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    return description
}


function makeSettings(item){
    const settings = document.createElement('div')
    settings.classList.add('cart__item__content__settings')

    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings, item)
    return settings
}

function addQuantityToSettings(settings, item){
    const quantity = document.createElement('div')
    quantity.classList.add('cart__item__content__settings__quantity')
    const p = document.createElement('p')
    p.textContent = "Qté : "
    quantity.appendChild(p)
    const input = document.createElement('input')
    input.type = "number"
    input.classList.add('itemQuantity')
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity //version par défaut
    input.addEventListener('input', () => newPriceAndQuantity(item.id, input.value, item)) //quand on clique on l'envoie dans newPriceand..

    quantity.appendChild(input)
    settings.appendChild(quantity)
}

function newPriceAndQuantity(id, newValue, item){
    const itemToUpdate = cart.find((item) => item.id === id) //donne l'item qui va changer
    itemToUpdate.quantity = Number(newValue)
    item.quantity = itemToUpdate.quantity
    displayTotalQuantity() //prend new valeur de cart qui voient d'être changé
    displayTotalPrice()
    saveNewDataToCache(item)
}

function saveNewDataToCache(item){
    const dataToSave = JSON.stringify(item)
    const key = `${item.id}-${item.color}`
    localStorage.setItem(key, dataToSave)
}

function addDeleteToSettings(settings, item){
    const div = document.createElement('div')
    div.classList.add('cart__item__content__settings__delete')
    div.addEventListener("click", () =>  deleteItem(item))
    const p = document.createElement('p')
    p.classList.add('deleteItem')
    p.textContent = 'Supprimer'
    div.appendChild(p)
    settings.appendChild(div)
}

function deleteItem(item){
    const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color == item.color
    )//trouver le produit dont l'id est = au id de l'item
    cart.splice(itemToDelete, 1 )
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataFromCache(item)
    deleteArticleFromPage(item)
}

function deleteArticleFromPage(item){
    const articleToDelete = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`)
    articleToDelete.remove()
}
function deleteDataFromCache(item){
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

function displayArticle(article){ //fonction pour mettre article dans la page
    document.querySelector('#cart__items').appendChild(article)
}

function makeArticle(item){
    const article = document.createElement('article') //création élément article
    article.classList.add('cart__item') //ajout de la classe item à article
    article.dataset.id = item.id //data set = ajout d'élément html pour data-id
    article.dataset.color = item.color
    return article
}

function makeImageDiv(item){
    const imageDiv = document.createElement("div") //Création d'une div
    imageDiv.classList.add('cart__item__img') //ajout d'une classe
    
    const image = document.createElement('img') //Création élément img
    image.src = item.imageUrl
    image.alt = item.altTxt
    imageDiv.appendChild(image) //donne à la div enfant image
    return imageDiv
}

