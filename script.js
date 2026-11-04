document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCartState = document.getElementById('emptyCart');
    const itemCountBadge = document.getElementById('itemCount');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shippingCost');
    const totalEl = document.getElementById('total');
    const discountRow = document.getElementById('discountRow');
    const discountPercentageEl = document.getElementById('discountPercentage');
    const discountAmountEl = document.getElementById('discountAmount');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const shopNowBtn = document.getElementById('shopNowBtn');
    const promoInput = document.getElementById('promoInput');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoMessage = document.getElementById('promoMessage');
    const checkoutBtn = document.getElementById('checkoutBtn');

    let appliedDiscount = 0; // percentage discount (e.g. 15 for 15%)

    // Recalculate totals, counts, and UI states
    function updateCart() {
        const currentCartItems = document.querySelectorAll('.cart-item');
        let totalItemsCount = 0;
        let subtotal = 0;

        currentCartItems.forEach((item) => {
            const quantity = parseInt(item.querySelector('.quantity').textContent, 10);
            const priceText = item.querySelector('.item-price-desktop') || item.querySelector('.item-price-mobile');
            // Support both desktop and mobile price layout extraction safely
            const rawPrice = item.querySelector('.item-price-desktop') ? 
                             item.querySelector('.item-price-desktop').textContent : 
                             item.querySelector('.item-price-mobile').textContent;
            
            const price = parseFloat(rawPrice.replace('$', ''));
            const itemTotal = quantity * price;

            item.querySelector('.item-total').textContent = `$${itemTotal.toFixed(2)}`;
            totalItemsCount += quantity;
            subtotal += itemTotal;
        });

        const shipping = subtotal > 0 ? 10.0 : 0.0;
        const discountAmountValue = (subtotal * appliedDiscount) / 100;
        const total = Math.max(0, subtotal + shipping - discountAmountValue);

        const uniqueItemsCount = currentCartItems.length;

        // Handle Empty vs Filled Cart States
        if (uniqueItemsCount === 0) {
            emptyCartState.style.display = 'flex';
            cartItemsContainer.style.display = 'none';
            cartSummary.style.display = 'none';
        } else {
            emptyCartState.style.display = 'none';
            cartItemsContainer.style.display = 'flex';
            cartSummary.style.display = 'block';
        }

        // Update Summary Visuals
        itemCountBadge.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'}`;
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;

        if (appliedDiscount > 0) {
            discountRow.style.display = 'flex';
            discountPercentageEl.textContent = appliedDiscount;
            discountAmountEl.textContent = `-$${discountAmountValue.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }

        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // Event Delegation for Quantity Adjustments and Item Removal
    cartItemsContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.cart-item');
        if (!item) return;

        const quantityEl = item.querySelector('.quantity');
        let quantity = parseInt(quantityEl.textContent, 10);

        // Handle Quantity Buttons
        const qtyBtn = e.target.closest('.qty-btn');
        if (qtyBtn) {
            const action = qtyBtn.dataset.action;
            if (action === 'increase') {
                quantity++;
            } else if (action === 'decrease' && quantity > 1) {
                quantity--;
            }
            quantityEl.textContent = quantity;
            updateCart();
        }

        // Handle Remove Button
        const removeBtn = e.target.closest('.remove-btn');
        if (removeBtn) {
            item.style.transform = 'scale(0.95)';
            item.style.opacity = '0';
            setTimeout(() => {
                item.remove();
                updateCart();
            }, 200);
        }
    });

    // Clear entire cart action
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your shopping cart?')) {
            cartItemsContainer.innerHTML = '';
            updateCart();
        }
    });

    // Shop Now simulation button for empty state
    shopNowBtn.addEventListener('click', () => {
        alert('Redirecting to store catalog...');
    });

    // Promo code handler
    applyPromoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'SAVE15') {
            appliedDiscount = 15;
            promoMessage.textContent = 'Promo code "SAVE15" applied successfully (15% OFF)!';
            promoMessage.className = 'promo-message success';
            updateCart();
        } else if (code === '') {
            promoMessage.textContent = 'Please enter a valid promo code.';
            promoMessage.className = 'promo-message error';
        } else {
            appliedDiscount = 0;
            promoMessage.textContent = 'Invalid or expired promo code.';
            promoMessage.className = 'promo-message error';
            updateCart();
        }
    });

    // Checkout button handler
    checkoutBtn.addEventListener('click', () => {
        checkoutBtn.textContent = 'Processing Secure Checkout...';
        checkoutBtn.style.opacity = '0.8';
        checkoutBtn.disabled = true;

        setTimeout(() => {
            alert('Order successfully placed! Thank you for your purchase.');
            cartItemsContainer.innerHTML = '';
            updateCart();
            checkoutBtn.textContent = 'Proceed to Checkout';
            checkoutBtn.style.opacity = '1';
            checkoutBtn.disabled = false;
            promoInput.value = '';
            promoMessage.textContent = '';
            appliedDiscount = 0;
        }, 1200);
    });

    // Initial run on script execution
    updateCart();
});
