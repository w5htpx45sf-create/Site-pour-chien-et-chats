(function () {
  function euro(value) {
    return `${value.toFixed(2).replace('.', ',')} €`;
  }

  function refreshCartCount() {
    const count = window.Cart.getCartCount();
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count;
    });
  }

  function setupAddToCartButtons() {
    document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
      button.addEventListener('click', () => {
        const product = {
          id: button.dataset.productId,
          name: button.dataset.productName,
          price: Number(button.dataset.productPrice),
          category: button.dataset.productCategory,
          qty: 1
        };
        window.Cart.addToCart(product);
        button.textContent = 'Ajouté au panier ✓';
        setTimeout(() => (button.textContent = 'Ajouter au panier'), 1400);
      });
    });
  }

  function renderCartPage() {
    const root = document.querySelector('[data-cart-root]');
    if (!root) return;

    const cart = window.Cart.getCart();
    if (cart.length === 0) {
      root.innerHTML = '<div class="card"><p>Votre panier est vide pour le moment.</p><a class="btn btn-primary" href="categories.html">Découvrir les essentiels</a></div>';
      return;
    }

    const rows = cart.map((item) => `
      <div class="cart-item card">
        <div>
          <p class="tag">${item.category || 'Essentiel'}</p>
          <h3>${item.name}</h3>
          <p class="small">${euro(item.price)} / unité</p>
        </div>
        <div class="cart-actions">
          <label>Qté
            <input type="number" min="1" value="${item.qty}" data-qty-id="${item.id}" />
          </label>
          <button class="btn btn-outline" data-remove-id="${item.id}">Retirer</button>
        </div>
        <p class="price">${euro(item.price * item.qty)}</p>
      </div>
    `).join('');

    root.innerHTML = `
      ${rows}
      <div class="card cart-summary">
        <h3>Total estimé</h3>
        <p class="price">${euro(window.Cart.getCartTotal())}</p>
        <a class="btn btn-primary" href="checkout.html">Passer au checkout</a>
      </div>
    `;

    root.querySelectorAll('[data-remove-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.Cart.removeFromCart(btn.dataset.removeId);
        renderCartPage();
      });
    });

    root.querySelectorAll('[data-qty-id]').forEach((input) => {
      input.addEventListener('change', () => {
        window.Cart.updateQuantity(input.dataset.qtyId, Number(input.value));
        renderCartPage();
      });
    });
  }

  function renderCheckoutSummary() {
    const root = document.querySelector('[data-checkout-summary]');
    if (!root) return;
    const cart = window.Cart.getCart();
    if (!cart.length) {
      root.innerHTML = '<p class="small">Votre panier est vide. <a href="cart.html">Revenir au panier</a>.</p>';
      return;
    }

    root.innerHTML = `
      ${cart.map((item) => `<p>${item.name} × ${item.qty} <strong>${euro(item.price * item.qty)}</strong></p>`).join('')}
      <hr />
      <p class="price">Total : ${euro(window.Cart.getCartTotal())}</p>
    `;
  }

  window.addEventListener('cart:updated', () => {
    refreshCartCount();
    renderCartPage();
    renderCheckoutSummary();
  });

  document.addEventListener('DOMContentLoaded', () => {
    refreshCartCount();
    setupAddToCartButtons();
    renderCartPage();
    renderCheckoutSummary();
  });
})();
