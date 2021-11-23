async function autoLogin() {
    const rememberToken = window.localStorage.getItem('remember_token');
    const tokenValid = rememberToken != null ? true : false;
    const formData = new FormData();

    if (tokenValid) {
        formData.append('type', 'remember_token');
        formData.append('token', rememberToken);

        await fetch('/login', {
            method: 'POST',
            body: formData
        });
    }
}