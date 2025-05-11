/*=============== SHOW MENU ===============*/

/*===== Menu Show =====*/
/* Validate if constant exists */

/*===== Hide Show =====*/
/* Validate if constant exists */

/*=============== IMAGE GALLERY ===============*/
function imgGallery() {
  const mainImg = document.querySelector('.details__img'),
  smallImg = document.querySelectorAll('.details__small-img');

  smallImg.forEach((img) => {
    img.addEventListener('click', function() {
      mainImg.src = this.src;
    });
  });
}

imgGallery();

/*=============== SWIPER CATEGORIES ===============*/
var swiperCategories = new Swiper('.categories__container', {
    spaceBetween: 24,
    loop: true,
    
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints: {
      350: {
        slidesPerView: 2,
        spaceBetween: 24,
      },  
      992: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 40,
      },
      1100: {
        slidesPerView: 6,
        spaceBetween: 24,
      },
    },
});

/*=============== SWIPER PRODUCTS ===============*/
var swiperProducts = new Swiper('.new__container', {
  spaceBetween: 24,
  loop: true,
  
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 44,
      },
      1100: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
});

/*=============== PRODUCTS TABS ===============*/
const tabs = document.querySelectorAll('[data-target]'),
  tabContent = document.querySelectorAll('[content]');

  tabs.forEach((tab) => {
    tab.addEventListener('click' , () => {
      const target = document.querySelector(tab.dataset.target);
      tabContent.forEach((tabContent) => {
        tabContent.classList.remove('active-tab');
      });

      target.classList.add('active-tab');

      tabs.forEach((tab) => {
        tab.classList.remove('active-tab');
    });

    tab.classList.add('active-tab');
  });

});


