// dashboard.js

// Dashboard'u yükle
function loadDashboard() {
    const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    displayStats(testResults);
    displayResults(testResults);
}

// İstatistikleri göster
function displayStats(results) {
    const statsContainer = document.getElementById('stats-container');
    
    const totalTests = results.length;
    const successfulTests = results.filter(r => 
        r.tests && parseInt(r.tests.failed) === 0
    ).length;
    
    const totalErrors = results.reduce((sum, r) => {
        return sum + (r.errors ? r.errors.length : 0);
    }, 0);
    
    const lastTest = results[0] ? new Date(results[0].id).toLocaleDateString('tr-TR') : 'Henüz yok';

    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>Toplam Test</h3>
            <div class="stat-number">${totalTests}</div>
        </div>
        <div class="stat-card">
            <h3>Başarılı Testler</h3>
            <div class="stat-number">${successfulTests}</div>
        </div>
        <div class="stat-card">
            <h3>Toplam Hata</h3>
            <div class="stat-number">${totalErrors}</div>
        </div>
        <div class="stat-card">
            <h3>Son Test</h3>
            <div class="stat-number">${lastTest}</div>
        </div>
    `;
}

// Test sonuçlarını göster
function displayResults(results) {
    const resultsContainer = document.getElementById('results-container');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Henüz test sonucu bulunmuyor.</p>';
        return;
    }
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="result-item ${result.errors && result.errors.length > 0 ? 'failed' : ''}">
            <div class="result-header">
                <strong>Test Tarihi:</strong> ${result.timestamp}
                <span style="float: right;">
                    ${result.errors && result.errors.length > 0 ? '❌ Hatalı' : '✅ Başarılı'}
                </span>
            </div>
            
            <div class="test-status" style="margin: 10px 0;">
                <strong>Test Bilgileri:</strong><br>
                Testi Yapan: ${result.testerInfo?.name || 'Bilinmiyor'}<br>
                Cihaz: ${result.testerInfo?.device || 'Bilinmiyor'}<br>
                İşletim Sistemi: ${result.testerInfo?.os || 'Bilinmiyor'}<br>
                Şablon: ${result.testerInfo?.template || 'Bilinmiyor'}
            </div>
            
            <div class="test-status" style="margin: 10px 0;">
                <strong>Sonuçlar:</strong><br>
                Toplam Test: ${result.tests?.total || 0}<br>
                Başarılı: ${result.tests?.passed || 0}<br>
                Başarısız: ${result.tests?.failed || 0}<br>
                Başarı Oranı: ${result.tests?.successRate || '0%'}
            </div>
            
            ${result.screenshot ? `
                <div>
                    <strong>Ekran Görüntüsü:</strong><br>
                    <img src="${result.screenshot}" alt="Test sonucu" class="screenshot" 
                         onclick="viewScreenshot('${result.screenshot}')">
                </div>
            ` : ''}
            
            ${result.errors && result.errors.length > 0 ? `
                <div class="error-details">
                    <strong>Hatalar:</strong><br>
                    ${result.errors.map(error => `• ${error}`).join('<br>')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Ekran görüntüsünü büyük göster
function viewScreenshot(src) {
    window.open(src, '_blank');
}

// Tüm verileri temizle
function clearAllData() {
    if (confirm('Tüm test verileri silinecek. Emin misiniz?')) {
        localStorage.removeItem('testResults');
        loadDashboard();
    }
}

// Sayfa yüklendiğinde dashboard'u çalıştır
document.addEventListener('DOMContentLoaded', loadDashboard);
