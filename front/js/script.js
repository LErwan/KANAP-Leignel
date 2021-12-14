fetch("http://localhost:3000/api/products")//il fetch des données
    .then((res) => res.json())//Applique la fonction json
    .then((data) => addProducts(data))//qd fetch a les données il appel addproducts

//Addproducts récupère les données du 1er élément
function addProducts(donnees){

    
    donnees.forEach(kanap => { // boucle sur chaque éléments du array
    
    const id = kanap._id //recupère id
    const imageUrl = kanap.imageUrl //url de l'image
    const altTxt = kanap.altTxt //alt de l'image
    const name = kanap.name //le nom
    const description = kanap.description //la description
//on peut aussi faire const{_id, imageUrl, altTxt, name, description} = kanap

    const anchor = makeAnchor(id)//création d'un anchor
    const article = document.createElement("article") //créationd'un article
    const image = makeImage(imageUrl, altTxt) //créationd'une image
    const h3 = makeH3(name) //créationd'un nom
    const p = makeParagraphe(description) //créationd'une description
    
    appendElementsToArticle(article, image, h3, p) //ajout des éléments à un article
    appendArticleToAnchor(anchor, article) //il ajoute l'article au anchor
    
    }); //Fin de la boucle
}
function appendElementsToArticle(article, image, h3, p){
    article.appendChild(image)
    article.appendChild(h3)
    article.appendChild(p)
}

function makeAnchor(id){
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id
    return anchor
}
function appendArticleToAnchor(anchor, article){//recupère élément envoyé
    const items = document.querySelector("#items") //sélectionne id items du html
    items.appendChild(anchor) //ajoute le anchor donnée dans items
    anchor.appendChild(article) //ajoute le article dans anchor
}

function makeImage(imageUrl, altTxt) { 
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

function makeH3(name){
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3
}
function makeParagraphe(description){
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}
