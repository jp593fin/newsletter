(function () {
  var forms = document.querySelectorAll('form[data-kit]');
  Array.prototype.forEach.call(forms, function (form) {
    var msg = form.nextElementSibling;
    var btn = form.querySelector('button');
    function say(text, isError) {
      if (!msg) return;
      msg.textContent = text;
      msg.className = 'msg' + (isError ? ' err' : '');
    }
    form.addEventListener('submit', function (ev) {
      if (!window.fetch || !window.FormData) return;
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      btn.disabled = true;
      say('Enviando…', false);
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d && d.status === 'success') {
          window.location.href = 'gracias.html';
        } else if (d && d.status === 'quarantined' && d.url) {
          // Kit pide verificar que es una persona (captcha); al pasarla, registra el contacto
          window.location.href = d.url;
        } else {
          btn.disabled = false;
          say('No pudimos registrar ese correo. Revísalo e inténtalo de nuevo.', true);
        }
      }).catch(function () {
        form.submit();
      });
    });
  });
})();
