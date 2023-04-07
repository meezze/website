// import axios from 'axios';

let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

menu.onclick =() =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

let slides = document.querySelectorAll('.slide-container');
let index = 0;

function next(){
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

document.querySelectorAll('.featured-image-1').forEach(image_1 =>{
    image_1.addEventListener('click', () =>{
        var src = image_1.getAttribute('src');
        document.querySelector('.big-image-1').src = src;
    });
});

document.querySelectorAll('.featured-image-2').forEach(image_2 =>{
    image_2.addEventListener('click', () =>{
        var src = image_2.getAttribute('src');
        document.querySelector('.big-image-2').src = src;
    });
});

document.querySelectorAll('.featured-image-3').forEach(image_3 =>{
    image_3.addEventListener('click', () =>{
        var src = image_3.getAttribute('src');
        document.querySelector('.big-image-3').src = src;
    });
});

document.addEventListener('DOMContentLoaded', function() {
  var addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  var cartOverlay = document.querySelector('.cart-overlay');
  var cart = document.querySelector('.cart');
  var btnCloseCart = document.querySelector('.btn-close-cart');
  var btnCheckout = document.querySelector('.btn-checkout');

  var orderForm = document.querySelector('.order-form');
  orderForm.addEventListener('submit', submitOrder);
  toggleCheckoutButtonVisibility();

  addToCartButtons.forEach(function(button) {
    button.addEventListener('click', addToCartClicked);
  });

  btnCloseCart.addEventListener('click', function() {
    cartOverlay.classList.remove('active');
    cart.classList.remove('active');
  });

  btnCheckout.addEventListener('click', function() {
    orderForm.style.display = 'block';
  });

  var cartIcon = document.querySelector('.fa-shopping-cart');
  cartIcon.addEventListener('click', openCart);
  
  function openCart() {
    cartOverlay.classList.add('active');
    cart.classList.add('active');
  }

  function addToCartClicked(event) {
    var button = event.target;
    var product = button.parentElement;
    var productId = button.getAttribute('data-id');
    var productName = button.getAttribute('data-name');
    var productPrice = button.getAttribute('data-price');
    var productImage = button.getAttribute('data-image');
    var productCategory = button.getAttribute('data-category')
    addItemToCart(productId, productName, productPrice, productImage, productCategory);
    cartOverlay.classList.add('active');
    cart.classList.add('active');
  }
  function toggleCheckoutButtonVisibility() {
    const cartItems = document.querySelectorAll('.cart-item');
    const btnCheckout = document.querySelector('.btn-checkout');
    const orderForm = document.querySelector('.order-form');
  
    if (cartItems.length > 0) {
      btnCheckout.style.display = 'block';
      btnCheckout.addEventListener('click', function() {
        if (orderForm) {
          orderForm.style.display = 'block';
        }
      });
    } else {
      btnCheckout.style.display = 'none';
      if (orderForm) {
        orderForm.style.display = 'none';
      }
    }
  }
  function addItemToCart(productId, productName, productPrice, productImage, productCategory) {
    var cartItem = document.createElement('li');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', productId);
    var sizeOptions;
    if (productCategory === 'clothes') {
      sizeOptions = `
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      `;
    } else if (productCategory === 'shoes') {
      sizeOptions = `
        <option value="36">36</option>
        <option value="37">37</option>
        <option value="38">38</option>
        <option value="39">39</option>
        <option value="40">40</option>
        <option value="41">41</option>
        <option value="42">42</option>
        <option value="43">43</option>
        <option value="44">44</option>
        <option value="45">45</option>
      `;
    }
    var cartItemContent = `
      <img src="${productImage}" class="cart-item-image" alt="${productName}">
      <span class="cart-item-name">${productName}</span>
      <span class="cart-item-price">${productPrice} лей</span>
      <select class="cart-item-size">
        ${sizeOptions}
      </select>
      <button class="btn btn-remove-item">remove</button>`;
    cartItem.innerHTML = cartItemContent;
    var cartItemsList = document.querySelector('.cart-items');
    cartItemsList.appendChild(cartItem);
    updateCartTotal();
    var removeCartItemButtons = document.querySelectorAll('.btn-remove-item');
    removeCartItemButtons.forEach(function(button) {
      button.addEventListener('click', removeCartItem);
    });
    toggleCheckoutButtonVisibility();
  }

  function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateCartTotal();
    toggleCheckoutButtonVisibility();
  }

  function updateCartTotal() {
    var cartItemPrices = document.querySelectorAll('.cart-item-price');
    var total = 0;
    cartItemPrices.forEach(function (price) {
      var priceValue = parseFloat(price.textContent.replace(' лей', ''));
      total += priceValue;
    });
    var totalElement = document.querySelector('.total-price');
    totalElement.textContent = total.toFixed(2);
  }

  async function submitOrder(event) {
    event.preventDefault();
    var orderDetails = getOrderDetails();
  
    if (!orderDetails) {
      alert('Корзина пуста');
      return;
    }
  
    var formData = new FormData(orderForm);
    var phone = formData.get('phone');
    var address = formData.get('address');
    var paymentMethod = formData.get('payment-method');
    var totalPrice = document.querySelector('.total-price').textContent;
  
    var message = `Новый заказ 📦\n\n`;
    orderDetails.forEach(function(item, index) {
      message += `Товар ${index + 1}: ${item.name}\nРазмер: ${item.size}\n[Фото товара](${item.image})\n\n`;
    });
    message += `Адрес: ${address}\nТелефон: ${phone}\nСпособ оплаты: ${paymentMethod === 'cash' ? 'Наличными' : 'Картой'}\nОбщая сумма: ${totalPrice} лей`;

    try {
      await sendTelegramMessage(message);
      alert('Заказ успешно отправлен! Мы с вами свяжемся)');
      orderForm.reset();
      orderForm.style.display = 'none'; // Закрываем форму после отправки заказа

      if (paymentMethod === 'card') {
        var telegramUrl = `https://t.me/oddtoddlers?start=send_payment_for_order`;
        window.open(telegramUrl, '_blank');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка при отправке заказа. Попробуйте еще раз.');
    }
  }

  function getOrderDetails() {
    var cartItems = document.querySelectorAll('.cart-item');
    if (!cartItems.length) return null;

    var itemsDetails = [];

    cartItems.forEach(function(cartItem) {
      var name = cartItem.querySelector('.cart-item-name').textContent;
      var image = cartItem.querySelector('.cart-item-image').src;
      var size = cartItem.querySelector('.cart-item-size').value;

      itemsDetails.push({ name, image, size });
    });

    return itemsDetails;
  }

  async function sendTelegramMessage(text) {
    var token = '6004618372:AAHEQ5E8hFTsKgvVinPlKvAEGcSCJQWmjKU';
    var chat_id = '-924751918';
    var parse_mode = 'Markdown';
    var url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
      var response = await axios.post(url, {
        chat_id,
        text,
        parse_mode,
      });

      if (response.status !== 200) {
        throw new Error('Не удалось отправить сообщение в Telegram');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
});
var modal = document.querySelector(".modal");
var modalImage = document.querySelector(".modal img");
var imgSlider = document.querySelector(".modal input[type='range']");
var closeBtn = document.querySelector(".modal .close");
 
var modal = document.querySelector(".modal");
var modalImage = document.querySelector(".modal img");
var imgSlider = document.querySelector(".modal input[type='range']");
var closeBtn = document.querySelector(".modal .close");

document.querySelectorAll(".fa.fa-eye").forEach(function (icon) {
  icon.addEventListener("click", function (event) {
    event.preventDefault();
    var productContent = this.closest(".box").querySelector(".content");
    var productImages = JSON.parse(productContent.dataset.images);
    var productName = productContent.querySelector("h3").innerText;
    var modalProductName = document.querySelector(".modal-product-name");
    modalProductName.innerText = productName;
    modalImage.src = productImages[0];
    modalImage.dataset.images = JSON.stringify(productImages);
    imgSlider.max = productImages.length;
    imgSlider.value = 1;
    modal.style.display = "block";
  });
});

closeBtn.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

imgSlider.addEventListener("input", function () {
  var productImages = JSON.parse(modalImage.dataset.images);
  var imageIndex = Math.floor(
    (this.value - 1) / (imgSlider.max / productImages.length)
  );
  modalImage.src = productImages[imageIndex];
});
function sendTelegramMessage(productName, rating) {
  const botToken = "6004618372:AAHEQ5E8hFTsKgvVinPlKvAEGcSCJQWmjKU"; // Замените на токен вашего бота
  const chatId = "-924751918"; // Замените на ваш chat_id
  const text = `Пользователь оценил продукт "${productName}" с рейтингом: ${rating} звезд`;

  fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      text
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        console.log("Сообщение успешно отправлено!");
      } else {
        console.error("Ошибка при отправке сообщения:", data.description);
      }
    })
    .catch((error) => console.error("Ошибка при отправке сообщения:", error));
}

