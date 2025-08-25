
// Función para cambiar la imagen principal
function imgSlider(anything){
    document.querySelector('.starbucks').src = anything;
}

// Función para cambiar el color del círculo de fondo
function changeCircleColor(color){
    const circle = document.querySelector('.circle');
    circle.style.background = color;
}

// Menú móvil
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('header ul');
const header = document.getElementById('main-header');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.innerHTML = navMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>'
});

// Header fijo y cambio de estilo al hacer scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll para navegación
document.querySelectorAll('header ul li a, .footer-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Cerrar menú en móviles
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Lightbox para imágenes de productos
const productImages = document.querySelectorAll('.product-image img');
const quickViewButtons = document.querySelectorAll('.quick-view-btn');
const imageLightbox = document.querySelector('.image-lightbox');
const lightboxImage = document.querySelector('.lightbox-content img');
const lightboxTitle = document.querySelector('.lightbox-product-title');
const lightboxDescription = document.querySelector('.lightbox-product-description');
const lightboxPrice = document.querySelector('.lightbox-product-price');
const lightboxSelectBtn = document.querySelector('.lightbox-select-btn');
const lightboxFavoriteBtn = document.querySelector('.lightbox-favorite-btn');
const closeLightbox = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentProductData = null;
let currentProductIndex = 0;
const products = Array.from(document.querySelectorAll('.product-card'));

function openLightbox(index) {
    const product = products[index];
    const image = product.querySelector('.product-image img');
    
    currentProductData = {
        product: image.getAttribute('data-product'),
        description: image.getAttribute('data-description'),
        price: image.getAttribute('data-price'),
        img: image.getAttribute('src'),
        index: index
    };
    
    lightboxImage.src = currentProductData.img;
    lightboxTitle.textContent = currentProductData.product;
    lightboxDescription.textContent = currentProductData.description;
    lightboxPrice.textContent = `$${currentProductData.price}`;
    
    // Configurar el botón de seleccionar en el lightbox
    lightboxSelectBtn.setAttribute('data-product', currentProductData.product);
    lightboxSelectBtn.setAttribute('data-price', currentProductData.price);
    lightboxSelectBtn.setAttribute('data-img', currentProductData.img);
    
    // Configurar favorito
    const isFavorite = favorites.includes(currentProductData.product);
    lightboxFavoriteBtn.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    lightboxFavoriteBtn.classList.toggle('active', isFavorite);
    
    imageLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

productImages.forEach((image, index) => {
    image.addEventListener('click', () => {
        openLightbox(index);
    });
});

quickViewButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(index);
    });
});

// Navegación en el lightbox
prevBtn.addEventListener('click', () => {
    let newIndex = currentProductIndex - 1;
    if (newIndex < 0) newIndex = products.length - 1;
    openLightbox(newIndex);
});

nextBtn.addEventListener('click', () => {
    let newIndex = currentProductIndex + 1;
    if (newIndex >= products.length) newIndex = 0;
    openLightbox(newIndex);
});

// Cerrar lightbox
closeLightbox.addEventListener('click', () => {
    imageLightbox.classList.remove('active');
    document.body.style.overflow = '';
});

imageLightbox.addEventListener('click', (e) => {
    if (e.target === imageLightbox) {
        imageLightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Funcionalidad del carrito
const cartToggle = document.querySelector('.cart-toggle');
const closeCart = document.querySelector('.close-cart');
const cartSidebar = document.querySelector('.cart-sidebar');
const overlay = document.querySelector('.overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const checkoutBtn = document.querySelector('.checkout-btn');
const productSelectButtons = document.querySelectorAll('.product-select-btn, .lightbox-select-btn');
const cartCount = document.querySelector('.cart-count');

let cart = [];

// Abrir carrito
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
});

// Cerrar carrito
closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Función para mostrar notificación
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    notification.classList.add('active');
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Añadir productos al carrito
productSelectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Si es el botón del lightbox, cerrar el lightbox primero
        if (button.classList.contains('lightbox-select-btn')) {
            imageLightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        const product = button.getAttribute('data-product');
        const price = parseFloat(button.getAttribute('data-price'));
        const img = button.getAttribute('data-img');
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.product === product);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                product,
                price,
                img,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Mostrar mensaje de confirmación bonito
        showNotification(`¡${product} añadido al carrito! 🎉`);
    });
});

