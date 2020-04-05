fetch('/check-login')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'error') {
            location.href = 'index.html';
        } else {
            document.getElementById('userName').innerText = `Halo ${data.user.name}`;

            if (data.user.role === 'admin') {
                document.getElementById('navEditProfile').classList.add('d-none');
                document.getElementById('navListUsers').classList.remove('d-none');
                document.getElementById('navAddProduct').classList.add('d-none');
            } else {
                document.getElementById('navEditProfile').classList.remove('d-none');
                document.getElementById('navListUsers').classList.add('d-none');
                document.getElementById('navAddProduct').classList.remove('d-none');
            }

            const event = new CustomEvent('user-ready', {
                bubbles: true,
                detail: {
                    user: data.user,
                },
            });

            document.dispatchEvent(event);
        }
    })
    .catch(error => console.log(error));