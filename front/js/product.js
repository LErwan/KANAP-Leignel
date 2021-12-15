const queryString = window.location.search //sert à avoir l'id
const urlParams = new URLSearchParams(queryString)

const id = urlParams.get("id")

fetch("http://localhost:3000/api/products/" + id)//adresse du produit
.then((response) => response.json())
.then((res) => handleData(res))

//Tout est à l'intérieur du fetch car fonction handleData est dans le fetch

function handleData(kanap){
    //on récupère tout les objets mis dans kanap
    const { altTxt, colors, description, imageUrl, name, price} = kanap 
    //je passe les objets dans les fonctions
    makeImage(imageUrl, altTxt)
    makeTitle(name)
    makePrice(price)
    makeDescription(description)
    makeColors(colors)
}

function makeImage(imageUrl, altTxt){
    const image = document.createElement('img')
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector('.item__img')
    parent.appendChild(image)
}

function makeTitle(name){
    const h1 = document.querySelector("#title")
    h1.textContent = name
}

function makePrice(price){
    const p = document.querySelector("#price")
    p.textContent = price
}
function makeDescription(description){
    const p = document.querySelector("#description")
    p.textContent = description
}
function makeColors(colors){
    const select = document.querySelector("#colors")
    colors.forEach(color => { //pour chaque couleur...
        const option = document.createElement("option")//il fabrique une option
        option.value = color//pour chaque option value = une couleur
        option.textContent = color//le texte contenu = la couleur
        select.appendChild(option)//on ajoute chacun d'entre eux au select
    })
}