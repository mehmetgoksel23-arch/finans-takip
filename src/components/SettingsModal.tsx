import React, { useState } from 'react';
import { X, KeyRound, Download, Upload, RotateCcw, ShieldCheck, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  currentPin: string;
  onClose: () => void;
  onUpdatePin: (newPin: string) => void;
  onExportBackup: () => void;
  onImportBackup: (json: string) => void;
  onResetDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentPin,
  onClose,
  onUpdatePin,
  onExportBackup,
  onImportBackup,
  onResetDefaults
}) => {
  if (!isOpen) return null;

  const [newPin, setNewPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      onUpdatePin(newPin);
      setPinSaved(true);
      setTimeout(() => setPinSaved(false), 2000);
      setNewPin('');
    } else {
      alert('PIN 4 haneli olmalıdır!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const content = event.target?.result as string;
        if (content) {
          onImportBackup(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-dark-900 border border-dark-800 rounded-3xl p-5 space-y-4 shadow-2xl">
        {/* Başlık */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Ayarlar & Güvenlik</h2>
          <button onClick={onClose} className="p-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Değiştirme */}
        <div className="p-3.5 rounded-2xl bg-dark-950 border border-dark-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span>PIN Kodu Değiştir</span>
          </div>
          <form onSubmit={handlePinChange} className="flex gap-2">
            <input
              type="password"
              maxLength={4}
              placeholder="Yeni 4 Haneli PIN"
              value={newPin}
              onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
              className="flex-1 bg-dark-900 border border-dark-800 rounded-xl px-3 py-1.5 text-xs text-white tracking-widest font-mono outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1"
            >
              {pinSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : 'Kaydet'}
            </button>
          </form>
          <div className="text-[10px] text-gray-500">Mevcut PIN: {currentPin}</div>
        </div>

        {/* Yedekleme (Dışa ve İçe Aktarma) */}
        <div className="p-3.5 rounded-2xl bg-dark-950 border border-dark-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Veri Yedekleme (JSON)</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Verilerinizi yedek dosyası olarak telefonunuza veya bilgisayarınıza indirebilir, istediğinizde geri yükleyebilirsiniz.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onExportBackup}
              className="py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Yedek İndir
            </button>
            <label className="py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-200 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              Yedek Yükle
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Fabrika Ayarlarına Sıfırlama */}
        <div className="pt-2">
          <button
            onClick={() => {
              onResetDefaults();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Excel Varsayılan Verilerine Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};
