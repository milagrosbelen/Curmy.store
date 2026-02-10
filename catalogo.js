/**
 * Script para mejorar la experiencia del catálogo
 * - Toggle de secciones colapsables
 * - Modal de producto con talles
 * - Badge de stock sobre la imagen
 */

(function() {
  'use strict';

  // ===== TOGGLE DE SECCIONES COLAPSABLES =====
  
  /**
   * Inicializa los botones de toggle para colapsar/expandir secciones
   */
  function initToggleSecciones() {
    const secciones = document.querySelectorAll('.categoria-seccion');
    
    secciones.forEach(seccion => {
      const toggleBtn = seccion.querySelector('.toggle-btn');
      const productos = seccion.querySelector('.productos');
      
      if (!toggleBtn || !productos) return;
      
      // Por defecto, todas las secciones están abiertas
      seccion.classList.remove('colapsada');
      toggleBtn.textContent = '−';
      
      // Event listener para el toggle
      toggleBtn.addEventListener('click', () => {
        const estaColapsada = seccion.classList.contains('colapsada');
        
        if (estaColapsada) {
          // Expandir
          seccion.classList.remove('colapsada');
          toggleBtn.textContent = '−';
        } else {
          // Colapsar
          seccion.classList.add('colapsada');
          toggleBtn.textContent = '+';
        }
      });
    });
  }

  // ===== PARSEO DE TALLES =====
  
  /**
   * Parsea el texto de talles y devuelve un array de talles
   * Maneja formatos: "L", "L - XL", "L-XL-XXL", "M - L", etc.
   */
  function parsearTalles(textoTalle) {
    if (!textoTalle) return [];
    
    // Limpiar el texto y separar por guiones o espacios
    const talles = textoTalle
      .trim()
      .split(/[-–—]/) // Separar por diferentes tipos de guiones
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    // Si solo hay un elemento, puede ser un solo talle o múltiples separados por espacios
    if (talles.length === 1) {
      const partes = talles[0].split(/\s+/);
      return partes.filter(t => t.length > 0);
    }
    
    return talles;
  }

  // ===== BADGE DE STOCK SOBRE LA IMAGEN =====
  
  /**
   * Crea y posiciona el badge de stock sobre la imagen
   * Solo muestra badge cuando el producto está SIN STOCK
   */
  function crearBadgeStock() {
    const productos = document.querySelectorAll('.producto');
    
    productos.forEach(producto => {
      const img = producto.querySelector('img');
      if (!img) return;
      
      // Buscar el span de stock existente
      const stockSpan = producto.querySelector('.stock');
      
      // Crear contenedor de imagen si no existe
      let imagenContainer = producto.querySelector('.producto-imagen-container');
      if (!imagenContainer) {
        imagenContainer = document.createElement('div');
        imagenContainer.className = 'producto-imagen-container';
        img.parentNode.insertBefore(imagenContainer, img);
        imagenContainer.appendChild(img);
      }
      
      // Ocultar cualquier span de stock original
      if (stockSpan) {
        stockSpan.style.display = 'none';
      }
      
      // Solo crear badge si el producto está SIN STOCK
      const estaSinStock = stockSpan && stockSpan.classList.contains('sin-stock');
      
      // Eliminar cualquier badge existente primero
      const badgeExistente = imagenContainer.querySelector('.stock-badge');
      if (badgeExistente) {
        badgeExistente.remove();
      }
      
      // Solo crear badge si está sin stock
      if (estaSinStock) {
        const badgeStock = document.createElement('span');
        badgeStock.className = 'stock-badge sin-stock';
        badgeStock.textContent = 'Sin stock';
        imagenContainer.appendChild(badgeStock);
      }
      // Si tiene stock disponible, no crear ningún badge (card limpia)
    });
  }

  // ===== MODAL DE PRODUCTO =====
  
  /**
   * Inicializa el modal de producto con talles
   */
  function initModalProducto() {
    const modal = document.getElementById('modal-producto');
    const cerrarBtn = document.getElementById('cerrar-modal-producto');
    const productos = document.querySelectorAll('.producto');
    
    if (!modal) return;
    
    // Función para abrir el modal
    function abrirModal(producto) {
      const img = producto.querySelector('img');
      const nombre = producto.querySelector('h3');
      const precio = producto.querySelector('.precio');
      
      // Verificar si el producto está sin stock
      const stockSpan = producto.querySelector('.stock.sin-stock');
      const estaSinStock = stockSpan !== null;
      
      // Buscar información de talles (solo si tiene stock)
      const info = producto.querySelector('.info');
      let talles = [];
      
      if (info && !estaSinStock) {
        const parrafoTalle = Array.from(info.querySelectorAll('p')).find(
          p => p.textContent && p.textContent.includes('Talle:')
        );
        
        if (parrafoTalle) {
          const textoCompleto = parrafoTalle.textContent;
          const match = textoCompleto.match(/Talle:\s*(.+)/i);
          if (match) {
            const textoTalles = match[1].trim();
            talles = parsearTalles(textoTalles);
          }
        }
      }
      
      // Llenar el modal
      if (img) {
        document.getElementById('modal-img').src = img.src;
        document.getElementById('modal-img').alt = img.alt || '';
      }
      
      if (nombre) {
        document.getElementById('modal-nombre').textContent = nombre.textContent.trim();
      }
      
      if (precio) {
        document.getElementById('modal-precio').textContent = precio.textContent.trim();
      }
      
      // Mostrar/ocultar indicador de stock en el modal
      const modalStock = document.getElementById('modal-stock');
      if (estaSinStock) {
        modalStock.textContent = 'Sin stock';
        modalStock.className = 'modal-stock sin-stock';
        modalStock.style.display = 'block';
      } else {
        modalStock.style.display = 'none';
      }
      
      // Manejar sección de talles según el estado de stock
      const contenedorTalles = document.getElementById('modal-talles');
      const contenedorTallesPadre = document.querySelector('.modal-talles-container');
      
      if (estaSinStock) {
        // Si está sin stock, ocultar completamente la sección de talles
        if (contenedorTallesPadre) {
          contenedorTallesPadre.style.display = 'none';
        }
      } else {
        // Si tiene stock, mostrar la sección de talles
        if (contenedorTallesPadre) {
          contenedorTallesPadre.style.display = 'block';
        }
        
        contenedorTalles.innerHTML = '';
        
        if (talles.length > 0) {
          talles.forEach(talle => {
            const badge = document.createElement('span');
            badge.className = 'modal-talle-badge';
            badge.textContent = talle.trim();
            contenedorTalles.appendChild(badge);
          });
        } else {
          const sinTalles = document.createElement('p');
          sinTalles.textContent = 'No hay talles disponibles';
          sinTalles.style.color = '#999';
          sinTalles.style.fontSize = '0.9rem';
          contenedorTalles.appendChild(sinTalles);
        }
      }
      
      // Mostrar modal
      modal.classList.add('mostrar');
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
    
    // Función para cerrar el modal
    function cerrarModal() {
      modal.classList.remove('mostrar');
      document.body.style.overflow = ''; // Restaurar scroll
    }
    
    // Event listeners para abrir modal
    productos.forEach(producto => {
      producto.addEventListener('click', (e) => {
        // No abrir si se hace click en el badge de stock
        if (e.target.classList.contains('stock-badge')) return;
        abrirModal(producto);
      });
    });
    
    // Event listeners para cerrar modal
    if (cerrarBtn) {
      cerrarBtn.addEventListener('click', cerrarModal);
    }
    
    // Cerrar al hacer click fuera del contenido
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModal();
      }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('mostrar')) {
        cerrarModal();
      }
    });
  }

  // ===== INICIALIZACIÓN =====
  
  /**
   * Inicializa todas las funcionalidades cuando el DOM está listo
   */
  function init() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Inicializar todas las funcionalidades
    initToggleSecciones();
    crearBadgeStock();
    initModalProducto();
  }

  // Iniciar
  init();

})();
