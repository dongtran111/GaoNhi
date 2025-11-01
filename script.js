document.querySelectorAll('.project-item').forEach(item => {
  // Tạo nút view icon
  const btn = document.createElement('button');
  btn.innerHTML = '<img src="images/view-icon.png" alt="view icon">';
  btn.className = 'view-button';
  btn.addEventListener('click', e => {
    e.stopPropagation(); // không cho click tràn lên item
    window.location.href = item.dataset.link; // đi đến link khi bấm nút view
  });
  item.appendChild(btn);

  // Khi click vào project-item
  item.addEventListener('click', () => {
    // Bỏ active khỏi item khác
    document.querySelectorAll('.project-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Đi đến trang chi tiết
    window.location.href = item.dataset.link;
  });
});

const floatingImg = document.querySelector('.floating-image');
const leftContent = document.querySelector('.left-content');

if (floatingImg && leftContent) {
  const maxRadius = 220;
  let t = 0;

  // Vị trí hiện tại và mục tiêu
  let x = 0, y = 0;
  let targetX = 0, targetY = 0;

  // Thông số lắc chuông
  const swingAmplitude = 20;  // góc lắc tối đa
  const swingSpeed = 2;       // tốc độ lắc

  function animateFloating() {
    t += 0.03; // ⚡ nhanh gấp đôi so với trước (0.02 → 0.04)

    // ---- Chuyển động trôi nhanh hơn ----
    targetX = Math.cos(t * 1.5) * 90 + Math.sin(t * 0.4) * 120;
    targetY = Math.sin(t * 1.7) * 70 + Math.cos(t * 0.6) * 100;

    // Thêm nhiễu nhỏ tự nhiên
    targetX += (Math.random() - 0.5) * 3;
    targetY += (Math.random() - 0.5) * 3;

    // Giảm smoothing để phản ứng nhanh hơn (0.05 → 0.08)
    x += (targetX - x) * 0.08;
    y += (targetY - y) * 0.08;

    // ---- Lắc đều liên tục ----
    const rotation = Math.sin(t * swingSpeed) * swingAmplitude;

    // ---- Áp dụng transform ----
    floatingImg.style.transform = `
      translate(calc(-50% + ${x}px), calc(-50% + ${y}px))
      rotate(${rotation}deg)
    `;

    requestAnimationFrame(animateFloating);
  }

  animateFloating();
}

// Ẩn floating-image khi hover vào project-item
document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    floatingImg.style.opacity = '0';
  });
  item.addEventListener('mouseleave', () => {
    floatingImg.style.opacity = '1';
  });
});

const previewContainer = document.querySelector('.preview-container');

const projectImages = {
  "143DRESS": [
    "images/works/143dress_1.png",
    "images/works/143dress_2.jpg",
  ],
  "MARRY EM": [
    "images/works/marry_em.png",
  ],
  "NHI'S IPHONE": [
    "images/works/nhi_iphone_1.jpg",
    "images/works/nhi_iphone_2.jpg",
  ],
  "RESCUING ORCHIDS": [
    "images/works/rescuing_orchids.png",
  ],
  "VI SON": [
    "images/works/vi_son.jpg",
  ],
  "MEDITATION": [
    "images/works/meditation.jpg",
  ],
  "AO THAT": [
    "images/works/ao_that.jpg",
  ],
  "WASH": [
    "images/works/wash.png",
  ],
  "BORDER": [
    "images/works/border.png",
  ],
  "BREATHING SOIL": [
    "images/works/breathing_soil.jpg",
  ],
  "TRAN KHUYET": [
    "images/works/tran_khuyet.jpg",
  ],
  "NEW BACKSTAGE": [
    "images/works/new_backstage.jpg",
  ],
  "THE GEM": [
    "images/works/the_gem_2.png",
  ],
  "FAMILY ALBUM": [
    "images/works/family_album.jpg",
  ],
};

