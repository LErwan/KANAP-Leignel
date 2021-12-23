main()

function main(){
const url = new URLSearchParams(window.location.search) //accès à l'id (ex:'?id=107fb5b75607497b96722bda5b504926')
console.log(window.location.search) 
const id = url.get("id")//get renvoie élément précisée de l'objet
let item_price = 0 //let pour rendre modifiable
let img_url, alt_text //on va les passer dans le data
let item_name = "" 

fetch("http://localhost:3000/api/products/" + id)//page product + id du produit
.then((response) => response.json())
.then((res) => manipuler_data(res)) //fetch accède aux données et applique fonction

//Tout est à l'intérieur du fetch car fonction manipuler_ata est dans le fetch

function manipuler_data(kanap){
    //on récupère tout les éléments dans kanap
    const { altTxt, colors, description, imageUrl, name, price} = kanap
    item_price = price //le prix récupérer va changer le prix de itemprice
    img_url = imageUrl
    alt_text = altTxt
    item_name = name
    //je passe les objets dans les fonctions
    create_image(imageUrl, altTxt)
    create_title(name)
    create_price(price)
    create_description(description)
    create_colors(colors)
}
function create_image(imageUrl, altTxt){
    const image = document.createElement('img')
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector('.item__img')//img = enfant de la classe item_img
    parent.appendChild(image)//ajout de l'enfant image au parent
}
function create_title(name){
    const h1 = document.querySelector("#title")//sélectionne id title
    h1.textContent = name //ajout de contenu dans l'id (le contenu = le name)
}
function create_price(price){
    const p = document.querySelector("#price")
    p.textContent = price
}
function create_description(description){
    const p = document.querySelector("#description")
    p.textContent = description
}
function create_colors(colors){
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
        const color = document.querySelector("#colors").value //renvoie les valeurs du select
        const quantity = document.querySelector("#quantity").value//renvoie les valeurs du input
        if(color === "" || quantity == 0) { //si 1 des 2 est pas rempli alors...
            alert("Veuillez sélectionner une couleur et une quantité")//...affichage d'une alerte
            return //afin que ca ne stop et ne s'éxecute pas
        }
    keep_candq(color, quantity)//fonction keep_candq
    window.location.href = "cart.html" //on arrive sur le href cart.html
})

function keep_candq(color, quantity) {
    const key = `${id}-${color}`//key contenant id-couleur
    const data = { //objet avec tout les éléments(value) de la clé
        id: id,
        color: color,
        quantity: Number(quantity),//number entour quantity
        price: item_price,
        imageUrl: img_url,
        altTxt: alt_text,
        name: item_name
    }
    localStorage.setItem(key, JSON.stringify(data))//ajout dans un emplacement de stockage(clé créer, les valeurs se trouvant dans data)
    //problème d'affichage du data il affiche object il faut transformer en string grace a stringify
}
}