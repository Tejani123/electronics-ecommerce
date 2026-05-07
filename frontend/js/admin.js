document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('zenith_user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    fetchOrders();
});

async function fetchOrders() {
    const user = JSON.parse(localStorage.getItem('zenith_user'));
    try {
        const res = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const orders = await res.json();
        renderAdminOrders(orders);
        updateStats(orders);
    } catch (err) {
        console.error('Failed to fetch orders');
    }
}

function renderAdminOrders(orders) {
    const list = document.getElementById('admin-orders-list');
    list.innerHTML = orders.map(order => `
        <tr>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <strong>${order.user.name}</strong><br>
                <small>${order.shippingDetails.phone}</small>
            </td>
            <td>
                ${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
            </td>
            <td>$${order.totalAmount.toFixed(2)}</td>
            <td>
                <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
            </td>
            <td>
                <select class="status-select" onchange="updateStatus('${order._id}', this.value)">
                    <option value="">Update Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button class="btn-delete" onclick="deleteOrder('${order._id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function updateStatus(orderId, status) {
    if (!status) return;
    const user = JSON.parse(localStorage.getItem('zenith_user'));
    try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ status })
        });
        if (res.ok) fetchOrders();
    } catch (err) {
        alert('Update failed');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Permanently delete this order?')) return;
    const user = JSON.parse(localStorage.getItem('zenith_user'));
    try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) fetchOrders();
    } catch (err) {
        alert('Delete failed');
    }
}

function updateStats(orders) {
    document.getElementById('total-orders-count').textContent = orders.length;
    const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    document.getElementById('total-revenue').textContent = `$${revenue.toFixed(2)}`;
}