document.querySelectorAll('.project-item').forEach(item => {
  const title = item.querySelector('.project-info span:nth-child(2)')?.textContent.trim();

  item.addEventListener('mouseenter', () => {
    floatingImg.style.opacity = '0';
    previewContainer.innerHTML = '';

    const containerRect = previewContainer.getBoundingClientRect();
    const W = containerRect.width;
    const H = containerRect.height;
    const margin = 0.1 * W; // tránh biên
    const minGap = 0.4 * W; // khoảng cách tối thiểu giữa ảnh

    if (projectImages[title]) {
      const nodes = [];
      const imgs = projectImages[title];
      const reduceSize = imgs.length > 2; // nếu >2 ảnh thì giảm size

      // 1️⃣ random ban đầu
      imgs.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;

        let sizePercent;
        if (imgs.length === 1) {
          sizePercent = 50; // ✅ chỉ 1 ảnh → to 80%
        } else {
          sizePercent = 25 + Math.random() * 10; // bình thường
          if (reduceSize) sizePercent -= 10; // nếu >3 ảnh → nhỏ đi 10%
        }

        const w = (W * sizePercent) / 100;
        const h = w * 0.75;

        const x = margin + Math.random() * (W - 2 * margin - w);
        const y = margin + Math.random() * (H - 2 * margin - h);

        const node = { img, w, h, x, y, vx: 0, vy: 0 };
        const angle = (Math.random() * 16 - 8) + 'deg';
        img.style.width = `${sizePercent}%`;
        img.style.setProperty('--angle', angle);

        previewContainer.appendChild(img);
        nodes.push(node);
      });

      // 2️⃣ Relaxing collision – đẩy ảnh ra cho tới khi không đè
      for (let step = 0; step < 500; step++) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = (a.x + a.w / 2) - (b.x + b.w / 2);
            const dy = (a.y + a.h / 2) - (b.y + b.h / 2);
            const dist = Math.hypot(dx, dy);
            const minDist = (a.w + b.w) / 2 + minGap * 0.5;

            if (dist < minDist) {
              const overlap = (minDist - dist) / 2;
              const nx = dx / dist || (Math.random() - 0.5);
              const ny = dy / dist || (Math.random() - 0.5);
              a.x += nx * overlap;
              a.y += ny * overlap;
              b.x -= nx * overlap;
              b.y -= ny * overlap;
            }
          }

          // ép không ra khỏi biên
          nodes[i].x = Math.max(margin, Math.min(W - margin - nodes[i].w, nodes[i].x));
          nodes[i].y = Math.max(margin, Math.min(H - margin - nodes[i].h, nodes[i].y));
        }
      }

      // 3️⃣ render kết quả
      nodes.forEach((n, i) => {
        n.img.style.left = `${(n.x / W) * 100}%`;
        n.img.style.top = `${(n.y / H) * 100}%`;
        setTimeout(() => n.img.classList.add('show'), i * 150);
      });
    }
  });

  item.addEventListener('mouseleave', () => {
    previewContainer.querySelectorAll('img').forEach((img, i) => {
      setTimeout(() => img.classList.remove('show'), i * 100);
    });
    floatingImg.style.opacity = '1';
  });
});

// === Move & toggle contact-info depending on screen size ===
function moveContactInfo() {
  const contactInfo = document.querySelector('.contact-info');
  const header = document.querySelector('header');
  const bio = document.querySelector('.bio');

  if (!contactInfo || !header || !bio) return;

  if (window.innerWidth <= 768) {
    // Đưa contact-info vào header (chồng lên bio)
    if (!header.contains(contactInfo)) {
      header.appendChild(contactInfo);
    }

    Object.assign(contactInfo.style, {
      position: 'absolute',
      top: '27%',
      left: '52%',
      transform: 'translateX(-50%)',
      bottom: 'auto',
      zIndex: '15',
      flexDirection: 'column',
      alignItems: 'left',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.4s ease',
    });

    bio.style.opacity = '1';
    bio.style.pointerEvents = 'auto';
    bio.style.transition = 'opacity 0.4s ease';
  } else {
    // Trả về layout gốc (desktop)
    const leftContent = document.querySelector('.left-content');
    if (leftContent && !leftContent.contains(contactInfo)) {
      leftContent.appendChild(contactInfo);
    }

    Object.assign(contactInfo.style, {
      position: 'fixed',
      bottom: '1.5vw',
      left: '3vw',
      transform: 'none',
      top: 'auto',
      zIndex: '10',
      flexDirection: 'row',
      alignItems: 'flex-start',
      opacity: '1',
      pointerEvents: 'auto',
    });

    bio.style.opacity = '1';
    bio.style.pointerEvents = 'auto';
  }
}

window.addEventListener('resize', moveContactInfo);
window.addEventListener('load', moveContactInfo);

// === Mobile toggle: show/hide bio vs contact-info ===
document.addEventListener('DOMContentLoaded', () => {
  const aboutBtn = document.querySelector('.mobile-btn[href="#about"]');
  const contactBtn = document.querySelector('.mobile-btn[href="#contact"]');
  const bio = document.querySelector('.bio');
  const contactInfo = document.querySelector('.contact-info');

  if (!aboutBtn || !contactBtn || !bio || !contactInfo) return;

  // 👉 Khi vào trang mobile, mặc định About được active
  if (window.innerWidth <= 768) {
    aboutBtn.classList.add('active');
    bio.style.opacity = '1';
    bio.style.pointerEvents = 'auto';
    contactInfo.style.opacity = '0';
    contactInfo.style.pointerEvents = 'none';
  }

  aboutBtn.addEventListener('click', e => {
    e.preventDefault();
    bio.style.opacity = '1';
    bio.style.pointerEvents = 'auto';
    contactInfo.style.opacity = '0';
    contactInfo.style.pointerEvents = 'none';

    aboutBtn.classList.add('active');
    contactBtn.classList.remove('active');
  });

  contactBtn.addEventListener('click', e => {
    e.preventDefault();
    contactInfo.style.opacity = '1';
    contactInfo.style.pointerEvents = 'auto';
    bio.style.opacity = '0';
    bio.style.pointerEvents = 'none';

    contactBtn.classList.add('active');
    aboutBtn.classList.remove('active');
  });
});
