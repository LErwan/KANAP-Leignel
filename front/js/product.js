const queryString = window.location.search //sert à avoir l'id
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")
let itemPrice = 0 //let pour rendre modifiable
let imgUrl, altText //on va les passer dans le data
let itemName = "" //Ajout du name dans le storage

fetch("http://localhost:3000/api/products/" + id)//adresse du produit
.then((response) => response.json())
.then((res) => handleData(res))

//Tout est à l'intérieur du fetch car fonction handleData est dans le fetch

function handleData(kanap){
    //on récupère tout les objets mis dans kanap
    const { altTxt, colors, description, imageUrl, name, price} = kanap
    itemPrice = price //le prix récupérer va changer le prix de itemprice
    imgUrl = imageUrl
    altText = altTxt
    itemName = name
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

const button = document.querySelector("#addToCart") //sélectionne id de ajouter au panier on met dans button
    button.addEventListener("click", () => { //event quand on clique 
        const color = document.querySelector("#colors").value //renvoie les values
        const quantity = document.querySelector("#quantity").value
        if(color == null || color === "" || quantity == null || quantity == 0) { //si 1 des 2 est null alors
            alert("Veuillez sélectionner une couleur et une quantité")//affichage d'une alerte
            return //afin que ca ne stop et ne s'éxecute pas
        }
    saveCart(color, quantity)
    window.location.href = "cart.html"
})

function saveCart(color, quantity) {
    
    const data = { //fabrication d'un objet
        id: id,
        color: color,
        quantity: Number(quantity),//number entour quantity
        price: itemPrice,
        imageUrl: imgUrl,
        altTxt: altText,
        name: itemName
    }
    localStorage.setItem(id, JSON.stringify(data))//ajout dans un emplacement de stockage(clé créer, les valeurs se trouvant dans data)
    //problème d'affichage du data il affiche object il faut transformer en string grace a stringify
}