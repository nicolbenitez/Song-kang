// ===== GENERADOR DE ESTRELLAS ANIMADAS =====
const starCount = 50;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.top = Math.random() * 100 + '%';
  star.style.left = Math.random() * 100 + '%';
  star.style.animationDuration = 1 + Math.random() * 2 + 's';
  document.body.appendChild(star);
}
