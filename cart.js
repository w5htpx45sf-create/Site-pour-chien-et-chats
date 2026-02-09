(function () {
  const STORAGE_KEY = 'museauplume_cart_v1';

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  }

  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: product.qty || 1,
        category: product.category || ''
      });
    }
    saveCart(cart);
    return cart;
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
    return cart;
  }

  function updateQuantity(productId, qty) {
    const quantity = Number(qty);
    const cart = getCart()
      .map((item) => item.id === productId ? { ...item, qty: quantity } : item)
      .filter((item) => item.qty > 0);
    saveCart(cart);
    return cart;
  }

  function getCartTotal() {
    return getCart().reduce((acc, item) => acc + item.price * item.qty, 0);
  }

  function getCartCount() {
    return getCart().reduce((acc, item) => acc + item.qty, 0);
  }

  window.Cart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    getCartTotal,
    getCartCount
  };
})();