// Actualizar carrito
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    let totalItems = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.product}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.product}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = totalItems;
    
    // Mostrar u ocultar el contador
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
    
    // Añadir event listeners a los botones de eliminar y cambiar cantidad
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            const removedProduct = cart[index].product;
            cart.splice(index, 1);
            updateCart();
            showNotification(`Se eliminó ${removedProduct} del carrito`);
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                updateCart();
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            cart[index].quantity += 1;
            updateCart();
        });
    });
}

// Enviar pedido por WhatsApp
checkoutBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    // Validar formulario
    if (!name || !phone || !address) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Crear mensaje para WhatsApp
    let message = `¡Hola! Quiero hacer un pedido:%0A%0A`;
    message += `*Nombre:* ${name}%0A`;
    message += `*Teléfono:* ${phone}%0A`;
    message += `*Dirección:* ${address}%0A%0A`;
    message += `*Pedido:*%0A`;
    
    cart.forEach(item => {
        message += `- ${item.product} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}%0A`;
        
        // Si es un diseño personalizado, añadir la URL de Drive
        if (item.custom) {
            message += `  🔗 Imagen: ${item.img}%0A`;
        }
    });
    
    message += `%0A*Total:* $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
    
    // Abrir WhatsApp con el mensaje (REEMPLAZA EL NÚMERO DE TELÉFONO)
    window.open(`https://wa.me/51388955?text=${message}`, '_blank');
    
    // Limpiar carrito y formulario
    cart = [];
    updateCart();
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    
    // Cerrar carrito
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    
    showNotification('¡Pedido enviado! Te contactaremos pronto. 📦');
});

// Funcionalidad para subir diseños personalizados
const uploadDesignBtn = document.getElementById('upload-design-btn');
const chooseDesignBtn = document.getElementById('choose-design-btn');
const customDesignModal = document.querySelector('.custom-design-modal');
const closeModalBtn = document.querySelector('.close-modal');
const uploadArea = document.getElementById('upload-area');
const designUpload = document.getElementById('design-upload');
const imagePreview = document.getElementById('image-preview');
const addCustomDesignBtn = document.getElementById('add-custom-design');
const uploadStatus = document.getElementById('upload-status');
const uploadProgress = document.querySelector('.upload-progress');
const progressBar = document.querySelector('.progress-bar');
const loader = addCustomDesignBtn.querySelector('.loader');

// Abrir modal para subir diseño
uploadDesignBtn.addEventListener('click', (e) => {
    e.preventDefault();
    customDesignModal.classList.add('active');
    overlay.classList.add('active');
});

// Cerrar modal
closeModalBtn.addEventListener('click', () => {
    customDesignModal.classList.remove('active');
    overlay.classList.remove('active');
    resetUploadForm();
});

overlay.addEventListener('click', () => {
    customDesignModal.classList.remove('active');
    overlay.classList.remove('active');
    resetUploadForm();
});

// Subir imagen
uploadArea.addEventListener('click', () => {
    designUpload.click();
});

designUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.addEventListener('load', function() {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
            addCustomDesignBtn.disabled = false;
        });
        
        reader.readAsDataURL(file);
    }
});

// Arrastrar y soltar imagen
uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#015c35';
});

uploadArea.addEventListener('dragleave', function() {
    this.style.borderColor = '#017143';
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '#017143';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes('image')) {
        designUpload.files = e.dataTransfer.files;
        
        const reader = new FileReader();
        
        reader.addEventListener('load', function() {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
            addCustomDesignBtn.disabled = false;
        });
        
        reader.readAsDataURL(file);
    } else {
        alert('Por favor, sube solo archivos de imagen');
    }
});

// Añadir diseño personalizado al carrito
addCustomDesignBtn.addEventListener('click', async () => {
    const file = designUpload.files[0];
    if (!file) {
        alert('Por favor, selecciona una imagen');
        return;
    }

    addCustomDesignBtn.disabled = true;
    loader.style.display = 'inline-block';
    uploadProgress.style.display = 'block';
    uploadStatus.textContent = 'Subiendo imagen...';
    uploadStatus.style.color = '#017143';

    // Simular progreso de subida
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Simulamos una URL de imagen subida (en un caso real, esto vendría del servidor)
            const simulatedImageUrl = URL.createObjectURL(file);
            
            // Añadir al carrito
            cart.push({
                product: "Diseño Personalizado",
                price: 20.00,
                img: simulatedImageUrl,
                quantity: 1,
                custom: true
            });
            
            updateCart();
            customDesignModal.classList.remove('active');
            overlay.classList.remove('active');
            resetUploadForm();
            
            showNotification('✅ Diseño personalizado añadido al carrito');
        }
    }, 100);
});

