//Confirmation

main()

function main() {
    function get_order_id(){
        const urlParams = new URLSearchParams(window.location.search)// stock dans variable urlParams
        return urlParams.get('orderId')//get renvoie élément précisée de l'objet
        }
        const order_id = get_order_id()
        
        afficher_order_id(order_id)
        
        function afficher_order_id(order_id){
            const orderIdElement = document.querySelector('#orderId')//selectionne id orderId
            orderIdElement.textContent = order_id //on applique un contenu (orderId)
        }
}

