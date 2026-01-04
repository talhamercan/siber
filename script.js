// ===== Navigation =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle?.addEventListener('click', () => navMenu.classList.toggle('active'));
navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
    navbar.style.background = scrollY > 50 ? 'rgba(15, 15, 26, 0.95)' : 'rgba(15, 15, 26, 0.8)';
});

// ===== Code Tabs =====
document.querySelectorAll('.code-tabs').forEach(tabContainer => {
    const tabs = tabContainer.querySelectorAll('.code-tab');
    const panels = tabContainer.nextElementSibling.querySelectorAll('.code-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const lang = tab.dataset.lang;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === lang) panel.classList.add('active');
            });
        });
    });
});

// ===== Copy Code =====
function copyCode(btn) {
    const codeBlock = btn.parentElement.querySelector('pre code');
    const text = codeBlock.innerText;
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✅ Kopyalandı!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '📋 Kopyala';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// ===== Demo Tabs =====
const demoTabs = document.querySelectorAll('.demo-tab');
const demoContents = document.querySelectorAll('.demo-content');

demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        demoTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        demoContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetId) content.classList.add('active');
        });
    });
});

// ===== SQL Injection Demo =====
const demoUsername = document.getElementById('demo-username');
const demoPassword = document.getElementById('demo-password');
const demoLoginBtn = document.getElementById('demo-login-btn');
const sqlOutput = document.getElementById('sql-output');
const demoResult = document.getElementById('demo-result');

function updateSQLDemo() {
    const username = demoUsername?.value || '';
    const password = demoPassword?.value || '';
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    if (sqlOutput) sqlOutput.textContent = query;

    const injectionPatterns = [
        /'\s*OR\s*'1'\s*=\s*'1/i, /'\s*OR\s*1\s*=\s*1/i, /--/, /;\s*DROP/i,
        /UNION\s+SELECT/i, /'\s*OR\s*'.*'\s*=\s*'/i, /'\s*;\s*/
    ];

    const isInjection = injectionPatterns.some(p => p.test(username) || p.test(password));
    const isDrop = /DROP\s+TABLE/i.test(username) || /DROP\s+TABLE/i.test(password);

    if (isDrop && demoResult) {
        demoResult.className = 'demo-result danger';
        demoResult.innerHTML = `<strong>💀 KRİTİK: DROP TABLE Saldırısı!</strong>
            <p style="margin-top:8px;font-size:0.9rem;">Bu saldırı tüm veritabanı tablosunu silmeye çalışır! Gerçek sistemlerde bu yıkıcı sonuçlar doğurabilir.</p>`;
    } else if (isInjection && demoResult) {
        demoResult.className = 'demo-result danger';
        demoResult.innerHTML = `<strong>⚠️ SQL Injection Tespit Edildi!</strong>
            <p style="margin-top:8px;font-size:0.9rem;">Bu sorgu sisteme yetkisiz erişim sağlayabilir!</p>`;
    } else if ((username || password) && demoResult) {
        demoResult.className = 'demo-result success';
        demoResult.innerHTML = `<strong>✅ Normal Giriş Denemesi</strong>`;
    } else if (demoResult) {
        demoResult.className = 'demo-result';
        demoResult.innerHTML = '<p>Yukarıya değer girin ve SQL sorgusunu görün.</p>';
    }
}

demoUsername?.addEventListener('input', updateSQLDemo);
demoPassword?.addEventListener('input', updateSQLDemo);
demoLoginBtn?.addEventListener('click', updateSQLDemo);

document.querySelectorAll('.hint-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        if (demoUsername) demoUsername.value = chip.dataset.username || '';
        if (demoPassword) demoPassword.value = chip.dataset.password || '';
        updateSQLDemo();
    });
});

// ===== Password Strength Demo =====
const passwordCheck = document.getElementById('password-check');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