// Función para resetear el formulario de subida
function resetUploadForm() {
    designUpload.value = '';
    imagePreview.src = '#';
    imagePreview.style.display = 'none';
    addCustomDesignBtn.disabled = true;
    uploadStatus.textContent = '';
    uploadProgress.style.display = 'none';
    progressBar.style.width = '0%';
    loader.style.display = 'none';
}

// Animación para el texto en móviles
function setupTextAnimations() {
    const designText = document.querySelector('.design-text');
    
    // Solo aplicar hover effect en desktop
    if (window.innerWidth > 768) {
        designText.addEventListener('mouseover', () => {
            designText.style.textShadow = '0 0 15px rgba(1, 113, 67, 0.5)';
        });
        
        designText.addEventListener('mouseout', () => {
            designText.style.textShadow = '0 0 10px rgba(1, 113, 67, 0.3)';
        });
    }
}

// Llamar la función al cargar y al redimensionar
window.addEventListener('load', setupTextAnimations);
window.addEventListener('resize', setupTextAnimations);

// Filtrado por categorías
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

// Función para filtrar productos por categoría
function filterProducts(category) {
    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Añadir event listeners a los botones de filtro
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover la clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Añadir la clase active al botón clickeado
        button.classList.add('active');
        
        // Filtrar productos por la categoría seleccionada
        const category = button.getAttribute('data-category');
        filterProducts(category);
    });
});

// Inicializar con la categoría "all" seleccionada
window.addEventListener('load', () => {
    filterProducts('all');
});

// Sistema de favoritos
const favoritesToggle = document.querySelector('.favorites-toggle');
const favoritesSidebar = document.querySelector('.favorites-sidebar');
const closeFavorites = document.querySelector('.close-favorites');
const favoritesItems = document.querySelector('.favorites-items');
const viewFavoritesBtn = document.querySelector('.view-favorites-btn');
const favoriteButtons = document.querySelectorAll('.favorite-btn');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Abrir sidebar de favoritos
favoritesToggle.addEventListener('click', () => {
    favoritesSidebar.classList.add('active');
    overlay.classList.add('active');
    updateFavoritesSidebar();
});

