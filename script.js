// Main JavaScript file for Grand Hotel Website

// ===== Booking Form Handler =====
document.addEventListener('DOMContentLoaded', function() {
    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Room type prices
        const roomPrices = {
            'standard': 500000,
            'deluxe': 800000,
            'suite': 1500000
        };

        // Get form elements
        const roomTypeSelect = document.getElementById('roomType');
        const roomCountInput = document.getElementById('roomCount');
        const checkInInput = document.getElementById('checkIn');
        const checkOutInput = document.getElementById('checkOut');

        // Update summary when inputs change
        if (roomTypeSelect) {
            roomTypeSelect.addEventListener('change', updateBookingSummary);
        }
        if (roomCountInput) {
            roomCountInput.addEventListener('input', updateBookingSummary);
        }
        if (checkInInput) {
            checkInInput.addEventListener('change', updateBookingSummary);
        }
        if (checkOutInput) {
            checkOutInput.addEventListener('change', updateBookingSummary);
        }

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        if (checkInInput) {
            checkInInput.setAttribute('min', today);
        }

        // Update checkout min date when checkin changes
        if (checkInInput && checkOutInput) {
            checkInInput.addEventListener('change', function() {
                const checkInDate = new Date(this.value);
                checkInDate.setDate(checkInDate.getDate() + 1);
                const minCheckOut = checkInDate.toISOString().split('T')[0];
                checkOutInput.setAttribute('min', minCheckOut);
                
                // Reset checkout if it's before new minimum
                if (checkOutInput.value && checkOutInput.value <= this.value) {
                    checkOutInput.value = '';
                }
            });
        }

        // Update booking summary
        function updateBookingSummary() {
            const roomType = roomTypeSelect?.value;
            const roomCount = parseInt(roomCountInput?.value) || 0;
            const checkIn = checkInInput?.value;
            const checkOut = checkOutInput?.value;

            // Update room type display
            const summaryRoomType = document.getElementById('summaryRoomType');
            if (summaryRoomType) {
                if (roomType) {
                    const roomNames = {
                        'standard': 'Standard Room',
                        'deluxe': 'Deluxe Room',
                        'suite': 'Suite Room'
                    };
                    summaryRoomType.textContent = roomNames[roomType] || '-';
                } else {
                    summaryRoomType.textContent = '-';
                }
            }

            // Update room count
            const summaryRoomCount = document.getElementById('summaryRoomCount');
            if (summaryRoomCount) {
                summaryRoomCount.textContent = roomCount > 0 ? `${roomCount} kamar` : '-';
            }

            // Update check-in
            const summaryCheckIn = document.getElementById('summaryCheckIn');
            if (summaryCheckIn) {
                summaryCheckIn.textContent = checkIn ? formatDate(checkIn) : '-';
            }

            // Update check-out
            const summaryCheckOut = document.getElementById('summaryCheckOut');
            if (summaryCheckOut) {
                summaryCheckOut.textContent = checkOut ? formatDate(checkOut) : '-';
            }

            // Calculate duration
            let nights = 0;
            if (checkIn && checkOut) {
                const date1 = new Date(checkIn);
                const date2 = new Date(checkOut);
                const diffTime = Math.abs(date2 - date1);
                nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            // Update duration
            const summaryDuration = document.getElementById('summaryDuration');
            if (summaryDuration) {
                summaryDuration.textContent = nights > 0 ? `${nights} malam` : '-';
            }

            // Calculate prices
            const pricePerNight = roomType ? roomPrices[roomType] : 0;
            const subtotal = pricePerNight * nights * roomCount;
            const tax = subtotal * 0.1;
            const total = subtotal + tax;

            // Update price displays
            const summaryPricePerNight = document.getElementById('summaryPricePerNight');
            if (summaryPricePerNight) {
                summaryPricePerNight.textContent = formatCurrency(pricePerNight);
            }

            const summaryNights = document.getElementById('summaryNights');
            if (summaryNights) {
                summaryNights.textContent = `${nights} x ${roomCount}`;
            }

            const summarySubtotal = document.getElementById('summarySubtotal');
            if (summarySubtotal) {
                summarySubtotal.textContent = formatCurrency(subtotal);
            }

            const summaryTax = document.getElementById('summaryTax');
            if (summaryTax) {
                summaryTax.textContent = formatCurrency(tax);
            }

            const summaryTotal = document.getElementById('summaryTotal');
            if (summaryTotal) {
                summaryTotal.textContent = formatCurrency(total);
            }
        }

        // Form submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const roomType = roomTypeSelect.value;
            const checkIn = checkInInput.value;
            const checkOut = checkOutInput.value;

            // Validate
            if (!fullName || !email || !phone || !roomType || !checkIn || !checkOut) {
                alert('Mohon lengkapi semua field yang wajib diisi!');
                return;
            }

            // Check if checkout is after checkin
            if (new Date(checkOut) <= new Date(checkIn)) {
                alert('Tanggal check-out harus setelah tanggal check-in!');
                return;
            }

            // Check terms agreement
            const agreeTerms = document.getElementById('agreeTerms').checked;
            if (!agreeTerms) {
                alert('Anda harus menyetujui syarat dan ketentuan!');
                return;
            }

            // Success message
            alert('Pemesanan berhasil!\n\nTerima kasih atas pemesanan Anda. Kami akan mengirimkan konfirmasi ke email Anda segera.');
            
            // Redirect to history page
            window.location.href = 'history.html';
        });

        // Initialize summary on page load
        updateBookingSummary();

        // Pre-fill room type from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const roomParam = urlParams.get('room');
        if (roomParam && roomTypeSelect) {
            roomTypeSelect.value = roomParam;
            updateBookingSummary();
        }
    }
});

// ===== Helper Functions =====
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
}

// ===== Smooth Scroll =====
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

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.classList.contains('fixed-top')) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
    }
});