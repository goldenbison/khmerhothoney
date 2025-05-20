import { submitContactForm } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span data-en="Sending..." data-km="កំពុងផ្ញើ...">Sending...</span>';
            submitBtn.disabled = true;
            
            // Get form values
            const name = document.getElementById('name').value;
            const emailPhone = document.getElementById('email_phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Prepare form data
            const formData = {
                name: name,
                email_phone: emailPhone,
                subject: subject,
                message: message,
                page: 'contact',
                language: document.getElementById('lang-toggle').getAttribute('data-current') || 'en'
            };
            
            // Save to Firebase
            submitContactForm(formData)
                .then(() => {
                    console.log('Message sent successfully!');
                    
                    // Reset the form
                    contactForm.reset();
                    
                    // Restore button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    formSuccess.classList.remove('hidden');
                    formSuccess.classList.add('visible');
                    
                    // Scroll to success message
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formSuccess.classList.remove('visible');
                        formSuccess.classList.add('hidden');
                    }, 5000);
                })
                .catch((error) => {
                    console.error('Error sending message: ', error);
                    
                    // Restore button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Show error message
                    alert('There was an error sending your message. Please try again later.');
                });
        });
    }
});