// Добавить событие клика для всех звезд
document
  .querySelectorAll(".stars .fa-star")
  .forEach(function (star, index, starList) {
    star.addEventListener("click", function (event) {
      event.stopPropagation(); // Остановить всплытие события клика

      // Преобразовать NodeList в массив
      const starArray = Array.from(starList);

      const productId = this.closest(".box").dataset.id;

      // Проверить, был ли продукт уже оценен
      const ratedProductIds = JSON.parse(localStorage.getItem("ratedProducts")) || [];
      if (ratedProductIds.includes(productId)) {
        console.log("Вы уже оценили этот продукт.");
        return;
      }

      let rating = 0;

      // Удалить класс 'selected' со всех звезд
      starArray.forEach(function (siblingStar) {
        siblingStar.classList.remove("selected");
      });

      // Добавить класс 'selected' для выбранной звезды и всех предыдущих
      for (let i = 0; i <= index; i++) {
        starArray[i].classList.add("selected");
        rating++;
      }

      // Установить флаг 'rated' для всех звезд
      starArray.forEach((s) => (s.dataset.rated = "true"));

      // Добавить идентификатор продукта в список оцененных товаров и сохранить в localStorage
      ratedProductIds.push(productId);
      localStorage.setItem("ratedProducts", JSON.stringify(ratedProductIds));

      // Вывести рейтинг в консоль
      console.log("Rating:", rating);

      // Отправить сообщение в Телеграм
      const productName = this.closest(".content").querySelector("h3")
        .innerText;
      sendTelegramMessage(productName, rating);
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    const ratedProductIds = JSON.parse(localStorage.getItem("ratedProducts")) || [];
  
    ratedProductIds.forEach(function (id) {
      const productBox = document.querySelector(`.box[data-id="${id}"]`);
      if (productBox) {
        const stars = productBox.querySelectorAll(".stars .fa-star");
        stars.forEach((star) => {
          star.classList.add("selected");
          star.dataset.rated = "true";
        });
      }
    });
  });