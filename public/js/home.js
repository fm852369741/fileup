window.document.body.onload = () => {
    [...document.querySelectorAll('[data-site-name]')].map((element) => {
        element.innerHTML = `${window.location.protocol}//${window.location.hostname}/`;
    });
}