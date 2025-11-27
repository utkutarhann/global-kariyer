import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cvText, setCvText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCV = async () => {
    if (!cvText.trim()) {
      alert('Lütfen CV bilgilerinizi girin');
      return;
    }

    setLoading(true);
    
    try {
      // Netlify Functions endpoint'ine çağrı
      const response = await fetch('/.netlify/functions/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvText })
      });

      if (!response.ok) {
        throw new Error('Analiz başarısız oldu');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Analiz hatası:', error);
      alert('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GlobalKariyer AI
                </h1>
                <p className="text-xs text-gray-500">Yapay Zeka Destekli Kariyer Danışmanlığı</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-1">
              {['home', 'analyze', 'jobs', 'about'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'home' && 'Ana Sayfa'}
                  {tab === 'analyze' && 'CV Analizi'}
                  {tab === 'jobs' && 'İş İlanları'}
                  {tab === 'about' && 'Hakkımızda'}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'home' && (
          <div className="space-y-16">
            <div className="text-center space-y-6">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  🚀 AI Powered Career Guidance
                </span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Kariyerinizi Bir Sonraki
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Seviyeye Taşıyın
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Yapay zeka destekli CV analizi, kişiselleştirilmiş kariyer önerileri ve binlerce iş fırsatı
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('analyze')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Hemen Başla
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-gray-200"
                >
                  İş İlanları
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'CV Analizi', desc: 'Gerçek AI ile CV\'nizi analiz edin' },
                { title: 'Kariyer Önerileri', desc: 'Becerilerinize uygun pozisyonlar' },
                { title: 'İş Fırsatları', desc: 'Binlerce iş ilanına ulaşın' }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">CV Analizi</h2>
              <p className="text-gray-600">CV bilgilerinizi yapıştırın, gerçek Claude AI ile analiz edelim</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="CV içeriğinizi buraya yapıştırın... (İsim, deneyim, beceriler, eğitim vb.)"
                className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              />
              <button
                onClick={analyzeCV}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Gerçek AI Analiz Ediyor...' : 'Claude AI ile Analiz Et'}
              </button>
            </div>

            {analysis && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-200">
                  <div className="text-center space-y-2">
                    <div className="text-6xl font-bold text-green-600">{analysis.score}/100</div>
                    <div className="text-green-700 font-semibold">AI CV Skor</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Güçlü Yönler</h3>
                  <ul className="space-y-3">
                    {analysis.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Geliştirilebilir Alanlar</h3>
                  <ul className="space-y-3">
                    {analysis.improvements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border-2 border-purple-200">
                  <h3 className="text-2xl font-bold text-purple-900 mb-4">Önerilen Pozisyonlar</h3>
                  <div className="flex flex-wrap gap-3">
                    {analysis.recommendations.map((job, idx) => (
                      <span key={idx} className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold shadow">
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">İş İlanları</h2>
              <p className="text-gray-600">Size özel filtrelenmiş kariyer fırsatları</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Senior Frontend Developer', company: 'TechCorp A.Ş.', location: 'İstanbul', salary: '25K - 35K TL' },
                { title: 'Full Stack Developer', company: 'StartupHub', location: 'Remote', salary: '30K - 40K TL' },
                { title: 'UI/UX Designer', company: 'DesignCo', location: 'Ankara', salary: '20K - 28K TL' }
              ].map((job, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Yeni
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">📍 {job.location}</p>
                    <p className="text-sm text-gray-600">💰 {job.salary}</p>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Başvur
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Hakkımızda</h2>
              <p className="text-xl text-gray-600">
                GlobalKariyer AI, yapay zeka teknolojisi ile kariyer gelişiminize rehberlik eder
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                GlobalKariyer AI, modern yapay zeka teknolojilerini kullanarak profesyonellere 
                kariyer yolculuklarında kapsamlı destek sağlayan bir platformdur.
              </p>

              <div className="grid md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">Vizyonumuz</h3>
                  <p className="text-gray-600">
                    Türkiye'nin en güvenilir AI destekli kariyer platformu olmak
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">Misyonumuz</h3>
                  <p className="text-gray-600">
                    Her profesyonele doğru kararlar alması için gerekli araçları sunmak
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-400 text-sm">
            © 2024 GlobalKariyer AI. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;