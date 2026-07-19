const cartContainer = document.getElementById("cart-container");
const clearCartBtn = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function calculateTotal(cart) {
    return cart.reduce((total, product) => {
        const price = parseInt(product.price.replace(/[^0-9]/g, '')) || 0;
        return total + price;
    }, 0);
}

function renderCart() {
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>კალათა ცარიელია</p>";
        return;
    }

    let html = '';

    cart.forEach((product, index) => {
        html += `
            <div class="taiguli">
                <img src="${product.img}" alt="${product.name}" style="width:200px; height:250px;">
                <h3>${product.name}</h3>
                <p>ფასი: ${product.price}</p>
                <button class="remove-btn" data-index="${index}">ამოშლა</button>
                <hr>
            </div>
        `;
    });

    const total = calculateTotal(cart);

    html += `
        <div class="cart-total">
            <h2>საერთო ჯამი: <strong>${total}₾</strong></h2>
            <button id="checkout-btn" class="checkout-btn">შეკვეთის გაფორმება</button>
        </div>
    `;

    cartContainer.innerHTML = html;
}

// ამოშლა
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("remove-btn")) {
        const index = parseInt(e.target.getAttribute("data-index"));
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
});

// Checkout
document.addEventListener("click", function(e) {
    if (e.target.id === "checkout-btn") {
        showCheckoutModal();
    }
});

function showCheckoutModal() {
    const total = calculateTotal(cart);

    const modalHTML = `
        <div id="checkout-modal" class="modal">
            <div class="modal-content">
                <h2>შეკვეთის გაფორმება</h2>
                <p><strong>საერთო თანხა: ${total}₾</strong></p>
                
                <form id="checkout-form">
                    <input type="text" id="customer-name" placeholder="სახელი და გვარი" required>
                    <input type="tel" id="customer-phone" placeholder="ტელეფონის ნომერი" required>
                    <textarea id="customer-address" placeholder="მისამართი (მიტანისთვის)" required></textarea>
                    <textarea id="customer-comment" placeholder="დამატებითი კომენტარი (სურვილისამებრ)"></textarea>
                    
                    <div class="modal-buttons">
                        <button type="button" id="close-modal">გაუქმება</button>
                        <button type="submit" class="submit-order">შეკვეთის დადასტურება</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // ფორმის გაგზავნა
    document.getElementById("checkout-form").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const order = {
            id: "ORDER-" + Date.now(),
            date: new Date().toLocaleString("ka-GE"),
            customer: {
                name: document.getElementById("customer-name").value,
                phone: document.getElementById("customer-phone").value,
                address: document.getElementById("customer-address").value,
                comment: document.getElementById("customer-comment").value
            },
            items: cart,
            total: total
        };

        // შეკვეთის შენახვა (localStorage-ში დემოსთვის)
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        alert("✅ შეკვეთა წარმატებით გაფორმდა!\n\nმალე დაგიკავშირდებით.");

        // კალათის გასუფთავება
        localStorage.removeItem("cart");
        document.getElementById("checkout-modal").remove();
        location.reload();
    });

    // გაუქმება
    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("checkout-modal").remove();
    });
}

clearCartBtn.addEventListener("click", function() {
    localStorage.removeItem("cart");
    location.reload(); 
});


renderCart();

