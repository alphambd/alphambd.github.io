// Initialisation d'EmailJS
(function() {
    // Public Key
    emailjs.init("BAAo_qj-gTWobEPXT");
    console.log("EmailJS initialisé avec succès");
})();

// Quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Générer un ID unique pour chaque soumission
        document.getElementById('contact_number').value = Date.now();
        
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validation simple
            if (!contactForm.checkValidity()) {
                alert('Veuillez remplir tous les champs obligatoires correctement.');
                return;
            }
            
            // Récupérer le bouton d'envoi
            const submitBtn = this.querySelector('.send-btn');
            const originalHTML = submitBtn.innerHTML;
            
            // Afficher l'état "envoi en cours"
            submitBtn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            // Masquer les messages précédents
            document.getElementById('success-message').style.display = 'none';
            document.getElementById('error-message').style.display = 'none';
            
            // Ajouter la date, l'heure et l'URL de la page
            const now = new Date();
            const dateInput = document.createElement('input');
            dateInput.type = 'hidden';
            dateInput.name = 'date';
            dateInput.value = now.toLocaleDateString('fr-FR');
            this.appendChild(dateInput);
            
            const timeInput = document.createElement('input');
            timeInput.type = 'hidden';
            timeInput.name = 'time';
            timeInput.value = now.toLocaleTimeString('fr-FR');
            this.appendChild(timeInput);
            
            const pageUrlInput = document.createElement('input');
            pageUrlInput.type = 'hidden';
            pageUrlInput.name = 'page_url';
            pageUrlInput.value = window.location.href;
            this.appendChild(pageUrlInput);
            
            // Envoyer l'email avec EmailJS
            emailjs.sendForm(
                'portfolio_service_id',      // Service ID
                'template_2opc5qn',          // Template ID
                this
            )
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Afficher le message de succès
                document.getElementById('success-message').style.display = 'flex';
                
                // Réinitialiser le formulaire
                contactForm.reset();
                document.getElementById('contact_number').value = Date.now();
                
                // Scroll doux vers le message de succès
                document.getElementById('success-message').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Réinitialiser le bouton après 5 secondes
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    document.getElementById('success-message').style.display = 'none';
                }, 5000);
                
            }, function(error) {
                console.error('FAILED...', error);
                
                // Afficher le message d'erreur
                document.getElementById('error-message').style.display = 'flex';
                
                // Message d'erreur plus spécifique
                let errorMsg = 'Erreur - Cliquez pour réessayer';
                if (error.status === 0) {
                    errorMsg = 'Problème de connexion - Vérifiez internet';
                } else if (error.status === 400) {
                    errorMsg = 'Formulaire invalide - Vérifiez les champs';
                }
                
                submitBtn.innerHTML = `<i class="ri-error-warning-line"></i> ${errorMsg}`;
                
                // Réactiver le bouton après 4 secondes
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    document.getElementById('error-message').style.display = 'none';
                }, 4000);
            });
        });
    }
});