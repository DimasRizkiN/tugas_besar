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
  const quickViewButtons = document.querySelectorAll('.action__btn');
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
// Struktur data produk
const products = [
  {
      id: "product-1",
      name: "Plain Striola Shirts",
      price: "$35",
      image: "assets/img/product-4-1.jpg",
      material: "Cotton",
      colors: ["hsl(37, 100%, 65%)", "hsl(353, 100%, 67%)", "hsl(49, 100%, 60%)"],
      sizes: ["M", "L", "XL"]
  },
  {
      id: "product-2",
      name: "Chen Cardigan",
      price: "$67",
      image: "assets/img/product-7-1.jpg",
      material: "Wool",
      colors: ["hsl(37, 100%, 65%)", "hsl(353, 100%, 67%)", "hsl(49, 100%, 60%)"],
      sizes: ["S", "M", "L"]
  },
  {
      id: "product-3",
      name: "Henley Shirt",
      price: "$24",
      image: "assets/img/product-2-1.jpg",
      material: "Polyester",
      colors: ["hsl(37, 100%, 65%)", "hsl(353, 100%, 67%)", "hsl(49, 100%, 60%)"],
      sizes: ["M", "L"]
  }
];

// Fungsi untuk menambahkan produk ke daftar perbandingan di localStorage
function addToCompare(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return; // Jika produk tidak ditemukan, berhenti

  let compareList = JSON.parse(localStorage.getItem('compareList')) || [];
  
  // Cegah duplikasi produk dalam daftar perbandingan
  if (!compareList.some(item => item.id === product.id)) {
      compareList.push(product);
      localStorage.setItem('compareList', JSON.stringify(compareList));
  }
}

// Fungsi untuk menampilkan daftar perbandingan di halaman compare
function displayCompareList() {
  const compareList = JSON.parse(localStorage.getItem('compareList')) || [];

  compareList.forEach((product, index) => {
      if (index >= 3) return; // Batasi hanya 3 produk dalam tabel perbandingan

      // Set gambar
      document.querySelectorAll('.compare__img')[index].src = product.image;

      // Set nama produk
      document.querySelectorAll('.table__title')[index].innerText = product.name;

      // Set harga produk
      document.querySelectorAll('.table__price')[index].innerText = product.price;

      // Set bahan (material)
      document.querySelectorAll('.table__bahan')[index].innerText = product.material;

      // Set warna yang tersedia
      const colorList = document.querySelectorAll('.color__list.compare__colors')[index];
      colorList.innerHTML = product.colors.map(color => 
          `<li><a href="#" class="color__link" style="background-color: ${color};"></a></li>`
      ).join('');

      // Set ukuran
      document.querySelectorAll('.table__dimension')[index].innerText = product.sizes.join(', ');

      // Tambahkan aksi Buy dan Remove
      document.querySelectorAll('.btn--sm')[index].addEventListener('click', () => {
          // Fungsi Buy, misalnya menambahkan produk ke keranjang
          alert(`Produk ${product.name} ditambahkan ke keranjang.`);
      });

      document.querySelectorAll('.table__trash')[index].addEventListener('click', () => {
          // Fungsi Remove, menghapus produk dari daftar perbandingan
          compareList = compareList.filter(item => item.id !== product.id);
          localStorage.setItem('compareList', JSON.stringify(compareList));
          displayCompareList();  // Refresh tampilan setelah dihapus
      });
  });
}

// Event listener untuk tombol Compare
document.querySelectorAll('.action__btn').forEach(button => {
  button.addEventListener('click', (event) => {
      const productId = event.target.closest('a').dataset.productId;
      addToCompare(productId);
  });
});

// Panggil displayCompareList saat halaman compare dimuat
window.onload = displayCompareList;