// == DOM Ready ==
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  /** =================== Wishlist =================== */
  const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');

  function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCountElement = document.getElementById('wishlist-count');
    if (wishlistCountElement) {
      wishlistCountElement.textContent = wishlist.length;
    }
  }

  addToWishlistButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const productId = this.dataset.id;
      const productTitle = this.dataset.title;
      const productPrice = this.dataset.price;
      const productImage = this.dataset.img;

      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

      const productToAdd = {
        id: productId,
        title: productTitle,
        price: productPrice,
        image: productImage
      };

      const isAlreadyInWishlist = wishlist.some(item => item.id === productId);
      if (!isAlreadyInWishlist) {
        wishlist.push(productToAdd);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${productTitle} berhasil ditambahkan ke wishlist!`);
      } else {
        alert(`${productTitle} sudah ada di wishlist!`);
      }

      updateWishlistCount();
      window.location.href = 'wishlist.html';
    });
  });

  function renderWishlist() {
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    if (!wishlistItemsContainer) return;

    const wishlistData = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlistItemsContainer.innerHTML = '';

    if (wishlistData.length === 0) {
      wishlistItemsContainer.innerHTML = '<tr><td colspan="4">Wishlist Anda kosong.</td></tr>';
      return;
    }

    wishlistData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.title}" class="wishlist__img" /></td>
        <td><h3 class="wishlist__title">${item.title}</h3></td>
        <td><span class="wishlist__price">${item.price}</span></td>
        <td><button class="table__trash" data-id="${item.id}" aria-label="Remove from Wishlist"><i class="fi fi-rs-trash"></i></button></td>
      `;
      wishlistItemsContainer.appendChild(row);
    });

    document.querySelectorAll('.table__trash').forEach(button => {
      button.addEventListener('click', function () {
        const productIdToRemove = this.dataset.id;
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter(item => item.id !== productIdToRemove);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
        updateWishlistCount();
      });
    });
  }

  renderWishlist();
  updateWishlistCount();

  /** =================== Quick View =================== */
  const quickViewButtons = document.querySelectorAll('a[href="details.html"]');
  quickViewButtons.forEach(button => {
    button.addEventListener('click', function () {
      const product = {
        title: this.dataset.title,
        brand: this.dataset.brand,
        price: this.dataset.price,
        oldPrice: this.dataset.oldPrice,
        discount: this.dataset.discount,
        description: this.dataset.description,
        image: this.dataset.image,
        image2: this.dataset.image2
      };
      localStorage.setItem('selectedProduct', JSON.stringify(product));
    });
  });

  if (window.location.pathname.includes('details.html')) {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));

    if (product) {
      document.querySelector('.details__title').textContent = product.title;
      document.querySelector('.details__brand span').textContent = product.brand;
      document.querySelector('.new__price').textContent = `$${product.price}`;
      document.querySelector('.old__price').textContent = `$${product.oldPrice}`;
      document.querySelector('.save__price').textContent = `${product.discount}% Off`;
      document.querySelector('.short__description').textContent = product.description;
      document.querySelector('.details__img').src = product.image;

      const smallImages = document.querySelectorAll('.details__small-img');
      if (smallImages.length >= 2) {
        smallImages[0].src = product.image;
        smallImages[1].src = product.image2 || product.image;
      }
    }
  }

  /** =================== Add to Cart =================== */
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function(e) {
      e.preventDefault();

      const selectedSize = document.querySelector('.size__link.active');
      const quantity = document.querySelector('.quantity').value;

      if (!selectedSize) {
        alert("Silakan pilih ukuran sebelum menambahkannya ke keranjang.");
        return;
      }

      if (quantity <= 0) {
        alert("Harap masukkan jumlah yang valid.");
        return;
      }

      const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

      if (!selectedProduct) {
        alert("Data produk tidak ditemukan.");
        return;
      }

      const product = {
        name: selectedProduct.title,
        brand: selectedProduct.brand,
        price: parseFloat(selectedProduct.price),
        oldPrice: parseFloat(selectedProduct.oldPrice),
        size: selectedSize.textContent,
        quantity: Number(quantity),
        image: selectedProduct.image
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));

      window.location.href = "cart.html";
    });
  }

  document.querySelectorAll('.size__link').forEach(size => {
    size.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.size__link').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /** =================== Cart Page =================== */
  if (window.location.pathname.includes('cart.html')) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const tbody = document.querySelector("tbody");
    const subtotalElem = document.querySelector(".cart-subtotal");
    const totalElem = document.querySelector(".cart-total");
  
    const renderCart = () => {
      tbody.innerHTML = "";
      let subtotal = 0;
  
      cart.forEach((item, index) => {
        const row = document.createElement("tr");
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
  
        row.innerHTML = `
          <td><img src="${item.image || 'assets/img/default.jpg'}" alt="" class="table__img" /></td>
          <td><h3 class="table__title">${item.name || 'Unnamed'} (${item.size})</h3></td>
          <td><span class="table__price">$${item.price.toFixed(2)}</span></td>
          <td><input type="number" value="${item.quantity}" class="quantity" min="1" data-index="${index}" /></td>
          <td><span class="table__subtotal">$${itemSubtotal.toFixed(2)}</span></td>
          <td><i class="fi fi-rs-trash table__trash" data-index="${index}" style="cursor:pointer;"></i></td>
        `;
  
        tbody.appendChild(row);
      });
  
      subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
      const shipping = 10;
      totalElem.textContent = `$${(subtotal + shipping).toFixed(2)}`;
    };
  
    // Inisialisasi tampilan awal cart
    renderCart();
  
    // Delegasi event untuk hapus & update quantity
    tbody.addEventListener('click', function (e) {
      if (e.target.classList.contains('table__trash')) {
        const index = e.target.getAttribute('data-index');
        cart.splice(index, 1); // Hapus item dari array cart
        localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
        renderCart(); // Render ulang tampilan cart
        updateCartCount(); // Update jumlah produk di ikon keranjang
      }
    });
  
    tbody.addEventListener('input', function (e) {
      if (e.target.classList.contains('quantity')) {
        const index = e.target.getAttribute('data-index');
        let newQty = parseInt(e.target.value);
        if (isNaN(newQty) || newQty < 1) {
          newQty = 1;
          e.target.value = 1;
        }
        cart[index].quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    });
  }  

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) {
      cartCountElem.textContent = count;
    }
  }
  
});


  /** =================== Compare =================== */
document.addEventListener('DOMContentLoaded', () => {
  const compareButtons = document.querySelectorAll('.compare-btn');

  compareButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const product = {
        title: this.dataset.title,
        price: this.dataset.price,
        image: this.dataset.image,
        material: this.dataset.material,
        colors: JSON.parse(this.dataset.colors),
        size: this.dataset.size
      };

      let compareList = JSON.parse(localStorage.getItem('compareList')) || [];

      // Maksimal 3 produk
      if (compareList.length >= 3) {
        alert('Maksimal 3 produk dapat dibandingkan.');
        return;
      }

      // Cegah duplikat
      if (!compareList.some(p => p.title === product.title)) {
        compareList.push(product);
        localStorage.setItem('compareList', JSON.stringify(compareList));
      }

      window.location.href = 'compare.html';
    });
  });
});

