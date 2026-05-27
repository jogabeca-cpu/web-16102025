# 📋 Documentación: Comportamiento del Navbar con Scroll

## 🎯 Resumen

El navbar ahora tiene un comportamiento dinámico que cambia su apariencia según la posición del scroll del usuario, sin necesidad de reconstruir el navbar existente.

---

## 🔄 Estados del Navbar

### 1️⃣ Estado Inicial (Transparente)
**Cuándo:** Al cargar la página o cuando el usuario está en la parte superior (scroll < 50px)

**Características:**
- Fondo completamente transparente
- Sin sombra
- Se integra con el fondo de la página
- Clase CSS aplicada: `.transparent`

**CSS:**
```css
.header.transparent {
    background-color: transparent;
    backdrop-filter: none;
    box-shadow: none;
}
```

---

### 2️⃣ Estado con Scroll (Sólido)
**Cuándo:** Después de hacer scroll más de 50px hacia abajo

**Características:**
- Fondo negro sólido con opacidad 95%
- Sombra pronunciada
- Efecto blur en el fondo
- Animación de los enlaces del menú
- Clase CSS aplicada: `.scrolled`

**CSS:**
```css
.header.scrolled {
    background-color: rgba(0, 0, 0, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
}
```

---

## ✨ Animaciones Implementadas

### 1. Transición del Navbar
- **Duración:** 0.4 segundos
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design)
- **Efecto:** Suave y profesional

```css
.header {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

### 2. Animación de Enlaces del Menú
Cuando el navbar cambia a estado "scrolled", cada enlace aparece con una animación escalonada:

**Efecto:**
- Fade in (opacidad 0 → 1)
- Slide down (translateY -10px → 0)
- Delays escalonados por cada enlace (0.1s, 0.15s, 0.2s, etc.)

**Código:**
```css
@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.header.scrolled .privary-navigation__item {
    animation: slideInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

---

### 3. Efecto Hover en Enlaces
Línea animada que aparece debajo del enlace al hacer hover:

```css
.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #2c5aa0;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover::after {
    width: 100%;
}
```

---

### 4. Reducción del Logo
El logo se reduce ligeramente al hacer scroll:

```css
.header.scrolled .header__logo {
    transform: scale(0.95);
}
```

---

### 5. Padding Dinámico
El padding del menú se reduce para hacer el navbar más compacto:

```css
.header.scrolled .header__menu {
    padding-top: 10px;
    padding-bottom: 10px;
}
```

---

## 🧠 Lógica JavaScript

### Funcionamiento

```javascript
function initializeNavigation() {
    const header = document.getElementById('header');
    let scrollThreshold = 50; // Umbral de scroll en pixels
    let ticking = false;

    // Estado inicial: transparente
    header.classList.add('transparent');

    // Scroll handler optimizado con requestAnimationFrame
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > scrollThreshold) {
            // Scroll > 50px: Aplicar estado scrolled
            if (!header.classList.contains('scrolled')) {
                header.classList.remove('transparent');
                header.classList.add('scrolled');
            }
        } else {
            // Scroll <= 50px: Aplicar estado transparente
            if (header.classList.contains('scrolled')) {
                header.classList.remove('scrolled');
                header.classList.add('transparent');
            }
        }
    }

    // Verificar posición inicial al cargar
    handleScroll();
}
```

---

## ⚙️ Optimizaciones Implementadas

### 1. RequestAnimationFrame
- Sincroniza las actualizaciones con el refresh rate del navegador (60 FPS)
- Evita múltiples cálculos innecesarios
- Mejora el rendimiento

### 2. Passive Event Listener
```javascript
{ passive: true }
```
- Permite que el navegador optimice el scroll
- Mejora la fluidez en dispositivos móviles

### 3. Debouncing Manual
```javascript
if (!ticking) {
    // Solo ejecutar si no hay una actualización pendiente
}
```
- Evita ejecutar el código múltiples veces por frame

---

## 📂 Archivos Modificados

### 1. `assets/css/custom.css`
- Agregado comportamiento de scroll del header
- Definición de estados `.transparent` y `.scrolled`
- Animaciones de enlaces y efectos hover

### 2. `assets/js/scripts.js`
- Función `initializeNavigation()` actualizada
- Lógica de detección de scroll mejorada
- Optimizaciones de rendimiento

### 3. `assets/css/style.css`
- Removido `background-color` fijo del `.header`
- Permitir que custom.css maneje el comportamiento dinámico

---

## 🎨 Personalización

### Cambiar el umbral de scroll
```javascript
let scrollThreshold = 50; // Cambiar este valor (pixels)
```

### Modificar la velocidad de transición
```css
.header {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    /* Cambiar 0.4s por el tiempo deseado */
}
```

### Ajustar color de fondo al hacer scroll
```css
.header.scrolled {
    background-color: rgba(0, 0, 0, 0.95);
    /* Cambiar color y opacidad según preferencia */
}
```

### Modificar delays de animación de enlaces
```css
.header.scrolled .privary-navigation__item:nth-child(1) {
    animation-delay: 0.1s; /* Primer enlace */
}
.header.scrolled .privary-navigation__item:nth-child(2) {
    animation-delay: 0.15s; /* Segundo enlace */
}
/* ... y así sucesivamente */
```

---

## ✅ Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Responsive (móvil y desktop)
- ✅ Optimizado para rendimiento

---

## 🚀 Resultado Final

### Estado Inicial
- Navbar completamente transparente
- Se integra con el fondo de la página
- Sin sombras ni efectos visuales pesados

### Al Hacer Scroll
- Transición suave a fondo sólido (0.4s)
- Enlaces aparecen con animación escalonada
- Logo se reduce sutilmente
- Sombra y blur aparecen gradualmente
- Padding se compacta para ahorrar espacio

### Experiencia del Usuario
- Fluida y profesional
- Sin interrupciones visuales bruscas
- Optimizada para 60 FPS
- Funciona en todas las páginas del sitio

---

## 📝 Notas Importantes

1. **No se modificó la estructura HTML del navbar** - Solo comportamiento CSS/JS
2. **Funciona automáticamente en todas las páginas** - scripts.js se carga globalmente
3. **Respeta el diseño original** - Solo cambia el fondo y añade animaciones sutiles
4. **Optimizado para rendimiento** - Usa requestAnimationFrame y passive listeners

---

**Autor:** Claude Code
**Fecha:** 2025-12-17
**Versión:** 1.0