function checkPasswordStrength(password) {
    const criteria = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    ['length', 'upper', 'lower', 'number', 'special'].forEach(key => {
        const el = document.getElementById(`criteria-${key}`);
        if (el) {
            el.classList.toggle('valid', criteria[key]);
            const icon = el.querySelector('.criteria-icon');
            if (icon) icon.textContent = criteria[key] ? '●' : '○';
        }
    });

    let strength = Object.values(criteria).filter(Boolean).length;
    if (password.length >= 12) strength += 0.5;
    if (password.length >= 16) strength += 0.5;
    return strength;
}

function updatePasswordMeter() {
    const password = passwordCheck?.value || '';
    const strength = checkPasswordStrength(password);

    if (!password) {
        if (strengthFill) { strengthFill.style.width = '0%'; strengthFill.style.background = 'var(--text-dim)'; }
        if (strengthText) { strengthText.textContent = 'Şifre girin'; strengthText.style.color = 'var(--text-muted)'; }
        return;
    }

    const levels = [
        { max: 2, pct: 20, color: '#ef4444', text: 'Çok Zayıf' },
        { max: 3, pct: 40, color: '#f59e0b', text: 'Zayıf' },
        { max: 4, pct: 60, color: '#eab308', text: 'Orta' },
        { max: 5, pct: 80, color: '#22c55e', text: 'Güçlü' },
        { max: 99, pct: 100, color: '#10b981', text: 'Çok Güçlü' }
    ];

    const level = levels.find(l => strength <= l.max);
    if (strengthFill) { strengthFill.style.width = `${level.pct}%`; strengthFill.style.background = level.color; }
    if (strengthText) { strengthText.textContent = level.text; strengthText.style.color = level.color; }
}

passwordCheck?.addEventListener('input', updatePasswordMeter);

// ===== Hash Demo =====
const hashInput = document.getElementById('hash-input');

function updateHashes() {
    const text = hashInput?.value || '';
    if (!text) {
        ['md5', 'sha1', 'sha256', 'sha512'].forEach(algo => {
            const el = document.getElementById(`hash-${algo}`);
            if (el) el.textContent = '-';
        });
        return;
    }

    if (typeof CryptoJS !== 'undefined') {
        document.getElementById('hash-md5').textContent = CryptoJS.MD5(text).toString();
        document.getElementById('hash-sha1').textContent = CryptoJS.SHA1(text).toString();
        document.getElementById('hash-sha256').textContent = CryptoJS.SHA256(text).toString();
        document.getElementById('hash-sha512').textContent = CryptoJS.SHA512(text).toString().substring(0, 64) + '...';
    }
}

hashInput?.addEventListener('input', updateHashes);

// ===== Brute Force Demo =====
const bruteInput = document.getElementById('brute-input');

function updateBruteForce() {
    const password = bruteInput?.value || '';
    const timeEl = document.querySelector('#brute-time .time-value');
    const charsetEl = document.getElementById('brute-charset');
    const comboEl = document.getElementById('brute-combo');

    if (!password) {
        if (timeEl) timeEl.textContent = '-';
        if (charsetEl) charsetEl.textContent = '-';
        if (comboEl) comboEl.textContent = '-';
        return;
    }

    let charsetSize = 0;
    let charsetDesc = [];

    if (/[a-z]/.test(password)) { charsetSize += 26; charsetDesc.push('a-z'); }
    if (/[A-Z]/.test(password)) { charsetSize += 26; charsetDesc.push('A-Z'); }
    if (/[0-9]/.test(password)) { charsetSize += 10; charsetDesc.push('0-9'); }
    if (/[^a-zA-Z0-9]/.test(password)) { charsetSize += 32; charsetDesc.push('Özel'); }

    const combinations = Math.pow(charsetSize, password.length);
    const attemptsPerSecond = 10000000000; // 10 billion
    const seconds = combinations / attemptsPerSecond;

    let timeText;
    if (seconds < 1) timeText = 'Anında';
    else if (seconds < 60) timeText = `${Math.round(seconds)} saniye`;
    else if (seconds < 3600) timeText = `${Math.round(seconds / 60)} dakika`;
    else if (seconds < 86400) timeText = `${Math.round(seconds / 3600)} saat`;
    else if (seconds < 31536000) timeText = `${Math.round(seconds / 86400)} gün`;
    else if (seconds < 31536000 * 100) timeText = `${Math.round(seconds / 31536000)} yıl`;
    else if (seconds < 31536000 * 1000000) timeText = `${Math.round(seconds / 31536000).toLocaleString()} yıl`;
    else timeText = '∞ (Evrenin yaşından uzun)';

    if (timeEl) timeEl.textContent = timeText;
    if (charsetEl) charsetEl.textContent = charsetDesc.join(' + ') + ` (${charsetSize})`;
    if (comboEl) comboEl.textContent = combinations.toExponential(2);
}

