let productsData = [];
let productNodes = [];

const initialProductsShown = 4;
document.querySelector(`.button-products[value="${initialProductsShown}"]`).classList.add("active");

getApiData = () => {
    fetch("https://www.mamezi.pl/praca/front/products/data.json")
        .then(response => {
            if (response.ok) {
                return response;
            }
            throw Error(response.status)
        })
        .then(response => response.json())
        .then(data => {
            productsData = data.list;
            createProduct();
        })
        .catch(error => console.log(error + " Wystąpił błąd"))
}

/* TWORZENIE PRODUKTU */

function createProduct() {

    for (i = 0; i < productsData.length; i++) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        addPromoBar(productsData[i], productDiv);
        addProductImage(productsData[i], productDiv);
        addProductPrice(productsData[i], productDiv);
        addProductName(productsData[i], productDiv);
        addProducer(productsData[i], productDiv);

        productNodes.push(productDiv);
    }

    displayProducts(initialProductsShown);
}

/* DODAJ PASEK Z PROMOCJĄ */

function addPromoBar(productData, product) {
    const promoBar = document.createElement("div");
    promoBar.classList.add("promo-bar");
    product.appendChild(promoBar);

    const quantity = document.createElement("span");
    quantity.classList.add("quantity");

    /* Nie mogłem znaleźć w pliku json liczby danego produktu w magazynie, jedynie napis typu brak towaru, więc zrobiłem to w taki sposób */

    if (productData.availability.name === "brak towaru") {
        quantity.textContent = "sztuk: 0";
    }
    else if (productData.availability.name === "ostatnia sztuka!") {
        quantity.textContent = "sztuk: 1";
    }
    else {
        quantity.textContent = "sztuk: 2";
    }
    promoBar.appendChild(quantity);

    const discount = document.createElement("span");
    discount.classList.add("discount");
    discount.textContent = "oszczędzasz:";
    promoBar.appendChild(discount);

    const discountEm = document.createElement("em");
    discountEm.textContent = `${productData.price.gross.base_float - productData.price.gross.promo_float} zł`;
    discount.appendChild(discountEm);
}

/* DODAJ ZDJĘCIE PRODUKTU */

function addProductImage(productData, product) {
    const imgWrap = document.createElement("div");
    imgWrap.classList.add("img-wrap");
    product.appendChild(imgWrap);

    const imgLink = document.createElement("a");
    imgLink.href = `${productData.url}`;
    imgWrap.appendChild(imgLink);

    img = document.createElement("img");
    img.src = `https://www.mamezi.pl/praca/front/products/upload/${productData.main_image}.png`;
    img.alt = "zdjecie produktu";
    imgLink.appendChild(img);
}

/* DODAJ CENĘ PRODUKTU */

function addProductPrice(productData, product) {
    const priceWrap = document.createElement("div");
    priceWrap.classList.add("price");
    product.appendChild(priceWrap);

    const mainPrice = document.createElement("em");
    mainPrice.classList.add("main-price");
    mainPrice.textContent = `${productData.price.gross.final_float} zł`;
    priceWrap.appendChild(mainPrice);

    const delPrice = document.createElement("del");
    delPrice.classList.add("old-price");
    delPrice.textContent = `${productData.price.gross.base_float} zł`;
    priceWrap.appendChild(delPrice);
}

/* DODAJ NAZWĘ PRODUKTU */

function addProductName(productData, product) {
    const prodName = document.createElement("a");
    prodName.href = `${productData.url}`;
    prodName.classList.add("productname");
    prodName.textContent = productData.name;
    product.appendChild(prodName);
}

/* DODAJ PRODUCENTA PRODUKTU */

function addProducer(productData, product) {
    const producer = document.createElement("div");
    producer.classList.add("producer");
    product.appendChild(producer);

    const brand = document.createElement("span");
    brand.classList.add("brand");
    brand.textContent = productData.producer.name;
    producer.appendChild(brand);
}




getApiData();




/* WYŚIETLANIE PRODUKTÓW */

function displayProducts(productsShown) {
    const productList = document.querySelector(".products");

    for (i = 0; i < productsShown; i++) {
        productList.append(productNodes[i]);
    }
}

/* ZMIANA LICZBY POKAZYWANYCH PRODUKTÓW */

const btns = document.querySelectorAll(".button-products");

btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (!e.target.classList.contains("active")) {
            let activeBtn = document.querySelector(".active");
            document.querySelector(".products").textContent = "";
            displayProducts(e.target.value);
            activeBtn.classList.remove("active");
            e.target.classList.add("active");
        }
    })
})


/* ZEGAR PROMOCJI */


const counter = document.querySelector(".promo-clock");
const hourPlaces = document.querySelectorAll(".promo-clock span");

const promo = new Date(2023, 4, 31, 20, 30, 0);

let today, promoTime, days, hours, minutes, seconds;

function displayTime() {

    today = new Date();

    if (promo > today) {
        promoTime = Math.abs(promo - today);
        days = Math.floor(promoTime / (1000 * 60 * 60 * 24));
        hours = Math.floor((promoTime / (1000 * 60 * 60)) % 24);
        minutes = Math.floor((promoTime / 1000 / 60) % 60);
        seconds = Math.floor((promoTime / 1000) % 60)

        hourPlaces[0].textContent = days;
        hourPlaces[1].textContent = hours;
        hourPlaces[2].textContent = minutes;
        hourPlaces[3].textContent = seconds;
    }
    else if (promo <= today) {
        clearInterval(init);
    }


}

const init = setInterval(displayTime, 1000);