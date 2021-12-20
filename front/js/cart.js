const cart = []; //une array

retrieveItemsFromStorage()
cart.forEach(item => displayItem(item))

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => sumbitForm(e))

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


function displayArticle(article){ //fonction pour mettre article dans la page
    document.querySelector('#cart__items').appendChild(article)
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

function deleteDataFromCache(item){
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

function deleteArticleFromPage(item){
    const articleToDelete = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`)
    articleToDelete.remove()
}

//FORMULAIRE

function sumbitForm(e){
    e.preventDefault() //bloque le comportement de l'événement par défaut
    if (cart.length === 0) {
        alert("Veuillez choisir des articles")
        return
    }
    if (validateForm()) return
    if (validateFirstName())return
    if (validateLastName()) return
    if (validateAddress()) return
    if (validateCity()) return
    if (validateEmail()) return

    const body = makeRequestBody()
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => {
        const orderId = data.orderId
        window.location.href = "./confirmation.html" + "?orderId=" + orderId
        return console.log(data)
    })
    .catch((err) => console.log(err))
}

function validateForm(){
    const form = document.querySelector(".cart__order__form")
    const inputs = form.querySelectorAll("input")//selectionne tout les input
    inputs.forEach((input) => { //pour chaque input
        if (input.value === "") { //si value est nul
            alert("veuillez remplir tous les champs") //message indique qu'il faut remplir
            return true
        }
        return false
    })
}
function validateFirstName(){
    const firstName = document.querySelector('#firstName').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[A-Za-z -]+$/
    if (regex.test(firstName) === false){
        const p = document.querySelector('#firstNameErrorMsg')
        p.textContent = "Le prénom saisi est invalide"
        return true
    }
        return false
}
function validateLastName(){
    const lastName = document.querySelector('#lastName').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[A-Za-z -]+$/
    if (regex.test(lastName) === false){
        const p = document.querySelector('#lastNameErrorMsg')
        p.textContent = "Le nom saisi est invalide"
        return true
    }
        return false
}
function validateAddress(){
    const address = document.querySelector('#address').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[0-9]+[A-Za-z ,'-]+$/
    if (regex.test(address) === false){
        const p = document.querySelector('#addressErrorMsg')
        p.textContent = "L'adresse saisie est invalide"
        return true
    }
        return false
}
function validateCity(){
    const city = document.querySelector('#city').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[A-Za-z ,-]+$/
    if (regex.test(city) === false){
        const p = document.querySelector('#cityErrorMsg')
        p.textContent = "La ville saisie est invalide"
        return true
    }
        return false
}
function validateEmail(){
    const email = document.querySelector('#email').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z0-9.-]+[.]{1}[a-z]{2,10}$/
    if (regex.test(email) === false){
        const p = document.querySelector('#emailErrorMsg')
        p.textContent = "adresse mail invalide"
        return true
    }
        return false
}


function makeRequestBody(){
    const form = document.querySelector(".cart__order__form")
    const firstName = form.elements.firstName.value
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value
    const body = { 
        contact : {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products: getIdsFromCache()
    }
    return body
}

function getIdsFromCache(){
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; ++i){
        const key = localStorage.key(i)
        const id = key.split("-")[0] //split créer un array couper en 2 par le - coté gauche id et droit couleur [0]=1ere valeur
        ids.push(id) //on prend id qu'on met dans ids[]
    }
    return ids
}

