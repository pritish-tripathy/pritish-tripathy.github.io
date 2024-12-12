// script.js

document.addEventListener('DOMContentLoaded', async () => {
    const cartTableBody = document.querySelector('.cart-table tbody');
    const subtotalDisplay = document.querySelector('.totals p:first-child span:last-child');
    const totalDisplay = document.querySelector('.totals p:last-child strong');
    const checkoutButton = document.querySelector('.checkout-btn');

    // Fetch cart data from the JSON API
    let cartData;
    try {
        const response = await fetch('api.json'); // Replace with actual API path
        cartData = await response.json();
    } catch (error) {
        console.error('Error fetching cart data:', error);
        return;
    }

    // Render cart items dynamically
    function renderCartItems() {
        cartTableBody.innerHTML = ''; // Clear existing items
        let total = 0;

        cartData.items.forEach((item) => {
            const itemSubtotal = item.price * item.quantity;
            total += itemSubtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.title}" style="width: 50px; height: auto; margin-right: 10px;">
                    ${item.title}
                </td>
                <td>₹ ${item.price.toLocaleString('en-IN')}</td>
                <td>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="${item.quantity_rule.min}" step="${item.quantity_rule.increment}" data-id="${item.id}">
                </td>
                <td class="subtotal">₹ ${itemSubtotal.toLocaleString('en-IN')}</td>
                <td>
                    <button class="remove-item" data-id="${item.id}">🗑️</button>
                </td>
            `;
            cartTableBody.appendChild(row);
        });

        updateTotals(total);
    }

    // Update subtotal and total prices
    function updateTotals(total) {
        subtotalDisplay.textContent = `₹ ${total.toLocaleString('en-IN')}`;
        totalDisplay.textContent = `₹ ${total.toLocaleString('en-IN')}`;
    }

    // Handle quantity change
    cartTableBody.addEventListener('input', (event) => {
        if (event.target.classList.contains('quantity-input')) {
            const input = event.target;
            const newQuantity = parseInt(input.value);
            const itemId = input.dataset.id;

            if (isNaN(newQuantity) || newQuantity < 1) {
                input.value = 1;
                return;
            }

            const item = cartData.items.find((i) => i.id == itemId);
            item.quantity = newQuantity;

            const itemSubtotal = item.price * newQuantity;
            input.closest('tr').querySelector('.subtotal').textContent = `₹ ${itemSubtotal.toLocaleString('en-IN')}`;

            const total = cartData.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
            updateTotals(total);
        }
    });

    // Handle item removal
    cartTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const itemId = event.target.dataset.id;

            // Remove item from cartData
            cartData.items = cartData.items.filter((item) => item.id != itemId);

            // Re-render cart items
            renderCartItems();
        }
    });

    // Handle checkout button
    checkoutButton.addEventListener('click', () => {
        alert('Proceeding to checkout!');
        // Implement checkout functionality here
    });

    // Initialize the cart
    renderCartItems();
});
