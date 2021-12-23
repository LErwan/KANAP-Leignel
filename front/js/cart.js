const cart = [] //une array

get_elements_of_storage()
cart.forEach(item => afficher_item(item))

function get_elements_of_storage(){
    const items_number = localStorage.length
    for(let i = 0; i < items_number; i++){ //tant que i < taille du storage i augmente
        const item = localStorage.getItem(localStorage.key(i))//local storage récupère key
        const item_object = JSON.parse(item) //on transforme item(string) en objet via parse
        cart.push(item_object)//Qd on a un objet on le push dans la var cart
    }
}

function afficher_item(item){ //fonction qui affiche les items
    const article = create_article(item)
    const image_div = create_image_div(item)
    article.appendChild(image_div)
    const card_item_content = create_cart_content(item)
    article.appendChild(card_item_content)
    afficher_article(article)
    afficher_total_price()
    afficher_total_quantity()
}

function create_article(item){
    const article = document.createElement('article') //création élément article
    article.classList.add('cart__item') //ajout de la classe item à article
    article.dataset.id = item.id //data set = ajout d'élément html pour data-id
    article.dataset.color = item.color
    return article
}

function afficher_article(article){ //fonction pour mettre article dans la page
    document.querySelector('#cart__items').appendChild(article)
}

function create_image_div(item){
    const image_div = document.createElement("div") //Création d'une div
    image_div.classList.add('cart__item__img') //ajout d'une classe
    
    //contenu de la div
    const image = document.createElement('img') //Création élément img
    image.src = item.imageUrl //ajout src
    image.alt = item.altTxt //ajout alt
    image_div.appendChild(image) //donne à la div enfant image
    return image_div
}

