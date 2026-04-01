/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import * as Icons from 'lucide-react';
import './carousel.css';

type IconName = keyof typeof Icons;

interface DataPoint {
  id: string;
  text: string;
  icon: IconName;
  position: 'pos-top-right' | 'pos-top-left' | 'pos-bottom-right' | 'pos-bottom-left' | 'pos-bottom-center';
}

interface CanvasState {
  title1: string;
  title2: string;
  subtitle: string;
  centerImage: string;
  dataPoints: DataPoint[];
  sourceText: string;
  logoText1: string;
  logoText2: string;
}

const defaultState: CanvasState = {
  title1: "انطلاقة",
  title2: "بأقصى سرعة",
  subtitle: "توسع متسارع مع وصول الأرباح",
  centerImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
  dataPoints: [
    { id: '1', text: "تحقيق أول أرباح معدلة\nبقيمة ٤ مليون", icon: "DollarSign", position: "pos-top-right" },
    { id: '2', text: "نستهدف ٣٠٠٠ متجر\nبحلول عام ٢٠٢٧", icon: "Store", position: "pos-top-left" },
    { id: '3', text: "التحول للمخزون رفع\nالإيرادات إلى ١٢ ألف", icon: "TrendingUp", position: "pos-bottom-right" },
    { id: '4', text: "إضافة ٢١١ متجر جديد\nليصل الإجمالي ٢٢٠٧", icon: "PlusCircle", position: "pos-bottom-left" },
    { id: '5', text: "المدن الكبرى تستمر\nفي النمو بنسبة ٥٥٪", icon: "MapPin", position: "pos-bottom-center" },
  ],
  sourceText: "المصدر: أبحاث السوق",
  logoText1: "إنك",
  logoText2: "٤٢"
};

const availableIcons: IconName[] = [
  'DollarSign', 'Store', 'TrendingUp', 'PlusCircle', 'MapPin', 
  'Users', 'ShoppingBag', 'Truck', 'Star', 'Heart', 'Zap', 'Award', 'Activity', 'ChartBar'
];

const positions = [
  { value: 'pos-top-right', label: 'أعلى اليمين' },
  { value: 'pos-top-left', label: 'أعلى اليسار' },
  { value: 'pos-bottom-right', label: 'أسفل اليمين' },
  { value: 'pos-bottom-left', label: 'أسفل اليسار' },
  { value: 'pos-bottom-center', label: 'أسفل المنتصف' },
];

