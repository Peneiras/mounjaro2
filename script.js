// Variáveis globais
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Produtos disponíveis
const products = {
    1: {
        id: 1,
        name: 'Mounjaro® 2.5mg',
        price: 1299.90,
        image: 'assets/images/mounjaro-box.jpg',
        description: 'Dose inicial para tratamento de diabetes tipo 2',
        stock: 5
    },
    2: {
        id: 2,
        name: 'Mounjaro® 5mg',
        price: 1399.90,
        image: 'assets/images/mounjaro-box.jpg',
        description: 'Dose de manutenção para controle glicêmico',
        stock: 3
    },
    3: {
        id: 3,
        name: 'Mounjaro® 7.5mg',
        price: 1499.90,
        image: 'assets/images/mounjaro-box.jpg',
        description: 'Dose intermediária para otimização do tratamento',
        stock: 2
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializeEventListeners();
    
    // Verificar se estamos em uma página de produto
    const currentPage = window.location.pathname;
    if (currentPage.includes('produto-')) {
        initializeProductPage();
    }
});

// Event Listeners
function initializeEventListeners() {
    // Smooth scrolling para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animação de entrada dos cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .info-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Navegação para páginas de produtos
function goToProduct(productId) {
    window.location.href = `produto-${productId}.html`;
}

// Funcionalidades da página de produto
function initializeProductPage() {
    // Inicializar tabs
    initializeTabs();
    
    // Verificar se há wishlist ativo
    updateWishlistButton();
}

// Sistema de tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(targetTab);
        });
    });
}

function showTab(tabName) {
    // Remover classe active de todos os botões e panes
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    // Adicionar classe active ao botão e pane corretos
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Troca de imagens do produto
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Remover classe active de todas as thumbnails
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Adicionar classe active à thumbnail clicada
    thumbnail.classList.add('active');
    
    // Trocar a imagem principal
    mainImage.src = thumbnail.src;
    mainImage.alt = thumbnail.alt;
}

// Controle de quantidade
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    const maxValue = parseInt(quantityInput.max);
    
    if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    const minValue = parseInt(quantityInput.min);
    
    if (currentValue > minValue) {
        quantityInput.value = currentValue - 1;
    }
}

// Sistema de carrinho
function addToCart() {
    const currentPage = window.location.pathname;
    const productId = getCurrentProductId();
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!productId || !products[productId]) {
        showNotification('Produto não encontrado!', 'error');
        return;
    }
    
    const product = products[productId];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Produto adicionado ao carrinho!', 'success');
}

function buyNow() {
    addToCart();
    // Simular redirecionamento para checkout
    setTimeout(() => {
        showNotification('Redirecionando para o checkout...', 'info');
        // window.location.href = 'checkout.html';
    }, 1000);
}

function getCurrentProductId() {
    const currentPage = window.location.pathname;
    const match = currentPage.match(/produto-(\d+)\.html/);
    return match ? parseInt(match[1]) : null;
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Sistema de wishlist
function toggleWishlist() {
    const productId = getCurrentProductId();
    const wishlistBtn = document.querySelector('.wishlist-btn i');
    
    if (!productId) return;
    
    const isInWishlist = wishlist.includes(productId);
    
    if (isInWishlist) {
        wishlist = wishlist.filter(id => id !== productId);
        wishlistBtn.className = 'far fa-heart';
        showNotification('Removido da lista de desejos', 'info');
    } else {
        wishlist.push(productId);
        wishlistBtn.className = 'fas fa-heart';
        showNotification('Adicionado à lista de desejos!', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishlistButton() {
    const productId = getCurrentProductId();
    const wishlistBtn = document.querySelector('.wishlist-btn i');
    
    if (productId && wishlistBtn) {
        const isInWishlist = wishlist.includes(productId);
        wishlistBtn.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
    }
}

// Calculadora de frete
function calculateShipping() {
    const cepInput = document.getElementById('cep');
    const shippingOptions = document.getElementById('shippingOptions');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showNotification('CEP inválido! Digite um CEP com 8 dígitos.', 'error');
        return;
    }
    
    // Simular cálculo de frete
    showNotification('Calculando frete...', 'info');
    
    setTimeout(() => {
        shippingOptions.style.display = 'block';
        shippingOptions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        showNotification('Frete calculado com sucesso!', 'success');
    }, 1500);
}

// Formatação de CEP
document.addEventListener('DOMContentLoaded', function() {
    const cepInputs = document.querySelectorAll('#cep');
    cepInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    });
});

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 400px;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    // Cores baseadas no tipo
    const colors = {
        success: { bg: '#2ecc71', color: 'white' },
        error: { bg: '#e74c3c', color: 'white' },
        info: { bg: '#3498db', color: 'white' },
        warning: { bg: '#f39c12', color: 'white' }
    };
    
    const colorScheme = colors[type] || colors.info;
    notification.style.backgroundColor = colorScheme.bg;
    notification.style.color = colorScheme.color;
    
    // Estilo do conteúdo
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    `;
    
    // Estilo do botão fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 3px;
        transition: background-color 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(255,255,255,0.2)';
    });
    
    closeBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Funcionalidades de busca (para futuras implementações)
function searchProducts(query) {
    // Implementar busca de produtos
    console.log('Buscando por:', query);
}

// Filtros de produtos (para futuras implementações)
function filterProducts(criteria) {
    // Implementar filtros
    console.log('Filtrando por:', criteria);
}

// Comparação de produtos (para futuras implementações)
function compareProducts(productIds) {
    // Implementar comparação
    console.log('Comparando produtos:', productIds);
}

// Validação de formulários
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Formatação de preços
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

// Formatação de números
function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
}

// Debounce para otimizar performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading de imagens
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Gerenciamento de estado da aplicação
const AppState = {
    currentUser: null,
    isLoading: false,
    
    setLoading(loading) {
        this.isLoading = loading;
        this.updateLoadingUI();
    },
    
    updateLoadingUI() {
        const loadingElements = document.querySelectorAll('.loading-indicator');
        loadingElements.forEach(el => {
            el.style.display = this.isLoading ? 'block' : 'none';
        });
    }
};

// Utilitários para localStorage
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Erro ao ler do localStorage:', e);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Erro ao remover do localStorage:', e);
        }
    }
};

// Analytics e tracking (simulado)
function trackEvent(eventName, properties = {}) {
    console.log('Evento rastreado:', eventName, properties);
    // Aqui seria integrado com Google Analytics, Facebook Pixel, etc.
}

// Inicialização de recursos avançados
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    
    // Rastrear visualização de página
    trackEvent('page_view', {
        page: window.location.pathname,
        title: document.title
    });
});

// Tratamento de erros globais
window.addEventListener('error', function(e) {
    console.error('Erro JavaScript:', e.error);
    // Aqui seria enviado para um serviço de monitoramento como Sentry
});

// Service Worker para cache (básico)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registrado com sucesso:', registration.scope);
            })
            .catch(function(registrationError) {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}

// Exportar funções para uso global
window.MounjaroApp = {
    goToProduct,
    addToCart,
    buyNow,
    toggleWishlist,
    calculateShipping,
    showNotification,
    formatPrice,
    formatNumber,
    Storage,
    trackEvent
};

