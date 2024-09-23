const products = [
  {
    id: 0,
    preview: './images/1.svg',
    title: 'Устрицы по рокфеллеровски',
    description: 'Значимость этих проблем настолько очевидна, что укрепление и развитие структуры',
    price: 2700,
  },
  {
    id: 1,
    preview: './images/2.svg',
    title: 'Свиные ребрышки на гриле с зеленью',
    description: 'Не следует, однако забывать, что реализация намеченных плановых',
    price: 1600,
  },
  {
    id: 2,
    preview: './images/3.svg',
    title: 'Креветки по-королевски в лимонном соке',
    description:
      'Значимость этих проблем настолько очевидна, что укрепление и развитие структуры обеспечивает широкому кругу',
    price: 1820,
  },
  {
    id: 3,
    preview: './images/1.svg',
    title: 'Устрицы по Русски',
    description: 'Устрицы по Русски',
    price: 1000,
  },
];

let basketList = [];
const qtyBasketIcon = document.querySelector('.basket__count');
const orderInfo = document.querySelector('.header__inner-products');
const productList = document.querySelector('.products-list');
const basketBtn = document.querySelector('.header__inner-basket');
const referenceCard = document.querySelector('.products-card');
const firstCard = referenceCard.cloneNode(true);
const basketOrdersList = document.querySelector('.modal__inner-list');
const referenceBasketCard = basketOrdersList.querySelector('.products-card');
const firstBasketCard = referenceBasketCard.cloneNode(true);

const wrapper = document.createElement('div');
const itemsQty = document.createElement('p');
const priceSum = document.createElement('p');

referenceCard.remove();
referenceBasketCard.remove();
for (let i = 0; i < 3; i += 1) {
  if (orderInfo.firstChild) {
    orderInfo.removeChild(orderInfo.firstChild);
  }
}

wrapper.classList.add('header__inner-wrapper');
itemsQty.classList.add('header__inner-qty');
priceSum.classList.add('header__inner-sum');
wrapper.prepend(priceSum);
wrapper.prepend(itemsQty);
orderInfo.prepend(wrapper);

const renderCard = (card) => { // рендер 1 карточки товара на главной странице
  const clonedCard = firstCard.cloneNode(true);
  const preview = clonedCard.querySelector('.products-card__preview');
  const title = clonedCard.querySelector('.products-card__title');
  const description = clonedCard.querySelector('.products-card__description');
  const price = clonedCard.querySelector('.products-card__bottom-price');

  clonedCard.id = card.id;
  preview.setAttribute('src', card.preview);
  preview.setAttribute('alt', `dish-photo#${card.id}`);
  title.textContent = card.title;
  description.textContent = card.description;
  price.textContent = `${card.price.toLocaleString('ru-RU')} ₽`;
  productList.append(clonedCard);
};

products.forEach((item) => renderCard(item)); // рендер всех карточек товара при запуске

const pluralize = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} товаров`;
  }
  if (lastDigit === 1) {
    return `${count} товар`;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} товара`;
  }
  return `${count} товаров`;
};

const renderBasketCounter = () => { // расчет общей суммы и кол-ва товара в корзине
  qtyBasketIcon.textContent = basketList.length;

  if (basketList.length === 0) {
    itemsQty.textContent = 'Не выбрано ни одного товара';
    priceSum.textContent = '';
  } else {
    const itemsCounter = basketList.reduce((acc, item) => (acc += item.count), 0);
    const sumCounter = basketList
      .reduce((acc, item) => (acc += item.price * item.count), 0)
      .toLocaleString('ru-RU');
    itemsQty.textContent = pluralize(itemsCounter);
    priceSum.textContent = `на сумму ${sumCounter} ₽`;
  }
};

const renderBasket = (cardList) => { // рендер корзины
  basketOrdersList.innerHTML = '';
  cardList.forEach((card) => {
    const clonedCard = firstBasketCard.cloneNode(true);
    const preview = clonedCard.querySelector('.products-card__preview');
    const title = clonedCard.querySelector('.products-card__title');
    const description = clonedCard.querySelector('.products-card__description');
    const price = clonedCard.querySelector('.products-card__bottom-price');
    const productQty = clonedCard.querySelector('#count-product');
    const increaseQty = clonedCard.querySelector('.card__count-plus');
    const decreaseQty = clonedCard.querySelector('.card__count-minus');
    const removeProduct = clonedCard.querySelector('.products-card__bottom-btn');

    clonedCard.id = card.id;
    preview.setAttribute('src', card.preview);
    preview.setAttribute('alt', `dish-photo#${card.id}`);
    title.textContent = card.title;
    description.textContent = card.description;
    price.textContent = `${(card.price * card.count).toLocaleString('ru-RU')} ₽`;
    productQty.textContent = card.count;
    basketOrdersList.append(clonedCard);

    increaseQty.addEventListener('click', () => {
      card.count += 1;
      renderBasket(basketList);
      renderBasketCounter();
    });
    decreaseQty.addEventListener('click', () => {
      card.count -= 1;
      if (card.count === 0) {
        basketList = basketList.filter((item) => item.id !== card.id);
      }
      renderBasket(basketList);
      renderBasketCounter();
    });
    removeProduct.addEventListener('click', () => {
      basketList = basketList.filter((item) => item.id !== card.id);
      renderBasket(basketList);
      renderBasketCounter();
    });
  });
};

const handleAddToBasket = (event) => { // клик "добавить в корзину"
  const targetCard = event.target.closest('.products-card');
  const existingCard = basketList.find((card) => card.id === Number(targetCard.id));

  if (existingCard) {
    existingCard.count += 1;
  } else {
    basketList.push({
      ...products.find((item) => item.id === Number(targetCard.id)),
      count: 1,
    });
  }
  renderBasketCounter();
  renderBasket(basketList);
};

const closeModal = () => { // закрытие модального окна
  const modal = document.querySelector('.modal');
  const closeBtn = modal.querySelector('#close-modal');
  const cards = modal.querySelectorAll('.products-card');

  cards.forEach((card) => (card.style.transition = 'none'));
  modal.style.visibility = 'hidden';
  closeBtn.removeEventListener('click', closeModal);
};

const openModal = () => { // открытие модального окна
  const modal = document.querySelector('.modal');
  const cards = modal.querySelectorAll('.products-card');
  const closeBtn = modal.querySelector('#close-modal');

  cards.forEach((card) => (card.style.transition = '0.5s'));
  modal.style.visibility = 'visible';
  closeBtn.addEventListener('click', closeModal);
};

document
  .querySelectorAll('#add-basket')
  .forEach((card) => card.addEventListener('click', handleAddToBasket)); // обработчик
basketBtn.addEventListener('click', openModal); // обработчик
renderBasketCounter(); // рендер общей суммы и кол-ва товара в корзине

// Пример объекта добавленного в корзину
// let basketList = [
//   {
//     id: 0,
//     preview: './images/1.svg',
//     title: 'Устрицы по рокфеллеровски',
//     count: 1,
//     price: 2700
//   },
// ]

// const basketList = [];