bruteInput?.addEventListener('input', updateBruteForce);

// ===== Password Generator =====
const passwordLength = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');
const generatedPassword = document.getElementById('generated-password');

passwordLength?.addEventListener('input', () => {
    if (lengthValue) lengthValue.textContent = passwordLength.value;
});

function generatePassword() {
    const length = parseInt(passwordLength?.value || 16);
    const useUpper = document.getElementById('opt-upper')?.checked;
    const useLower = document.getElementById('opt-lower')?.checked;
    const useNumbers = document.getElementById('opt-numbers')?.checked;
    const useSymbols = document.getElementById('opt-symbols')?.checked;

    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }

    if (generatedPassword) generatedPassword.value = password;
}

function copyGeneratedPassword() {
    const password = generatedPassword?.value;
    if (password && password !== 'Şifre üretmek için butona tıklayın') {
        navigator.clipboard.writeText(password);
        alert('Şifre kopyalandı!');
    }
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== Scroll Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.type-card, .prevention-card, .method-card, .practice-item, .resource-card, .flow-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Authentication Demo =====
let authState = {
    failedAttempts: 0,
    isLoggedIn: false,
    step: 1, // 1: credentials, 2: 2FA
    securityLevel: '-'
};

function unsafeLogin() {
    const email = document.getElementById('unsafe-email')?.value;
    const password = document.getElementById('unsafe-password')?.value;
    const resultEl = document.getElementById('unsafe-result');

    if (!email || !password) {
        if (resultEl) {
            resultEl.className = 'auth-demo-result warning';
            resultEl.innerHTML = '⚠️ E-posta ve şifre gerekli!';
        }
        return;
    }

    // Simulate unsafe login - always succeeds with any credentials
    authState.failedAttempts++;
    updateSessionInfo();

    if (resultEl) {
        // Simulate security vulnerability - show password in plain text
        resultEl.className = 'auth-demo-result danger';
        resultEl.innerHTML = `⚠️ Giriş simüle edildi (GÜVENSİZ!)<br>
            <small style="opacity:0.8">Şifre plain-text: "${password}"</small><br>
            <small>Bu yöntem tehlikelidir!</small>`;
    }

    document.getElementById('session-status').textContent = '⚠️ Güvensiz oturum';
    document.getElementById('session-status').style.color = '#f59e0b';
    document.getElementById('last-login').textContent = new Date().toLocaleTimeString('tr-TR');
    document.getElementById('security-level').textContent = '🔴 Düşük';
    document.getElementById('security-level').style.color = '#ef4444';
}

function safeLogin() {
    const email = document.getElementById('safe-email')?.value;
    const password = document.getElementById('safe-password')?.value;
    const resultEl = document.getElementById('safe-result');
    const otpGroup = document.getElementById('otp-group');
    const loginBtn = document.getElementById('safe-login-btn');

    if (authState.step === 1) {
        // Step 1: Validate credentials
        if (!email || !password) {
            if (resultEl) {
                resultEl.className = 'auth-demo-result warning';
                resultEl.innerHTML = '⚠️ E-posta ve şifre gerekli!';
            }
            return;
        }

        if (password.length < 8) {
            if (resultEl) {
                resultEl.className = 'auth-demo-result warning';
                resultEl.innerHTML = '⚠️ Şifre en az 8 karakter olmalı!';
            }
            authState.failedAttempts++;
            updateSessionInfo();
            return;
        }

        // Show 2FA step
        authState.step = 2;
        otpGroup.style.display = 'block';
        loginBtn.textContent = '🔐 2FA Doğrula';

        if (resultEl) {
            resultEl.className = 'auth-demo-result success';
            resultEl.innerHTML = '✅ Kimlik bilgileri doğrulandı. 2FA kodu girin.';
        }

        // Setup OTP input auto-focus
        setupOTPInputs();
    } else if (authState.step === 2) {
        // Step 2: Validate 2FA
        const otpInputs = document.querySelectorAll('.otp-input');
        let otpCode = '';
        otpInputs.forEach(input => otpCode += input.value);

        if (otpCode.length !== 6) {
            if (resultEl) {
                resultEl.className = 'auth-demo-result warning';
                resultEl.innerHTML = '⚠️ 6 haneli 2FA kodu girin!';
            }
            return;
        }

        // Success!
        authState.isLoggedIn = true;
        authState.securityLevel = 'Yüksek';

        if (resultEl) {
            resultEl.className = 'auth-demo-result success';
            resultEl.innerHTML = '✅ Giriş başarılı! 2FA doğrulaması tamamlandı.';
        }

        document.getElementById('session-status').textContent = '✅ Güvenli oturum aktif';
        document.getElementById('session-status').style.color = '#22c55e';
        document.getElementById('last-login').textContent = new Date().toLocaleTimeString('tr-TR');
        document.getElementById('security-level').textContent = '🟢 Yüksek';
        document.getElementById('security-level').style.color = '#22c55e';

        loginBtn.textContent = '✅ Giriş Yapıldı';
        loginBtn.disabled = true;
    }
}

function setupOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index) => {
        input.value = '';

        input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const digits = paste.replace(/\D/g, '').slice(0, 6);
            digits.split('').forEach((digit, i) => {
                if (otpInputs[i]) otpInputs[i].value = digit;
            });
            if (otpInputs[digits.length - 1]) otpInputs[digits.length - 1].focus();
        });
    });

    // Focus first input
    if (otpInputs[0]) otpInputs[0].focus();
}