// Cerrar sidebar de favoritos
closeFavorites.addEventListener('click', () => {
    favoritesSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Actualizar sidebar de favoritos
function updateFavoritesSidebar() {
    favoritesItems.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesItems.innerHTML = `
            <div class="empty-favorites">
                <i class="far fa-heart"></i>
                <p>No tienes productos favoritos</p>
            </div>
        `;
        return;
    }
    
    favorites.forEach((productName, index) => {
        // Encontrar el producto en la lista de productos
        const productCard = Array.from(productCards).find(card => {
            return card.querySelector('.product-title').textContent === productName;
        });
        
        if (productCard) {
            const image = productCard.querySelector('img').src;
            const price = productCard.querySelector('.current-price').textContent;
            
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            favoriteItem.innerHTML = `
                <img src="${image}" alt="${productName}">
                <div class="favorite-item-details">
                    <div class="favorite-item-title">${productName}</div>
                    <div class="favorite-item-price">${price}</div>
                </div>
                <button class="remove-favorite" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
            
            favoritesItems.appendChild(favoriteItem);
        }
    });
    
    // Añadir event listeners a los botones de eliminar favoritos
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            const removedProduct = favorites[index];
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateFavoritesSidebar();
            updateFavoriteButtons();
            showNotification(`Se eliminó ${removedProduct} de favoritos`);
        });
    });
}

// Actualizar botones de favoritos en las tarjetas de producto
function updateFavoriteButtons() {
    favoriteButtons.forEach(button => {
        const productName = button.getAttribute('data-product');
        const isFavorite = favorites.includes(productName);
        
        button.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        button.classList.toggle('active', isFavorite);
    });
}

// Añadir/eliminar favoritos
favoriteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const productName = button.getAttribute('data-product');
        const index = favorites.indexOf(productName);
        
        if (index === -1) {
            // Añadir a favoritos
            favorites.push(productName);
            showNotification(`¡${productName} añadido a favoritos! ❤️`);
        } else {
            // Eliminar de favoritos
            favorites.splice(index, 1);
            showNotification(`Se eliminó ${productName} de favoritos`);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButtons();
        
        // Si el lightbox está abierto, actualizar su botón de favoritos también
        if (imageLightbox.classList.contains('active') && currentProductData) {
            const isFavorite = favorites.includes(currentProductData.product);
            lightboxFavoriteBtn.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            lightboxFavoriteBtn.classList.toggle('active', isFavorite);
        }
    });
});

// Botón de favoritos en el lightbox
lightboxFavoriteBtn.addEventListener('click', () => {
    if (!currentProductData) return;
    
    const productName = currentProductData.product;
    const index = favorites.indexOf(productName);
    
    if (index === -1) {
        // Añadir a favoritos
        favorites.push(productName);
        showNotification(`¡${productName} añadido a favoritos! ❤️`);
    } else {
        // Eliminar de favoritos
        favorites.splice(index, 1);
        showNotification(`Se eliminó ${productName} de favoritos`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
    
    // Actualizar botón en el lightbox
    const isFavorite = favorites.includes(productName);
    lightboxFavoriteBtn.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    lightboxFavoriteBtn.classList.toggle('active', isFavorite);
});

// Inicializar botones de favoritos
updateFavoriteButtons();

// Sistema de comparación de productos
const compareButtons = document.querySelectorAll('.compare-btn');
const comparisonBar = document.querySelector('.comparison-bar');
const comparisonItems = document.querySelector('.comparison-items');
const compareNowBtn = document.querySelector('.compare-now-btn');
const clearComparisonBtn = document.querySelector('.clear-comparison-btn');
const comparisonModal = document.querySelector('.comparison-modal');
const closeComparison = document.querySelector('.close-comparison');
const comparisonTable = document.querySelector('.comparison-table tbody');

let comparisonProducts = [];

// Añadir productos a la comparación
compareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const productName = button.getAttribute('data-product');
        
        // Encontrar el producto
        const productCard = Array.from(productCards).find(card => {
            return card.querySelector('.product-title').textContent === productName;
        });
        
        if (!productCard) return;
        
        const productImage = productCard.querySelector('img').src;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productCategory = productCard.getAttribute('data-category');
        
        // Verificar si el producto ya está en la comparación
        const existingIndex = comparisonProducts.findIndex(p => p.name === productName);
        
        if (existingIndex !== -1) {
            // Eliminar de la comparación
            comparisonProducts.splice(existingIndex, 1);
            showNotification(`Se eliminó ${productName} de la comparación`);
        } else {
            // Añadir a la comparación (máximo 3 productos)
            if (comparisonProducts.length >= 3) {
                showNotification('Máximo 3 productos para comparar');
                return;
            }
            
            comparisonProducts.push({
                name: productName,
                image: productImage,
                price: productPrice,
                category: productCategory
            });
            
            showNotification(`¡${productName} añadido a la comparación! 🔍`);
        }
        
        updateComparisonBar();
    });
});

// Actualizar barra de comparación
function updateComparisonBar() {
    comparisonItems.innerHTML = '<span>Productos para comparar:</span>';
    
    comparisonProducts.forEach((product, index) => {
        const comparisonItem = document.createElement('div');
        comparisonItem.classList.add('comparison-item');
        comparisonItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <span>${product.name}</span>
            <button class="remove-comparison" data-index="${index}"><i class="fas fa-times"></i></button>
        `;
        
        comparisonItems.appendChild(comparisonItem);
    });
    
    // Añadir event listeners a los botones de eliminar
    document.querySelectorAll('.remove-comparison').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            const removedProduct = comparisonProducts[index].name;
            comparisonProducts.splice(index, 1);
            updateComparisonBar();
            showNotification(`Se eliminó ${removedProduct} de la comparación`);
        });
    });
    
    // Mostrar u ocultar la barra de comparación
    if (comparisonProducts.length > 0) {
        comparisonBar.classList.add('active');
        compareNowBtn.disabled = false;
    } else {
        comparisonBar.classList.remove('active');
        compareNowBtn.disabled = true;
    }
    
    // Habilitar el botón de comparar solo si hay al menos 2 productos
    if (comparisonProducts.length >= 2) {
        compareNowBtn.disabled = false;
    } else {
        compareNowBtn.disabled = true;
    }
}

