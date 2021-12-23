main ()

function main(){
    fetch("http://localhost:3000/api/products")//il fetch des données
    .then((res) => res.json())//Applique la fonction json
    .then((data) => ajout_products(data))//qd fetch a les données il appel fonction ajout_products
    .catch((error) => { //catch en cas d'erreur, non lancement du serveur
        const productsDisplay = document.querySelector(".items") //séléctionne classe item
        productsDisplay.innerHTML = "Impossible d'afficher les produits <br> Vérifiez que le serveur soit bien lancé."
        productsDisplay.style.textAlign = "center";//éléments d'affichage
        productsDisplay.style.padding = "50px 0";
        productsDisplay.style.fontSize = "50px"
    })

//ajout_products récupère les données du 1er élément
function ajout_products(donnees){

    donnees.forEach(kanap => { // boucle sur chaque éléments du array
    //on stock tt les éléments dans des variables const
    const id = kanap._id //recupère id
    const imageUrl = kanap.imageUrl //url de l'image
    const altTxt = kanap.altTxt //alt de l'image
    const name = kanap.name //le nom
    const description = kanap.description //la description

    const ancre = create_ancre(id)//création d'une ancre
    const article = document.createElement("article") //créationd'un article
    const image = make_image(imageUrl, altTxt) //créationd'une image
    const h3 = make_h3(name) //créationd'un nom
    const p = make_paragraphe(description) //créationd'une description
    
    ajout_article_to_ancre(ancre, article) //fonction ajoute l'article a l'ancre
    ajout_elements_to_article(article, image, h3, p) //fonction ajout des éléments à article
    
    
    }); //Fin de la boucle
}
function create_ancre(id){
    const ancre = document.createElement("a")//création a
    ancre.href = "./product.html?id=" + id //ajout de l'id
    return ancre //pour renvoyer une valeur sinon bug
}
function make_image(imageUrl, altTxt) { 
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}
function make_h3(name){ //fonction création h3
    const h3 = document.createElement("h3") //création d'un élément h3
    h3.textContent = name //contient name (ex:kanap sinopé)
    h3.classList.add("productName") //ajout d'une classe
    return h3 //return
}
function make_paragraphe(description){
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}
function ajout_article_to_ancre(ancre, article){//recupère élément envoyé
    const items = document.querySelector("#items") //sélectionne id items du html
    items.appendChild(ancre) //ajoute l'ancre donnée dans items
    ancre.appendChild(article) //ajoute l' article dans l'ancre
}
function ajout_elements_to_article(article, image, h3, p){
    //ajout des enfants à l'article
    article.appendChild(image)
    article.appendChild(h3)
    article.appendChild(p)
}

}