function updateSessionInfo() {
    document.getElementById('failed-attempts').textContent = authState.failedAttempts;
}

function resetAuthDemo() {
    // Reset state
    authState = {
        failedAttempts: 0,
        isLoggedIn: false,
        step: 1,
        securityLevel: '-'
    };

    // Reset unsafe form
    document.getElementById('unsafe-email').value = '';
    document.getElementById('unsafe-password').value = '';
    document.getElementById('unsafe-result').className = 'auth-demo-result';
    document.getElementById('unsafe-result').innerHTML = '';

    // Reset safe form
    document.getElementById('safe-email').value = '';
    document.getElementById('safe-password').value = '';
    document.getElementById('safe-result').className = 'auth-demo-result';
    document.getElementById('safe-result').innerHTML = '';
    document.getElementById('otp-group').style.display = 'none';

    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => input.value = '');

    const loginBtn = document.getElementById('safe-login-btn');
    loginBtn.textContent = 'Giriş Yap';
    loginBtn.disabled = false;

    // Reset session info
    document.getElementById('session-status').textContent = 'Giriş yapılmadı';
    document.getElementById('session-status').style.color = '';
    document.getElementById('last-login').textContent = '-';
    document.getElementById('failed-attempts').textContent = '0';
    document.getElementById('security-level').textContent = '-';
    document.getElementById('security-level').style.color = '';
}

// ===== Console Easter Egg =====
console.log(`%c🛡️ Siber Güvenlik Eğitimi\n\nBu site eğitim amaçlıdır.\n⚠️ Bu teknikleri sadece izinli sistemlerde test edin!`, 'color: #6366f1; font-size: 14px; font-weight: bold;');