// ============================
// LOAD COMPARE TABLE
// ============================

function loadCompareTable() {
  const table = document.querySelector('.compare__table');
  if (!table) return; // abaikan jika bukan di compare.html

  const compareList = JSON.parse(localStorage.getItem('compareList')) || [];

  if (compareList.length === 0) {
    table.innerHTML = "<tr><td colspan='6'>Tidak ada produk untuk dibandingkan.</td></tr>";
    return;
  }

  const rows = {
    images: '<tr><th>Images</th>',
    names: '<tr><th>Name</th>',
    prices: '<tr><th>Price</th>',
    materials: '<tr><th>Material</th>',
    colors: '<tr><th>Colors</th>',
    sizes: '<tr><th>Size</th>',
    remove: '<tr><th>Remove</th>'
  };

  compareList.forEach((p, i) => {
    rows.images += `<td><img src="${p.image}" class="compare__img"></td>`;
    rows.names += `<td><h3 class="table__title">${p.title}</h3></td>`;
    rows.prices += `<td><span class="table__price">$${p.price}</span></td>`;
    rows.materials += `<td><span class="table__bahan">${p.material}</span></td>`;
    rows.colors += `<td><ul class="color__list compare__colors">` +
      p.colors.map(c => `<li><a href="#" class="color__link" style="background-color:${c}"></a></li>`).join('') +
      `</ul></td>`;
    rows.sizes += `<td><span class="table__dimension">${p.size}</span></td>`;
    rows.remove += `<td><i class="fi fi-rs-trash table__trash" onclick="removeCompare(${i})"></i></td>`;
  });

  for (let key in rows) {
    rows[key] += '</tr>';
    table.innerHTML += rows[key];
  }
}

function removeCompare(index) {
  let compareList = JSON.parse(localStorage.getItem('compareList')) || [];
  compareList.splice(index, 1);
  localStorage.setItem('compareList', JSON.stringify(compareList));
  location.reload();
}

// Panggil saat halaman compare dimuat
document.addEventListener('DOMContentLoaded', loadCompareTable);


  /** =================== Search =================== */
  document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.querySelector('.search__btn');
    const searchInput = document.querySelector('.form__input');
    const productItems = document.querySelectorAll('.product__item');
    const totalText = document.querySelector('.total__products span');
    const noResultsMsg = document.querySelector('.no-results');
  
    // Cek apakah elemen-elemen penting tersedia
    if (!searchBtn || !searchInput || productItems.length === 0 || !totalText || !noResultsMsg) {
      return; // Stop script jika tidak ada elemen pencarian
    }
  
    function filterProducts() {
      const query = searchInput.value.toLowerCase();
      let visibleCount = 0;
  
      productItems.forEach(item => {
        const title = item.dataset.title?.toLowerCase() || '';
  
        if (title.includes(query)) {
          item.style.display = 'block';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
  
      totalText.textContent = visibleCount;
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  
    searchBtn.addEventListener('click', filterProducts);
  
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterProducts();
      }
    });
  });
  

