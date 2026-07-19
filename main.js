const cartButtons = document.querySelectorAll(".add-cart");

cartButtons.forEach(button => {
    button.addEventListener("click", function () {
        const product = {
            name: this.getAttribute("data-name"),
            price: this.getAttribute("data-price"),
            img: this.getAttribute("data-img")
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`${product.name} დაემატა კალათაში!`);
    });
});