import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Wifi, Check, ExternalLink } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [qrUrl, setQrUrl] = useState('');
  const [networkHost, setNetworkHost] = useState('');
  const [copied, setCopied] = useState(false);

  const cloudflareUrl = 'https://ceremony-pregnant-abc-deposit.trycloudflare.com';
  const fullUrl = cloudflareUrl;

  useEffect(() => {
    setNetworkHost('ceremony-pregnant-abc-deposit.trycloudflare.com');
  }, []);

  useEffect(() => {
    if (fullUrl) {
      QRCode.toDataURL(fullUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0B0F19',
          light: '#FFFFFF'
        }
      }).then(setQrUrl).catch(console.error);
    }
  }, [fullUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-dark-900 border border-dark-800 rounded-3xl p-5 space-y-4 shadow-2xl text-center">
        {/* Üst Başlık */}
        <div className="flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Telefondan Aç</h3>
              <p className="text-[11px] text-emerald-400 font-medium">Güvenli Canlı Bağlantı (SSL)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Kod Görseli */}
        <div className="bg-white p-3 rounded-2xl inline-block shadow-lg border-2 border-indigo-500/30">
          {qrUrl ? (
            <img src={qrUrl} alt="Mobil Bağlantı QR Kodu" className="w-48 h-48 mx-auto rounded-lg" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400 font-mono">
              QR Yükleniyor...
            </div>
          )}
        </div>

        {/* Link ve Kopyala */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] text-gray-400 font-semibold uppercase">Telefon Bağlantı Adresi</label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={networkHost}
              onChange={e => setNetworkHost(e.target.value)}
              placeholder="Bilgisayarınızın IP'si (örn: 192.168.1.35)"
              className="flex-1 bg-dark-950 border border-dark-800 rounded-xl px-2.5 py-1.5 text-xs text-indigo-300 font-mono outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-200 text-xs font-medium flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Kopyala'}
            </button>
          </div>
        </div>

        {/* Kurulum İpucu */}
        <div className="p-3 rounded-xl bg-dark-950/80 border border-dark-800 text-left text-xs text-gray-300 space-y-1">
          <div className="font-semibold text-white flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            Nasıl Kullanılır?
          </div>
          <ol className="list-decimal list-inside text-[11px] text-gray-400 space-y-0.5">
            <li>Telefon kameranızla yukarıdaki QR kodu tarayın.</li>
            <li>Tarayıcıda açıldıktan sonra <b>"Ana Ekrana Ekle"</b> seçeneğine basın.</li>
            <li>Artık telefonunuzda mobil uygulama olarak çalışacaktır!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
