// dynamicGradients2.js
function updateGradient2() {
    const body = document.body;
    let time = new Date().getTime() * 0.0005;
  
    let positions = [
      `${50 + 10 * Math.cos(time)}% 50%`,
      `${50 + 10 * Math.cos(time + 1)}% 50%`,
      `${50 + 10 * Math.cos(time + 2)}% 50%`,
      `${50 + 10 * Math.cos(time + 3)}% 50%`,
      `${50 + 10 * Math.cos(time + 4)}% 50%`
    ];
  
    body.style.background = positions.map((pos, index) => 
      `radial-gradient(circle at ${pos}, ${gradientColors[index]} 30%, transparent 30%)`
    ).join(', ');
  
    requestAnimationFrame(updateGradient2);
  }
  document.addEventListener('DOMContentLoaded', updateGradient2);
  