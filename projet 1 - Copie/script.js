/**
 * LivrExpress - Bobo-Dioulasso
 * JavaScript interactif pour la Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. Navigation Mobile & Menu Hamburger
       ========================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            hamburgerBtn.classList.toggle('open');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });

        // Fermer le menu lors du clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburgerBtn.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Fermer le menu si clic en dehors
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                hamburgerBtn.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ==========================================================
       2. Sticky Navbar & Effet d'Ombre au Scroll
       ========================================================== */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        highlightActiveSection();
    });

    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ==========================================================
       3. Simulateur Express de Prix (Bobo-Dioulasso)
       ========================================================== */
    const selectDepart = document.getElementById('calc-quartier-depart');
    const selectArrivee = document.getElementById('calc-quartier-arrivee');
    const priceDisplay = document.getElementById('calc-price-display');

    function calculateEstimatedPrice() {
        if (!selectDepart || !selectArrivee || !priceDisplay) return;

        const depart = selectDepart.value;
        const arrivee = selectArrivee.value;

        // Même quartier
        if (depart === arrivee) {
            priceDisplay.textContent = '1 000 FCFA';
            return;
        }

        // Distance moyenne / inter-quartier normal
        const proches = [
            ['centre', 'accart'],
            ['centre', 'koko'],
            ['accart', 'lafiabougou'],
            ['sarfalao', 'bindougou']
        ];

        const isProche = proches.some(([q1, q2]) => 
            (depart === q1 && arrivee === q2) || (depart === q2 && arrivee === q1)
        );

        if (isProche) {
            priceDisplay.textContent = '1 000 FCFA';
        } else {
            // Traversée de Bobo (ex: Grand Marché vers Sarfalao ou Bindougou)
            priceDisplay.textContent = '1 500 FCFA';
        }
    }

    if (selectDepart && selectArrivee) {
        selectDepart.addEventListener('change', calculateEstimatedPrice);
        selectArrivee.addEventListener('change', calculateEstimatedPrice);
        calculateEstimatedPrice();
    }

    /* ==========================================================
       4. Modal de Commande Instantanée
       ========================================================== */
    const orderModal = document.getElementById('order-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const openModalBtns = document.querySelectorAll('.open-order-modal');
    const packageSelect = document.getElementById('package-type');
    const pickupInput = document.getElementById('pickup-loc');
    const dropoffInput = document.getElementById('dropoff-loc');
    const orderForm = document.getElementById('order-form');

    function openModal(prefillPlan = null) {
        if (!orderModal) return;
        orderModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Pré-remplir selon l'offre cliquée
        if (prefillPlan && packageSelect) {
            if (prefillPlan.includes('Proximité') || prefillPlan.includes('1 000')) {
                packageSelect.value = 'Course Proximité / Colis léger (1 000 FCFA)';
            } else if (prefillPlan.includes('Inter-Quartiers') || prefillPlan.includes('1 500')) {
                packageSelect.value = 'Course Inter-Quartiers / E-commerce (1 500 FCFA)';
            } else if (prefillPlan.includes('25 000') || prefillPlan.includes('Entreprise') || prefillPlan.includes('Pro')) {
                packageSelect.value = 'Pack Entreprise Mensuel (25 000 FCFA)';
            }
        }

        // Si déclenché par le simulateur, préremplir les quartiers
        if (selectDepart && selectArrivee && pickupInput && dropoffInput) {
            const depText = selectDepart.options[selectDepart.selectedIndex]?.text;
            const arrText = selectArrivee.options[selectArrivee.selectedIndex]?.text;
            if (depText && !pickupInput.value) {
                pickupInput.value = depText;
            }
            if (arrText && !dropoffInput.value) {
                dropoffInput.value = arrText;
            }
        }
    }

    function closeModal() {
        if (!orderModal) return;
        orderModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = btn.getAttribute('data-plan');
            openModal(plan);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && orderModal && orderModal.classList.contains('open')) {
            closeModal();
        }
    });

    /* ==========================================================
       5. Soumission du Formulaire (Redirection WhatsApp & Toast)
       ========================================================== */
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('order-name').value.trim();
            const phone = document.getElementById('order-phone').value.trim();
            const pickup = document.getElementById('pickup-loc').value.trim();
            const dropoff = document.getElementById('dropoff-loc').value.trim();
            const packageType = document.getElementById('package-type').value;
            const notes = document.getElementById('order-notes').value.trim();

            // Création du message pré-formaté pour WhatsApp
            const message = `*📦 NOUVELLE DEMANDE LIVREXPRESS BOBO*%0A%0A` +
                `*Client :* ${encodeURIComponent(name)}%0A` +
                `*Téléphone :* ${encodeURIComponent(phone)}%0A` +
                `*Point de départ :* ${encodeURIComponent(pickup)}%0A` +
                `*Destination :* ${encodeURIComponent(dropoff)}%0A` +
                `*Formule / Colis :* ${encodeURIComponent(packageType)}%0A` +
                (notes ? `*Instructions :* ${encodeURIComponent(notes)}%0A` : '') +
                `%0A_Envoyé depuis la plateforme LivrExpress Bobo-Dioulasso_`;

            const whatsappNumber = '22670000000'; // Numéro officiel Bobo
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

            // Fermer modal
            closeModal();

            // Afficher toast de succès
            showToast('Votre commande est prête ! Redirection vers WhatsApp...');

            // Ouvrir WhatsApp après un léger délai
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                orderForm.reset();
            }, 800);
        });
    }

    /* ==========================================================
       6. Toast Notification Utile
       ========================================================== */
    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        const toastMsg = document.getElementById('toast-message');

        if (!toast) return;

        if (toastMsg) {
            toastMsg.textContent = message;
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    /* ==========================================================
       7. Animation des statistiques au défilement
       ========================================================== */
    const statCards = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function checkStatsInView() {
        if (hasAnimatedStats || statCards.length === 0) return;

        const firstStat = statCards[0];
        const rect = firstStat.getBoundingClientRect();

        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            hasAnimatedStats = true;
            // Légère impulsion visuelle
            statCards.forEach(stat => {
                stat.style.transform = 'scale(1.08)';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                    stat.style.transition = 'transform 0.3s ease';
                }, 250);
            });
        }
    }

    window.addEventListener('scroll', checkStatsInView);
    checkStatsInView();

});
