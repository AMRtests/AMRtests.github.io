// Esperamos a que se cargue completamente el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos todos los elementos necesarios
    const envelopes = document.querySelectorAll('.envelope');
    const vouchers = document.querySelectorAll('.voucher');
    const modal = document.getElementById('voucherModal');
    const modalContent = document.getElementById('modal-voucher-content');
    const closeModal = document.querySelector('.close-modal');

    // Variable para trackear qué vales han sido abiertos
    let openedEnvelopes = new Set();

    // Función para crear efectos de partículas
    function createParticles(element) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = '#ffd700';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            const rect = element.getBoundingClientRect();
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(particle);
            
            // Animación de la partícula
            const angle = (i / 10) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const duration = 800 + Math.random() * 400;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                document.body.removeChild(particle);
            };
        }
    }

    // Función para reproducir sonido (opcional, usando Web Audio API)
    function playOpenSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    // Función para abrir un sobre
    function openEnvelope(envelope, voucherId) {
        const envelopeNumber = envelope.dataset.envelope;
        
        // Si ya está abierto, mostrar el modal directamente
        if (openedEnvelopes.has(envelopeNumber)) {
            showVoucherModal(voucherId);
            return;
        }

        // Marcar como abierto
        openedEnvelopes.add(envelopeNumber);
        
        // Añadir clase de abierto al sobre
        envelope.classList.add('opened');
        
        // Crear efecto de partículas
        createParticles(envelope);
        
        // Reproducir sonido (comentado por defecto para evitar problemas de autoplay)
        // try { playOpenSound(); } catch(e) { console.log('No se pudo reproducir el sonido'); }
        
        // Esperar a que termine la animación del sobre y mostrar el vale
        setTimeout(() => {
            const voucher = document.getElementById(voucherId);
            voucher.classList.remove('hidden');
            
            // Pequeño delay para la animación del vale
            setTimeout(() => {
                voucher.classList.add('show');
                
                // Auto-mostrar el modal después de un momento
                setTimeout(() => {
                    showVoucherModal(voucherId);
                }, 1500);
            }, 100);
        }, 600);
    }

    // Función para mostrar el modal con el vale completo
    function showVoucherModal(voucherId) {
        const voucher = document.getElementById(voucherId);
        const voucherContent = voucher.querySelector('.voucher-content').cloneNode(true);
        
        // Limpiar el contenido anterior del modal
        modalContent.innerHTML = '';
        modalContent.appendChild(voucherContent);
        
        // Añadir instrucciones específicas según el vale
        const instructionsInfo = document.createElement('div');
        let instructionsText = '';
        
        switch(voucherId) {
            case 'voucher-1':
                instructionsText = `
                    <div class="instructions-text">
                        <p><strong>Pista:</strong></p>
                        <p>Son unas cositas que nos gusta mucho buscar juntos y encontrar los perfectos.</p>
                    </div>
                `;
                break;
            case 'voucher-2':
                instructionsText = `
                    <div class="instructions-text">
                        <p><strong>Pista:</strong></p>
                        <p>Es una cosa que quieres pero no creo que recuerdes. Es personalizado así que necesita tiempo de creación
                        ya que tu amorcito no ha estado en casa y tranquila para hacerlo, sorry mi amor.</p>
                    </div>
                `;
                break;
            case 'voucher-3':
                instructionsText = `
                    <div class="instructions-text">
                        <p><strong>Descripción:</strong></p>
                        <p>Esta opción sería un regalo a futuro, ya que te llegaría cuando esté contento con tu talla.</p>
                    </div>
                `;
                break;
            case 'voucher-4':
                instructionsText = `
                    <div class="instructions-text">
                        <p><strong>Descripción:</strong></p>
                        <p>Este regalo se pensó antes de que encontraras el de la barura. No obstante, como no tenemos casita donde
                        ponerlo, sería para la Noria o a futuro tambień.</p>
                    </div>
                `;
                break;
            case 'voucher-5':
                instructionsText = `
                    <div class="instructions-text">
                        <p><strong>Descripción:</strong></p>
                        <p>Este regalo es el más próximo, sería un día en la  nieve esquiando, con opción a dormir allí. Tendríamos
                        que ver viabilidad y esas cositas.</p>
                    </div>
                `;
                break;
        }
        
        instructionsInfo.innerHTML = instructionsText;
        modalContent.appendChild(instructionsInfo);
        
        // Mostrar el modal
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Función para cerrar el modal
    function closeModalFunction() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    // Event listeners para los sobres
    envelopes.forEach((envelope, index) => {
        envelope.addEventListener('click', function() {
            const envelopeNumber = this.dataset.envelope;
            const voucherId = `voucher-${envelopeNumber}`;
            
            openEnvelope(this, voucherId);
        });

        // Añadir efecto hover con sonido sutil
        envelope.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        envelope.addEventListener('mouseleave', function() {
            if (!this.classList.contains('opened')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // Event listeners para los vales (click directo en el vale)
    vouchers.forEach(voucher => {
        voucher.addEventListener('click', function() {
            showVoucherModal(this.id);
        });
    });

    // Event listeners para cerrar el modal
    closeModal.addEventListener('click', closeModalFunction);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunction();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalFunction();
        }
    });

    // Función para restablecer todos los sobres (útil para testing)
    window.resetAllEnvelopes = function() {
        openedEnvelopes.clear();
        envelopes.forEach(envelope => {
            envelope.classList.remove('opened');
            envelope.style.transform = '';
        });
        vouchers.forEach(voucher => {
            voucher.classList.remove('show');
            voucher.classList.add('hidden');
        });
        closeModalFunction();
        console.log('Todos los sobres han sido restablecidos. Escribe resetAllEnvelopes() en la consola para usar esta función.');
    };

    // Mensaje de bienvenida en la consola
    console.log('🎁 ¡Bienvenido a los Vales Especiales! 🎁');
    console.log('💡 Consejo: Puedes escribir resetAllEnvelopes() para restablecer todos los sobres.');
    
    // Efecto de carga inicial
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Función de confeti para celebrar cuando se abre un sobre
    function createConfetti(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '999';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            document.body.appendChild(confetti);
            
            const angle = (Math.random() * Math.PI * 2);
            const distance = 50 + Math.random() * 100;
            const gravity = 300 + Math.random() * 200;
            const duration = 1000 + Math.random() * 1000;
            
            confetti.animate([
                { 
                    transform: 'translate(0, 0) rotate(0deg)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + gravity}px) rotate(${360 * (Math.random() > 0.5 ? 1 : -1)}deg)`, 
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            };
        }
    }

    // Modificar la función openEnvelope para incluir confeti
    const originalOpenEnvelope = openEnvelope;
    openEnvelope = function(envelope, voucherId) {
        const rect = envelope.getBoundingClientRect();
        createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        originalOpenEnvelope(envelope, voucherId);
    };
});