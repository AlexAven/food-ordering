function app() {
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
  // Модель (Model)
  const state = {
    products,
    basket: [],
    uiState: {
      modal: { isOpen: false },
    },
  };

  // Представление (View)
  const view = {
    qtyBasketIcon: document.querySelector('.basket__count'),
    orderInfo: document.querySelector('.header__inner-products'),
    productList: document.querySelector('.products-list'),
    basketBtn: document.querySelector('.header__inner-basket'),
    referenceCard: document.querySelector('.products-list .products-card'),
    productsListContainer: document.querySelector('.products-list'),
    productsCard: document.querySelector('.products-list .products-card'),
    basketProductsCard: document.querySelector('.modal__inner-list .products-card'),
    productsBasketListContainer: document.querySelector('.modal__inner-list'),
    modalBasket: document.querySelector('.modal'),
    btnOpenModalBasket: document.querySelector('#basket'),
    btnCloseModalBasket: document.querySelector('#close-modal'),
    updateInfoBasketProducts: (basket) => {
      const itemsQty = document.querySelector('.header__inner-qty');
      const priceSum = document.querySelector('.header__inner-sum');
      view.qtyBasketIcon.textContent = basket.length;

      if (basket.length === 0) {
        itemsQty.textContent = 'Не выбрано ни одного товара';
        priceSum.textContent = '';
      } else {
        const itemsCounter = basket.reduce((acc, item) => (acc += item.count), 0);
        const sumCounter = basket
          .reduce((acc, item) => (acc += item.price * item.count), 0)
          .toLocaleString('ru-RU');
        itemsQty.textContent = pluralize(itemsCounter);
        priceSum.textContent = `на сумму ${sumCounter} ₽`;
      }
    },
    // firstBasketCard: ???
  };

  // Контроллеры (Controllers)
  const renderCard = (listProduct = []) => {
    // рендер 1 карточки товара на главной странице
    view.productsCard.remove();

    listProduct.forEach((card) => {
      const clonedCard = view.productsCard.cloneNode(true);

      const preview = clonedCard.querySelector('.products-card__preview');
      const title = clonedCard.querySelector('.products-card__title');
      const description = clonedCard.querySelector('.products-card__description');
      const price = clonedCard.querySelector('.products-card__bottom-price');

      preview.src = card.preview;
      title.textContent = card.title;
      description.textContent = card.description;
      price.textContent = `${card.price.toLocaleString('ru-RU')} ₽`;

      const addButton = clonedCard.querySelector('#add-basket');
      addButton.addEventListener('click', () => addBasketProduct(card, addButton.id));

      view.productList.append(clonedCard);
    });
  };
  renderCard(state.products);

  function addBasketProduct(card, eventId) {
    const cardInBasket = state.basket.findIndex((item) => item.id === Number(card.id));
    if (eventId === 'add-basket' || eventId === 'plus') {
      if (cardInBasket !== -1) {
        state.basket[cardInBasket].count += 1;
      } else {
        state.basket.push({
          ...card,
          count: 1,
        });
      }
    } else if (eventId === 'remove-basket') {
      state.basket.splice(cardInBasket, 1);
    } else if (eventId === 'minus') {
      state.basket[cardInBasket].count -= 1;
      if (state.basket[cardInBasket].count === 0) {
        state.basket.splice(cardInBasket, 1);
      }
    }
    renderBasketCard();
    view.updateInfoBasketProducts(state.basket);
  }

  function renderBasketCard() {
    view.basketProductsCard.remove();
    view.productsBasketListContainer.innerHTML = '';
    state.basket.forEach((card) => {
      const clonedBasketCard = view.basketProductsCard.cloneNode(true);
      const preview = clonedBasketCard.querySelector('.products-card__preview');
      const title = clonedBasketCard.querySelector('.products-card__title');
      const description = clonedBasketCard.querySelector('.products-card__description');
      const price = clonedBasketCard.querySelector('.products-card__bottom-price');
      const productQty = clonedBasketCard.querySelector('#count-product');
      const increaseQty = clonedBasketCard.querySelector('#plus');
      const decreaseQty = clonedBasketCard.querySelector('#minus');
      const removeProduct = clonedBasketCard.querySelector('#remove-basket');

      preview.src = card.preview;
      preview.setAttribute('alt', `dish-photo#${card.id}`);
      title.textContent = card.title;
      description.textContent = card.description;
      price.textContent = `${(card.price * card.count).toLocaleString('ru-RU')} ₽`;
      productQty.textContent = card.count;
      view.productsBasketListContainer.append(clonedBasketCard);

      increaseQty.addEventListener('click', (event) => addBasketProduct(card, event.target.id));
      decreaseQty.addEventListener('click', (event) => addBasketProduct(card, event.target.id));
      removeProduct.addEventListener('click', (event) => addBasketProduct(card, event.target.id));
    });
  }

  function pluralize(count) {
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
  }
  function toggleModalBsket() {
    view.modalBasket.classList.toggle('modal__active');
    state.uiState.modal.isOpen = !state.uiState.modal.isOpen;

    if (state.uiState.modal.isOpen) {
      renderBasketCard();
    }
  }

  view.btnOpenModalBasket.addEventListener('click', toggleModalBsket);
  view.btnCloseModalBasket.addEventListener('click', toggleModalBsket);
  view.updateInfoBasketProducts(state.basket);
}

app();