// Limpiar comparación
clearComparisonBtn.addEventListener('click', () => {
    comparisonProducts = [];
    updateComparisonBar();
    showNotification('Comparación limpiada');
});

// Comparar productos
compareNowBtn.addEventListener('click', () => {
    if (comparisonProducts.length < 2) return;
    
    // Generar tabla de comparación
    generateComparisonTable();
    
    // Mostrar modal de comparación
    comparisonModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Cerrar modal de comparación
closeComparison.addEventListener('click', () => {
    comparisonModal.classList.remove('active');
    document.body.style.overflow = '';
});

comparisonModal.addEventListener('click', (e) => {
    if (e.target === comparisonModal) {
        comparisonModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Generar tabla de comparación
function generateComparisonTable() {
    // Limpiar tabla
    comparisonTable.innerHTML = '';
    
    // Encabezados de productos
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Característica</th>';
    
    comparisonProducts.forEach(product => {
        headerRow.innerHTML += `<th class="comparison-product">
            <img src="${product.image}" alt="${product.name}">
            <div>${product.name}</div>
        </th>`;
    });
    
    comparisonTable.appendChild(headerRow);
    
    // Precio
    const priceRow = document.createElement('tr');
    priceRow.innerHTML = '<td>Precio</td>';
    
    comparisonProducts.forEach(product => {
        priceRow.innerHTML += `<td>${product.price}</td>`;
    });
    
    comparisonTable.appendChild(priceRow);
    
    // Categoría
    const categoryRow = document.createElement('tr');
    categoryRow.innerHTML = '<td>Categoría</td>';
    
    comparisonProducts.forEach(product => {
        categoryRow.innerHTML += `<td>${product.category}</td>`;
    });
    
    comparisonTable.appendChild(categoryRow);
    
    // Material (simulado)
    const materialRow = document.createElement('tr');
    materialRow.innerHTML = '<td>Material</td>';
    
    comparisonProducts.forEach(() => {
        materialRow.innerHTML += '<td>Cerámica de alta calidad</td>';
    });
    
    comparisonTable.appendChild(materialRow);
    
    // Capacidad (simulado)
    const capacityRow = document.createElement('tr');
    capacityRow.innerHTML = '<td>Capacidad</td>';
    
    comparisonProducts.forEach(() => {
        capacityRow.innerHTML += '<td>350 ml</td>';
    });
    
    comparisonTable.appendChild(capacityRow);
    
    // Personalizable (simulado)
    const customizableRow = document.createElement('tr');
    customizableRow.innerHTML = '<td>Personalizable</td>';
    
    comparisonProducts.forEach(() => {
        customizableRow.innerHTML += '<td><i class="fas fa-check" style="color: green;"></i></td>';
    });
    
    comparisonTable.appendChild(customizableRow);
    
    // Lavable en lavavajillas (simulado)
    const dishwasherRow = document.createElement('tr');
    dishwasherRow.innerHTML = '<td>Lavable en lavavajillas</td>';
    
    comparisonProducts.forEach(() => {
        dishwasherRow.innerHTML += '<td><i class="fas fa-check" style="color: green;"></i></td>';
    });
    
    comparisonTable.appendChild(dishwasherRow);
}

// Gestos táctiles para móviles
let touchStartX = 0;
let touchEndX = 0;

const productsGrid = document.querySelector('.products-grid');

productsGrid.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

productsGrid.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50; // Mínimo de desplazamiento para considerar un swipe
     
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe izquierda - siguiente producto en lightbox
        if (imageLightbox.classList.contains('active')) {
            nextBtn.click();
        }
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe derecha - producto anterior en lightbox
        if (imageLightbox.classList.contains('active')) {
            prevBtn.click();
        }
    }
}

// Lazy loading para imágenes
if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Cargar polyfill para lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
    document.body.appendChild(script);
    
    script.onload = () => {
        const observer = lozad();
        observer.observe();
    };
}

// Inicializar tooltips
const tooltips = document.querySelectorAll('.tooltip');

tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', () => {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = '1';
    });
    
    tooltip.addEventListener('mouseleave', () => {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        tooltipText.style.visibility = 'hidden';
        tooltipText.style.opacity = '0';
    });
});
```