document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('zenith_user'));
    if (!user) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('order-total-summary').textContent = `Total: $${total.toFixed(2)}`;

    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const orderData = {
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: total,
            shippingDetails: {
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                phone: document.getElementById('phone').value
            }
        };

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                alert('Order placed successfully! We will contact you soon.');
                localStorage.removeItem('zenith_cart');
                window.location.href = 'index.html';
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (err) {
            alert('Error processing order.');
        }
    });
});