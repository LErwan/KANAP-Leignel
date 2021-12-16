const cart = []; //une array


retrievItemsFromStorage()
cart.forEach(item => displayItem(item))

function retrievItemsFromStorage(){
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

    const cartItemContent = makeCartItemContent(item)
    article.appendChild(cartItemContent)
    
    displayArticle(article)
}
function makeCartItemContent(item){
    const div = document.createElement('div')
    div.classList.add('cart__item__content')

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
    div.appendChild(description)
    return div
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

