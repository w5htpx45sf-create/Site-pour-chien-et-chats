(function () {
  const form = document.getElementById('checkout-form');
  const message = document.getElementById('checkout-message');
  if (!form) return;

  async function getStripeKey() {
    const res = await fetch('http://localhost:3000/config');
    if (!res.ok) throw new Error('Configuration de paiement indisponible.');
    const data = await res.json();
    return data.publishableKey;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';

    if (!form.checkValidity()) {
      message.textContent = 'Merci de compléter tous les champs pour continuer.';
      return;
    }

    const cart = window.Cart.getCart();
    if (!cart.length) {
      message.textContent = 'Votre panier est vide. Ajoutez un produit avant de continuer.';
      return;
    }

    try {
      message.textContent = 'Préparation de votre session sécurisée…';
      const formData = Object.fromEntries(new FormData(form).entries());
      const response = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: formData, items: cart })
      });

      if (!response.ok) {
        throw new Error('Impossible de lancer le paiement pour le moment.');
      }

      const { sessionId } = await response.json();
      const stripe = Stripe(await getStripeKey());
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) message.textContent = result.error.message;
    } catch (error) {
      message.textContent = error.message;
    }
  });
})();
