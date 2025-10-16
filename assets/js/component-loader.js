// Component Loader - Carga componentes HTML dinámicamente
class ComponentLoader {
    constructor() {
        this.cache = new Map();
        this.loadComponents();
    }

    async loadComponents() {
        try {
            // Cargar header si existe el contenedor
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                await this.loadComponent('components/header.html', headerContainer);
            }

            // Cargar footer si existe el contenedor
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                await this.loadComponent('components/footer.html', footerContainer);
            }

            // Cargar modal de contacto si existe el contenedor
            const contactModalContainer = document.getElementById('contact-modal-container');
            if (contactModalContainer) {
                await this.loadComponent('components/forms/contact-form.html', contactModalContainer);
            }

            // Cargar newsletter si existe el contenedor
            const newsletterContainer = document.getElementById('newsletter-container');
            if (newsletterContainer) {
                await this.loadComponent('components/forms/newsletter-form.html', newsletterContainer);
            }

            // Inicializar scripts después de cargar componentes
            this.initializeScripts();

        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    async loadComponent(path, container) {
        try {
            // Verificar cache
            if (this.cache.has(path)) {
                container.innerHTML = this.cache.get(path);
                return;
            }

            // Cargar desde archivo
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${path}: ${response.status}`);
            }

            const html = await response.text();
            
            // Guardar en cache
            this.cache.set(path, html);
            
            // Insertar en contenedor
            container.innerHTML = html;

            // Ejecutar scripts inline del componente
            this.executeScripts(container);

        } catch (error) {
            console.error(`Error loading component ${path}:`, error);
            container.innerHTML = `<div class="component-error">Error loading component</div>`;
        }
    }

    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                // Script externo
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.async = script.async;
                newScript.defer = script.defer;
                document.head.appendChild(newScript);
            } else {
                // Script inline
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.head.appendChild(newScript);
            }
        });
    }

    initializeScripts() {
        // Re-inicializar cualquier funcionalidad que dependa de los componentes cargados
        
        // Trigger custom event para notificar que los componentes están listos
        const event = new CustomEvent('componentsLoaded', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(event);

        // Reinicializar formularios si forms.js está disponible
        if (typeof initializeForms === 'function') {
            initializeForms();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});

// Exportar para uso manual si es necesario
window.ComponentLoader = ComponentLoader;