// ================== Accounts ==================
document.addEventListener("DOMContentLoaded", function () {
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const addToCartBtn = document.getElementById("addToCartBtn");
  const logoutEl = document.querySelector(".logoutBtn");
  const loginForm = document.querySelector(".login form");
  const registerForm = document.querySelector(".register form");
  const updateProfileForm = document.querySelector("#update-profile form");
  const editAddressBtn = document.querySelector("#address .edit");
  const addressDisplay = document.querySelector(".address-display");
  const addressEditForm = document.querySelector(".address-edit");
  const addressField = document.getElementById("edit-address");
  const cityField = document.getElementById("edit-city");
  const changePasswordForm = document.getElementById("change-password-form");

  // ================== Proteksi akses accounts.html ==================
  if (window.location.pathname.includes("accounts.html")) {
    if (!isLoggedIn) {
      alert("Kamu harus login terlebih dahulu.");
      window.location.href = "login-register.html";
      return;
    }

    // Ambil user dari localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const username = savedUser ? savedUser.username : "User";

    // Tampilkan Hello di header dashboard
    const tabHeader = document.querySelector(".tab__header");
    if (tabHeader) {
      tabHeader.textContent = `Hello ${username}`;
    }

    // Tampilkan username di form update profile
    if (updateProfileForm) {
      const usernameField = updateProfileForm.querySelector("#username");
      if (usernameField) usernameField.value = username;
    }
  }

  // ================== LOGIN ==================
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;

      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (!savedUser) {
        alert("Akun tidak ditemukan. Silakan register terlebih dahulu.");
        return;
      }

      if (email === savedUser.email && password === savedUser.password) {
        isLoggedIn = true;
        localStorage.setItem("isLoggedIn", "true");
        alert("Login berhasil!");
        window.location.href = "accounts.html";
      } else {
        alert("Email atau password salah.");
      }
    });
  }

  // ================== REGISTER ==================
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
      const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;

      const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

      if (!username || !email || !password || !confirmPassword) {
        alert("Mohon isi semua field.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Password tidak cocok.");
        return;
      }

      if (!passwordRegex.test(password)) {
        alert("Password harus mengandung setidaknya satu huruf besar, satu karakter khusus, dan minimal 8 karakter.");
        return;
      }

      const user = { username, email, password };
      localStorage.setItem("user", JSON.stringify(user));
      alert("Registrasi berhasil. Silakan login.");
    });
  }

  // ================== UPDATE PROFILE ==================
  if (updateProfileForm) {
    updateProfileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const newUsername = this.querySelector("#username").value;
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser) {
        savedUser.username = newUsername;
        localStorage.setItem("user", JSON.stringify(savedUser));
        alert("Profil berhasil diperbarui.");

        // Perbarui tampilan Hello
        const tabHeader = document.querySelector(".tab__header");
        if (tabHeader) {
          tabHeader.textContent = `Hello ${newUsername}`;
        }
      } else {
        alert("Gagal memperbarui profil.");
      }
    });
  }

  // ================== LOGOUT ==================
  if (logoutEl) {
    logoutEl.style.display = isLoggedIn ? "block" : "none";
    logoutEl.addEventListener("click", function () {
      isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
      alert("Kamu telah logout.");
      window.location.href = "login-register.html";
    });
  }

  // ================== ADD TO CART ==================
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function (e) {
      e.preventDefault();

      if (!isLoggedIn) {
        alert("Silakan login terlebih dahulu sebelum menambahkan produk ke keranjang.");
        window.location.href = "login-register.html";
      } else {
        alert("Produk berhasil ditambahkan ke keranjang!");
      }
    });
  }

  // ================== PASSWORD TOGGLE ==================
  document.querySelectorAll(".password-toggle").forEach(function (icon) {
    icon.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (input.type === "password") {
        input.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }
    });
  });

  // ================== Alamat ==================
  // Cek dan muat data alamat dari localStorage
const savedData = JSON.parse(localStorage.getItem("shippingAddress"));
if (savedData && addressDisplay) {
  addressDisplay.querySelector(".address").innerHTML = savedData.address.replace(/\n/g, "<br>");
  addressDisplay.querySelector(".city").textContent = savedData.city;
}

if (editAddressBtn) {
  editAddressBtn.addEventListener("click", function (e) {
    e.preventDefault();
    addressDisplay.style.display = "none";
    addressEditForm.style.display = "block";

    // Isi form edit dengan data saat ini
    const currentAddress = addressDisplay.querySelector(".address").innerText;
    const currentCity = addressDisplay.querySelector(".city").innerText;

    addressField.value = currentAddress;
    cityField.value = currentCity;
  });
}