//Cette fonction contient 2 fonctions
function create_cart_content(item){ //classe qui va contenir description et settings
    const cart_item_content = document.createElement('div') //création d'un élément div
    cart_item_content.classList.add('cart__item__content') //ajout du nom de classe

    const description = create_description(item) //fonctions dans variables
    const settings = create_settings(item)

    cart_item_content.appendChild(description)//ajout enfant description a la classe cart__item__content
    cart_item_content.appendChild(settings)
    return cart_item_content
}
//1ère fonction: description
function create_description(item){
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

//2nde fonction: description
function create_settings(item){
    const settings = document.createElement('div')
    settings.classList.add('cart__item__content__settings')

    add_quantity_to_settings(settings, item)
    add_remove_to_settings(settings, item)
    return settings
}
function add_quantity_to_settings(settings, item){
    const quantity = document.createElement('div')
    quantity.classList.add('cart__item__content__settings__quantity')
    const p = document.createElement('p')
    p.textContent = "Qté : "
    quantity.appendChild(p)
    const input = document.createElement('input')//création input
    input.type = "number" //de type number
    input.classList.add('itemQuantity')
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity //version par défaut
    input.addEventListener('input', () => new_price_and_quantity(item.id, input.value, item)) //quand on clique on l'envoie dans new_price_and..

    quantity.appendChild(input)
    settings.appendChild(quantity)
}
function new_price_and_quantity(id, new_value, item){
    const item_change = cart.find((item) => item.id === id) //dans cart on on cherche item dont id correspond
    item_change.quantity = Number(new_value) //nouvelle valeur sous forme number
    item.quantity = item_change.quantity //on met dans item.quantity la nouvelle valeur
    afficher_total_quantity() //prend new valeur de cart qui vient d'être changé
    afficher_total_price()
    save_new_data_in_cache(item)
}

function afficher_total_quantity(){
    let total = 0;
    const totalQuantity = document.querySelector('#totalQuantity')
    cart.forEach(item => {
        const total_quantity_by_unit = item.quantity
        total += total_quantity_by_unit //incrémentation de total_q_by_unit au total
    })
    totalQuantity.textContent = total
}
function afficher_total_price(){
    let total = 0;
    const totalPrice = document.querySelector('#totalPrice')//selectionne id totalPrice
    cart.forEach(item => { //boucle
        const total_price_by_unit = item.price * item.quantity
        total += total_price_by_unit
    })
    totalPrice.textContent = total
}
function save_new_data_in_cache(item){
    const data_to_save = JSON.stringify(item) //stringify sinon affiche object
    const key = `${item.id}-${item.color}`
    localStorage.setItem(key, data_to_save)//nouvelle donnée au localstorage
}

function add_remove_to_settings(settings, item){ //fonction  pour suuprimer article
    const div = document.createElement('div')
    div.classList.add('cart__item__content__settings__delete')
    div.addEventListener("click", () =>  delete_item(item))//clique = application de la fonction 
    const p = document.createElement('p')
    p.classList.add('deleteItem')
    p.textContent = 'Supprimer'
    div.appendChild(p)
    settings.appendChild(div)
}
function delete_item(item){
    const item_to_delete = cart.findIndex(
    (product) => product.id === item.id && product.color == item.color
    )//trouver le produit dont l'id est = au id de l'item et que couleur corresponde
    cart.splice(item_to_delete, 1 ) //splice modifie contenu d'un tableau
    afficher_total_price()
    afficher_total_quantity()
    remove_data_from_cache(item)
    remove_article_from_page(item)
}
function remove_data_from_cache(item){ //fonction pour retirer la clé du storage
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

function remove_article_from_page(item){ //on récupère l'article pour le supprimer aussi
    const article_to_delete = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`)
    article_to_delete.remove() //on remove l'article donnée dans la variable article_to_delet
}



                    //**************FORMULAIRE******************//


const orderButton = document.querySelector("#order") //sélectionne id order
orderButton.addEventListener("click", (e) => submitForm(e)) //ajout event click

function submitForm(e){
    e.preventDefault() //bloque le comportement de l'événement e par défaut
    if (cart.length === 0) { //si aucun élément dans cart alors...
        alert("Veuillez choisir des articles") //...affichage d'une message
        return //on stop
    }

    if (first_name_not_valid() == true) {
        return
    }
    if (last_name_not_valid() == true) {
        return
    }
    if (address_not_valid() == true) {
        return
    }
    if (city_not_valid() == true) {
        return
    }
    if (email_not_valid() == true) {
        return
    }
    
    const body = make_request()


    fetch("http://localhost:3000/api/products/order", {
        method: "POST", //on donne la méthode qui n'est pas get mais post
        body: JSON.stringify(body), //stringify body
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => { //qd il a le data
        const orderId = data.orderId //on met le orderId renvoyé dans une const
        window.location.href = "./confirmation.html" + "?orderId=" + orderId //sert à acceder à la page html confirmation avec orderId
        return
    })
    .catch((err) => console.log(err))
}

function make_request(){ //obtenir les éléments
    const form = document.querySelector(".cart__order__form")//on sélectionne le form
    //on va récupérer les éléments dans form
    const firstName = form.elements.firstName.value //dans la variable on a la value du firstname dans les éléments du formulaire 
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value
    const body = { 
        contact : { //objet contact qui contient les informations
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products: take_ids_of_cache() 
    }
    console.log(body)
    return body
}

function take_ids_of_cache(){ //fonction pour récupérer les id du storage
    const number_of_products = localStorage.length //taille loalStorage dans variable
    const ids = []//quand on console.log on id dans tableau
    for (let i = 0; i < number_of_products; ++i){ //pour i< taille du  localStorage on incrémente
        const key = localStorage.key(i)//variable key récupère la clé  du localeStorage
        const id = key.split("-")[0] //split créer un array couper en 2 par le - coté gauche id et droit couleur [0]=1ere valeur
        ids.push(id) //on prend id qu'on met dans ids[]
    }
    return ids
}


function first_name_not_valid(){
    const firstName = document.querySelector('#firstName').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[A-Za-z -]+$/
    if (regex.test(firstName) === false){
        const p = document.querySelector('#firstNameErrorMsg')
        p.textContent = "Le prénom saisi est invalide"
        return true
    }
        return false
}

function last_name_not_valid(){
    const lastName = document.querySelector('#lastName').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[A-Za-z -]+$/
    if (regex.test(lastName) === false){
        const p = document.querySelector('#lastNameErrorMsg')
        p.textContent = "Le nom saisi est invalide"
        return true
    }
        return false
}

function address_not_valid(){
    const address = document.querySelector('#address').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[0-9A-Za-z ,'-]+$/
    if (regex.test(address) === false){
        const p = document.querySelector('#addressErrorMsg')
        p.textContent = "L'adresse saisie est invalide"
        return true
    }
        return false
}

function city_not_valid(){
    const city = document.querySelector('#city').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[A-Za-z ,-]+$/
    if (regex.test(city) === false){
        const p = document.querySelector('#cityErrorMsg')
        p.textContent = "La ville saisie est invalide"
        return true
    }
        return false
}

function email_not_valid(){
    const email = document.querySelector('#email').value//on veut la valeur de l'email et non pas le email complet
    const regex = /^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z0-9.-]+[.]{1}[a-z]{2,10}$/
    if (regex.test(email) === false){
        const p = document.querySelector('#emailErrorMsg')
        p.textContent = "adresse mail invalide"
        return true
    }
        return false
}