export default function App() {
  const [state, setState] = useState<CanvasState>(defaultState);
  const [scale, setScale] = useState(0.5);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const containerWidth = containerRef.current.clientWidth;
        // Calculate scale to fit within container with some padding
        const scaleH = (containerHeight - 80) / 1350;
        const scaleW = (containerWidth - 80) / 1080;
        setScale(Math.min(scaleH, scaleW, 1));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    
    try {
      const dataUrl = await toPng(canvasRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = 'infographic.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('حدث خطأ أثناء تصدير الصورة. تأكد من أن روابط الصور تدعم CORS.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setState(prev => ({ ...prev, centerImage: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateDataPoint = (id: string, field: keyof DataPoint, value: string) => {
    setState(prev => ({
      ...prev,
      dataPoints: prev.dataPoints.map(dp => 
        dp.id === id ? { ...dp, [field]: value } : dp
      )
    }));
  };

  const IconComponent = ({ name, className }: { name: IconName, className?: string }) => {
    const Icon = Icons[name] as React.ElementType;
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <div className="flex h-screen bg-gray-50 text-right font-sans" dir="rtl">
      {/* Sidebar Editor */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg z-10">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Icons.Layout className="w-6 h-6 text-yellow-500" />
            صانع الإنفوجرافيك
          </h1>
          <button 
            onClick={handleExport}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Icons.Download className="w-4 h-4" />
            تصدير
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Header Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
              <Icons.Type className="w-5 h-5 text-gray-500" />
              العنوان الرئيسي
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">النص الأول (أسود)</label>
                <input 
                  type="text" 
                  value={state.title1}
                  onChange={e => setState({...state, title1: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">النص الثاني (أصفر)</label>
                <input 
                  type="text" 
                  value={state.title2}
                  onChange={e => setState({...state, title2: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">العنوان الفرعي</label>
                <input 
                  type="text" 
                  value={state.subtitle}
                  onChange={e => setState({...state, subtitle: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Image Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
              <Icons.Image className="w-5 h-5 text-gray-500" />
              صورة المنتصف
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">رفع صورة من الجهاز</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer border border-gray-300 rounded-md p-1"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="flex-1 h-px bg-gray-200"></span>
                أو
                <span className="flex-1 h-px bg-gray-200"></span>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">رابط الصورة (URL)</label>
                <input 
                  type="text" 
                  value={state.centerImage}
                  onChange={e => setState({...state, centerImage: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </section>

          {/* Data Points Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
              <Icons.List className="w-5 h-5 text-gray-500" />
              النقاط والبيانات
            </h2>
            <div className="space-y-6">
              {state.dataPoints.map((dp, index) => (
                <div key={dp.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 relative">
                  <div className="absolute -top-3 -right-3 bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {index + 1}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">النص</label>
                    <textarea 
                      value={dp.text}
                      onChange={e => updateDataPoint(dp.id, 'text', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none resize-none h-20"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">الأيقونة</label>
                      <select 
                        value={dp.icon}
                        onChange={e => updateDataPoint(dp.id, 'icon', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                      >
                        {availableIcons.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">الموضع</label>
                      <select 
                        value={dp.position}
                        onChange={e => updateDataPoint(dp.id, 'position', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                      >
                        {positions.map(pos => (
                          <option key={pos.value} value={pos.value}>{pos.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Section */}
          <section className="space-y-4 pb-8">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
              <Icons.PanelBottom className="w-5 h-5 text-gray-500" />
              التذييل
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">نص المصدر</label>
                <input 
                  type="text" 
                  value={state.sourceText}
                  onChange={e => setState({...state, sourceText: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">الشعار (أسود)</label>
                  <input 
                    type="text" 
                    value={state.logoText1}
                    onChange={e => setState({...state, logoText1: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">الشعار (ملون)</label>
                  <input 
                    type="text" 
                    value={state.logoText2}
                    onChange={e => setState({...state, logoText2: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Canvas Preview Area */}
      <div 
        ref={containerRef}
        className="flex-1 bg-gray-200 overflow-hidden flex items-center justify-center relative dot-pattern"
      >
        <div 
          style={{ 
            width: '1080px', 
            height: '1350px', 
            transform: `scale(${scale})`, 
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
          className="shadow-2xl bg-white"
        >
          {/* The actual canvas to be exported */}
          <div ref={canvasRef} className="carousel-wrapper">
            <div className="carousel-bg-blob"></div>
            
            <div className="carousel-header">
              <div className="carousel-title-container">
                <span className="carousel-title-primary">{state.title1}</span>
                <span className="carousel-title-highlight">{state.title2}</span>
              </div>
              <div className="carousel-subtitle">{state.subtitle}</div>
            </div>

            <div className="carousel-center-section">
              <div className="carousel-phone-mockup">
                <div className="carousel-phone-notch"></div>
                <img src={state.centerImage} alt="Center" className="carousel-phone-image" crossOrigin="anonymous" />
              </div>
              
              {/* Decorative Elements */}
              <div className="carousel-deco-bag-1">
                <Icons.ShoppingBag className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="carousel-deco-bag-2">
                <Icons.Star className="w-12 h-12 text-white opacity-80" />
              </div>
              <div className="carousel-deco-tag">%</div>
            </div>

            {/* Data Points */}
            {state.dataPoints.map(dp => (
              <div key={dp.id} className={`carousel-data-item ${dp.position}`}>
                <div className="carousel-icon-box">
                  <IconComponent name={dp.icon} className="carousel-icon-svg" />
                </div>
                <div className="carousel-data-desc">
                  {dp.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i !== dp.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}

            <div className="carousel-footer">
              <div className="carousel-source">{state.sourceText}</div>
              <div className="carousel-brand">
                {state.logoText1}<span className="carousel-brand-highlight">{state.logoText2}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