if (addressEditForm) {
  addressEditForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newAddress = addressField.value.trim();
    const newCity = cityField.value.trim();

    if (!newAddress || !newCity) {
      alert("Mohon lengkapi alamat dan kota.");
      return;
    }

    // Simpan ke localStorage
    const updatedData = {
      address: newAddress,
      city: newCity
    };
    localStorage.setItem("shippingAddress", JSON.stringify(updatedData));

    // Update tampilan
    addressDisplay.querySelector(".address").innerHTML = newAddress.replace(/\n/g, "<br>");
    addressDisplay.querySelector(".city").textContent = newCity;

    // Kembali ke mode tampilan
    addressEditForm.style.display = "none";
    addressDisplay.style.display = "block";

    alert("Alamat berhasil diperbarui.");
  });
  }

  // ================== CHANGE PASSWORD ==================
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (!savedUser || currentPassword !== savedUser.password) {
        alert("Password lama salah.");
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        alert("Password baru harus mengandung setidaknya satu huruf besar dan satu karakter khusus, dan minimal 8 karakter.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Konfirmasi password tidak cocok.");
        return;
      }

      savedUser.password = newPassword;
      localStorage.setItem("user", JSON.stringify(savedUser));
      alert("Password berhasil diubah.");
      changePasswordForm.reset();
    });
  }
});


 // ================== Check Out ================== 
 document.addEventListener("DOMContentLoaded", function () {
  // Ambil data cart dari localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartTable = document.querySelector('.order__table');

  // Tampilkan cart ke dalam tabel
  if (cart.length && cartTable) {
    let total = 0;
    cart.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${product.image}" alt="${product.name}" class="order__img"></td>
        <td>
          <h3 class="table__title">${product.name}</h3>
          <p class="table__quantity">x ${product.quantity}</p>
          <p class="table__brand">${product.brand}</p>
          <p class="table__size">Size: ${product.size}</p>
          ${product.oldPrice ? `<p class="table__old-price">Was $${product.oldPrice.toFixed(2)}</p>` : ""}
        </td>
        <td><span class="table__price">$${(product.price * product.quantity).toFixed(2)}</span></td>
      `;
      cartTable.appendChild(row);
      total += product.price * product.quantity;
    });

    // Hitung subtotal dan grand total
    const subtotalAmount = document.querySelector('#subtotal-amount');
    if (subtotalAmount) {
      subtotalAmount.textContent = `$${total.toFixed(2)}`;
    }

    const shippingCost = 10.00;
    const grandTotal = total + shippingCost;
    const grandTotalDisplay = document.querySelector('.order__grand-total');
    if (grandTotalDisplay) {
      grandTotalDisplay.textContent = `$${grandTotal.toFixed(2)}`;
    }
  }

  // Tampilkan data user yang tersimpan
  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser) {
    const nameInput = document.querySelector('input[placeholder="Name"]');
    const emailInput = document.querySelector('input[placeholder="Email"]');
    if (nameInput) nameInput.value = savedUser.username;
    if (emailInput) emailInput.value = savedUser.email;
  }

  // Tampilkan data alamat yang tersimpan
  const savedAddress = JSON.parse(localStorage.getItem("shippingAddress"));
  if (savedAddress) {
    const addressInput = document.querySelector('input[placeholder="Address"]');
    const cityInput = document.querySelector('input[placeholder="City"]');
    if (addressInput) addressInput.value = savedAddress.address;
    if (cityInput) cityInput.value = savedAddress.city;
  }

  // Tangani klik tombol "Place Order"
  const placeOrderBtn = document.querySelector('.btn--md');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const billingDetails = {
        name: document.querySelector('input[placeholder="Name"]')?.value.trim(),
        address: document.querySelector('input[placeholder="Address"]')?.value.trim(),
        city: document.querySelector('input[placeholder="City"]')?.value.trim(),
        phone: document.querySelector('input[placeholder="Phone"]')?.value.trim(),
        email: document.querySelector('input[placeholder="Email"]')?.value.trim(),
        orderNote: document.querySelector('textarea[name="Order Note"]')?.value.trim(),
      };

      // Validasi field wajib
      if (!billingDetails.name || !billingDetails.address || !billingDetails.city || !billingDetails.phone || !billingDetails.email) {
        alert("Please fill all the required fields!");
        return;
      }

      const totalAmount = document.querySelector('.order__grand-total')?.textContent || "$0.00";

      const order = {
        billingDetails,
        cart,
        totalAmount,
      };

      localStorage.setItem("order", JSON.stringify(order));
      alert("Order placed successfully!");
    });
  }
});

 // ================== Timer ================== 
function startCountdown(countdownElement, deadline) {
  function updateCountdown() {
    const now = new Date().getTime();
    const countDownDate = new Date(deadline).getTime();
    const distance = countDownDate - now;

    if (distance < 0) {
      countdownElement.querySelector('.days').textContent = '00';
      countdownElement.querySelector('.hours').textContent = '00';
      countdownElement.querySelector('.mins').textContent = '00';
      countdownElement.querySelector('.secs').textContent = '00';
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.querySelector('.days').textContent = String(days).padStart(2, '0');
    countdownElement.querySelector('.hours').textContent = String(hours).padStart(2, '0');
    countdownElement.querySelector('.mins').textContent = String(mins).padStart(2, '0');
    countdownElement.querySelector('.secs').textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.countdown').forEach(countdown => {
    const deadline = countdown.dataset.deadline;
    if (deadline) {
      startCountdown(countdown, deadline);
    }
  });
});

document.getElementById("shopNowBtn").addEventListener("click", function () {
  // Lakukan sesuatu, seperti redirect atau buka produk
  console.log("Shop Now clicked");
});

