/**
 * Forms JavaScript for XXX Hospitality website
 * Handles form validation, submission, and interactions
 */

// Global form variables
let formValidationRules = {};
let isProcessingForm = false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
    initializeFormValidation();
    initializeNewsletterForm();
    
    console.log('Form scripts loaded successfully');
});

/**
 * Initialize all forms
 */
function initializeForms() {
    // Add form event listeners
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        addFormListeners(form);
    });
    
    // Initialize custom form elements
    initializeCustomSelects();
    initializeFileUploads();
    initializeFormAnimations();
}

/**
 * Add event listeners to forms
 */
function addFormListeners(form) {
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });
}

/**
 * Form validation
 */
function initializeFormValidation() {
    // Set up validation rules
    formValidationRules = {
        required: function(value) {
            return value.trim() !== '';
        },
        email: function(value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },
        phone: function(value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
        },
        minLength: function(value, min) {
            return value.length >= min;
        },
        maxLength: function(value, max) {
            return value.length <= max;
        }
    };
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (field.hasAttribute('required') || field.classList.contains('required')) {
        if (!formValidationRules.required(value)) {
            isValid = false;
            errorMessage = 'This field is required';
        }
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        if (!formValidationRules.email(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value !== '') {
        if (!formValidationRules.phone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Checkbox validation for required checkboxes
    if (field.type === 'checkbox' && field.hasAttribute('required')) {
        if (!field.checked) {
            isValid = false;
            errorMessage = 'Please check this box to continue';
        }
    }
    
    // Update field appearance
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    
    field.parentElement.appendChild(errorElement);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Validate entire form
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Handle form submission
 */
function handleFormSubmission(form) {
    if (isProcessingForm) {
        return false;
    }
    
    // Validate form
    if (!validateForm(form)) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
    }
    
    // Set processing state
    isProcessingForm = true;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Update button state
    if (submitButton) {
        submitButton.innerHTML = 'Processing...';
        submitButton.classList.add('processing');
        submitButton.disabled = true;
    }
    
    // Prepare form data
    const formData = new FormData(form);
    
    // Add spam protection
    const honeyPot = form.querySelector('input[name="tex_nickname"]');
    if (honeyPot && honeyPot.value !== '') {
        console.log('Spam detected');
        resetFormButton(submitButton, originalButtonText);
        return false;
    }
    
    // Add validation token
    formData.append('tr4pValidation', '1');
    formData.append('operation', 'custom_form_process');
    
    // Submit form
    submitForm(formData, form, submitButton, originalButtonText);
}

/**
 * Submit form via AJAX
 */
function submitForm(formData, form, submitButton, originalButtonText) {
    // Simulate form submission (replace with actual endpoint)
    const endpoint = '/ajax/functions.php'; // Replace with actual form handler
    
    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        handleFormResponse(data, form);
    })
    .catch(error => {
        console.error('Form submission error:', error);
        handleFormError(form, 'An error occurred. Please try again later.');
    })
    .finally(() => {
        resetFormButton(submitButton, originalButtonText);
        isProcessingForm = false;
    });
}

/**
 * Handle form response
 */
function handleFormResponse(data, form) {
    if (data.error) {
        handleFormError(form, data.msg || 'An error occurred. Please try again.');
        
        // Handle field-specific errors
        if (data.data) {
            data.data.forEach(errorField => {
                const field = form.querySelector(`[name="${errorField.field}"]`);
                if (field) {
                    showFieldError(field, errorField.error);
                }
            });
        }
    } else {
        handleFormSuccess(form, data);
    }
}

/**
 * Handle form error
 */
function handleFormError(form, message) {
    const errorContainer = form.querySelector('.form-error') || createErrorContainer(form);
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    
    // Scroll to error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Handle form success
 */
function handleFormSuccess(form, data) {
    const successContainer = form.querySelector('.form-module__confirmation');
    
    if (successContainer) {
        successContainer.style.display = 'block';
        
        // Hide form and show success message
        slideUp(form, 800, function() {
            fadeIn(successContainer);
        });
        
        // Scroll to success message
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Reset form
    setTimeout(() => {
        form.reset();
        clearAllFieldErrors(form);
    }, 1000);
    
    // Analytics tracking
    if (IS_LIVE) {
        trackFormSubmission(form, data);
    }
    
    // Close modal if form is in modal
    const modal = form.closest('.fancy-contactUs-form');
    if (modal) {
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 2000);
    }
}

/**
 * Create error container
 */
function createErrorContainer(form) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        border: 1px solid #f5c6cb;
        display: none;
    `;
    
    form.insertBefore(errorContainer, form.firstChild);
    return errorContainer;
}

/**
 * Reset form button
 */
function resetFormButton(button, originalText) {
    if (button) {
        button.innerHTML = originalText;
        button.classList.remove('processing');
        button.disabled = false;
    }
}

/**
 * Clear all field errors
 */
function clearAllFieldErrors(form) {
    const errorFields = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
    
    const formError = form.querySelector('.form-error');
    if (formError) {
        formError.style.display = 'none';
    }
}

/**
 * Newsletter form handling
 */
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('email-signup');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission(this);
        });
    }
}

/**
 * Handle newsletter submission
 */
function handleNewsletterSubmission(form) {
    if (isProcessingForm) {
        return false;
    }
    
    // Validate newsletter form
    if (!validateForm(form)) {
        return false;
    }
    
    // Set processing state
    isProcessingForm = true;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    if (submitButton) {
        submitButton.innerHTML = 'Processing...';
        submitButton.disabled = true;
    }
    
    // Prepare data
    const formData = new FormData(form);
    formData.append('operation', 'newsletter_signup');
    
    // Submit
    fetch('/ajax/newsletter.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            handleFormError(form, data.msg);
        } else {
            // Show success message
            const thankyouMsg = form.parentElement.querySelector('.thankyouMsg');
            if (thankyouMsg) {
                slideUp(form, 500, function() {
                    fadeIn(thankyouMsg);
                });
            }
            
            // Analytics
            if (IS_LIVE && typeof dataLayer !== 'undefined') {
                dataLayer.push({ 'event': 'signup' });
            }
        }
    })
    .catch(error => {
        console.error('Newsletter signup error:', error);
        handleFormError(form, 'An error occurred. Please try again later.');
    })
    .finally(() => {
        resetFormButton(submitButton, originalButtonText);
        isProcessingForm = false;
    });
}

/**
 * Initialize custom select elements
 */
function initializeCustomSelects() {
    const selects = document.querySelectorAll('select.custom-select');
    
    selects.forEach(select => {
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);
        
        // Add custom styling and functionality
        wrapper.addEventListener('click', function() {
            this.classList.toggle('open');
        });
        
        select.addEventListener('change', function() {
            wrapper.classList.remove('open');
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('open');
            }
        });
    });
}

/**
 * Initialize file upload functionality
 */
function initializeFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.className = 'file-upload-wrapper';
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'file-upload-button btn';
        button.textContent = 'Choose File';
        
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = 'No file chosen';
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(button);
        wrapper.appendChild(fileName);
        wrapper.appendChild(input);
        
        input.style.display = 'none';
        
        button.addEventListener('click', function() {
            input.click();
        });
        
        input.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = 'No file chosen';
            }
        });
    });
}

/**
 * Initialize form animations
 */
function initializeFormAnimations() {
    // Floating labels
    const inputs = document.querySelectorAll('.form-module__field input, .form-module__field textarea');
    
    inputs.forEach(input => {
        // Add focus/blur animations
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check initial value
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
}

/**
 * Track form submissions for analytics
 */
function trackFormSubmission(form, data) {
    const formName = form.id || form.className || 'unknown_form';
    
    // Google Analytics
    if (typeof ga === 'function') {
        ga('send', 'event', 'form', 'form submission', formName);
    }
    
    // Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'forms',
            'form_name': formName,
            'form_id': form.id,
            'form_title': formName
        });
    }
    
    console.log('Form submission tracked:', formName);
}

/**
 * Utility function to serialize form data to array
 */
function serializeDataToArray(formId) {
    const serializeDataArray = [];
    const formData = new FormData(document.getElementById(formId));
    
    formData.forEach(function(value, key) {
        serializeDataArray.push({ name: key, value: value });
    });
    
    return serializeDataArray;
}

/**
 * Form validation callback for external use
 */
window.callbackFormValidate = function(options) {
    const form = options.formElement;
    const submitHandler = options.submitHandler;
    
    if (form && submitHandler) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                submitHandler(form);
            } else {
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
};

// Export functions for global use
window.validateField = validateField;
window.validateForm = validateForm;
window.clearFieldError = clearFieldError;
window.showFieldError = showFieldError;
window.serializeDataToArray = serializeDataToArray;