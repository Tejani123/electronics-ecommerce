const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('zenith_user', JSON.stringify(data));
                window.location.href = data.role === 'admin' ? 'admin.html' : 'index.html';
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Server error. Please try again.');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('zenith_user', JSON.stringify(data));
                window.location.href = 'index.html';
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Server error. Please try again.');
        }
    });
}