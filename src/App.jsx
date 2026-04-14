import React, { useState } from 'react';
import {
  Droplet,
  Zap,
  Calculator,
  CreditCard,
  LayoutDashboard,
  Users,
  HeadphonesIcon,
  ArrowRight,
  CheckCircle2,
  Building2,
  Mail,
  Search,
  MoreVertical,
  Lock,
  Ticket,
  Shield,
  RefreshCw,
  LogOut,
  PlusCircle,
  Settings,
  History,
  AlertCircle,
  CalendarDays
} from 'lucide-react';

const PRICES = {
  water: 12,
  electricity: 15
};

const REMAINING_DAYS = 215; // 模擬距離合約到期剩餘天數
const PRORATED_RATIO = REMAINING_DAYS / 365;

export default function App() {
  // 系統狀態管理
  const [currentView, setCurrentView] = useState('calculator');
  // views: calculator, register, checkout, success, client_dashboard, client_tickets, admin_dashboard, admin_tickets, paypal_simulation, admin_customers, client_manage_sub, client_expand_meters

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paymentType, setPaymentType] = useState(null); // 'onetime' or 'credit_card'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCardFormOpen, setIsCardFormOpen] = useState(false); // 控制是否顯示信用卡表單
  const [showPayPalCardForm, setShowPayPalCardForm] = useState(false); // 控制PayPal頁面內的信用卡表單
  const [pendingOrder, setPendingOrder] = useState(null); // { type: 'initial' | 'expand', water, electricity, cost }

  const [meters, setMeters] = useState({ water: 0, electricity: 0 });
  const [customerInfo, setCustomerInfo] = useState({ company: '', email: '', password: '' });

  const totalCost = (meters.water * PRICES.water) + (meters.electricity * PRICES.electricity);

  const handleProceedToCheckout = (e) => {
    e.preventDefault();
    setPendingOrder({ type: 'initial', water: meters.water, electricity: meters.electricity, cost: totalCost });
    setIsCardFormOpen(false); // 重置信用卡表單狀態
    if (!isLoggedIn) {
      setCurrentView('register');
    } else {
      setCurrentView('checkout');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsCardFormOpen(false); // 重置信用卡表單狀態
    setCurrentView('checkout');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    if (!customerInfo.company) {
      setCustomerInfo({ ...customerInfo, company: '測試公司' });
    }
    if (meters.water === 0 && meters.electricity === 0) {
      setMeters({ water: 150, electricity: 200 });
    }
    setCurrentView('client_dashboard');
  };

  const simulatePayment = (type) => {
    setPaymentType(type);
    if (type === 'credit_card') {
      // 站內信用卡付款，顯示等待效果
      setTimeout(() => {
        if (pendingOrder?.type === 'expand') {
          setMeters(prev => ({
            water: prev.water + pendingOrder.water,
            electricity: prev.electricity + pendingOrder.electricity
          }));
          setPendingOrder(null);
        } else if (pendingOrder?.type === 'renew') {
          setMeters({ water: pendingOrder.water, electricity: pendingOrder.electricity });
          setPendingOrder(null);
        }
        setCurrentView('success');
        setIsCardFormOpen(false); // 付款成功後重置
      }, 1500);
    } else {
      // 模擬跳轉至 PayPal 外部網站
      setShowPayPalCardForm(false);
      setCurrentView('paypal_simulation');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setPaymentType(null);
    setMeters({ water: 0, electricity: 0 });
    setIsCardFormOpen(false);
    setCurrentView('calculator');
  };

  // --- 導覽列 ---
  const Navbar = () => (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md relative z-10">
      <div className="flex items-center space-x-2 font-bold text-xl cursor-pointer" onClick={() => setCurrentView('calculator')}>
        <LayoutDashboard className="text-blue-400" />
        <span>CloudMeter US</span>
      </div>
      <div className="space-x-4 text-sm font-medium flex items-center">
        {isLoggedIn ? (
          <>
            <button onClick={() => setCurrentView('client_dashboard')} className="hover:text-blue-400 transition-colors">我的帳戶</button>
            <button onClick={logout} className="flex items-center text-slate-300 hover:text-white transition-colors"><LogOut size={16} className="mr-1" /> 登出</button>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentView('calculator')} className="hover:text-blue-400 transition-colors">方案計算</button>
            <button onClick={() => setCurrentView('login')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition-colors font-medium">登入</button>
          </div>
        )}
        <div className="h-6 w-px bg-slate-700 mx-2"></div>
        <button onClick={() => setCurrentView('admin_dashboard')} className="bg-slate-800 px-4 py-2 rounded border border-slate-700 hover:bg-slate-700 transition-colors text-blue-300">
          切換至員工後台
        </button>
      </div>
    </nav>
  );

  // --- 客戶端視圖 ---

  const CalculatorView = () => (
    <div className="max-w-4xl mx-auto mt-12 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">客製化您的年度雲端抄表方案</h1>
        <p className="text-slate-600">依據您的實際表位數量計費，無隱藏費用。支援全美各州企業客戶。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Calculator className="mr-2 text-slate-500" /> 輸入表位數量
          </h2>

          <div className="mb-6">
            <label className="flex items-center text-slate-700 font-medium mb-2">
              <Droplet className="mr-2 text-blue-500" size={20} /> 水表數量 (Water Meters)
            </label>
            <input
              type="number" min="0"
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={meters.water}
              onChange={(e) => setMeters({ ...meters, water: parseInt(e.target.value) || 0 })}
            />
            <div className="text-sm text-slate-500 mt-1">每座水表 ${PRICES.water} / 年</div>
          </div>

          <div className="mb-6">
            <label className="flex items-center text-slate-700 font-medium mb-2">
              <Zap className="mr-2 text-yellow-500" size={20} /> 電表數量 (Electric Meters)
            </label>
            <input
              type="number" min="0"
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={meters.electricity}
              onChange={(e) => setMeters({ ...meters, electricity: parseInt(e.target.value) || 0 })}
            />
            <div className="text-sm text-slate-500 mt-1">每座電表 ${PRICES.electricity} / 年</div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-6 border-b pb-4">年度費用預估</h2>
            <div className="space-y-4 text-slate-700">
              <div className="flex justify-between"><span>水表 ({meters.water} 座)</span><span>${meters.water * PRICES.water}</span></div>
              <div className="flex justify-between"><span>電表 ({meters.electricity} 座)</span><span>${meters.electricity * PRICES.electricity}</span></div>
              <div className="flex justify-between text-sm text-slate-500 pt-2"><span>系統整合與客服支援</span><span>免費包含</span></div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-end mb-6">
              <span className="text-lg font-medium text-slate-700">總計 (USD/年)</span>
              <span className="text-4xl font-bold text-blue-600">${totalCost}</span>
            </div>
            <button
              onClick={handleProceedToCheckout}
              disabled={totalCost === 0}
              className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${totalCost > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              建立帳戶並結帳 <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RegisterView = () => (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">建立企業管理員帳號</h2>
      <p className="text-slate-500 mb-6 text-sm">付款前請先建立您的專屬管理後台帳號。</p>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-slate-700 font-medium mb-1 text-sm flex items-center"><Building2 className="mr-1 text-slate-400" size={16} /> 公司名稱</label>
          <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Company LLC" value={customerInfo.company} onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })} />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1 text-sm flex items-center"><Mail className="mr-1 text-slate-400" size={16} /> 管理員信箱</label>
          <input required type="email" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="admin@company.com" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1 text-sm flex items-center"><Lock className="mr-1 text-slate-400" size={16} /> 設定密碼</label>
          <input required type="password" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold transition-colors mt-4">
          註冊並前往付款
        </button>
      </form>
      <div className="text-center mt-4 mb-2">
        <span className="text-slate-500 text-sm">已有帳號？ </span>
        <button onClick={() => setCurrentView('login')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">立即登入</button>
      </div>
      <button onClick={() => setCurrentView('calculator')} className="w-full text-center text-slate-500 text-sm mt-2 hover:text-slate-800">返回修改方案</button>
    </div>
  );

  const LoginView = () => (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">客戶登入</h2>
      <p className="text-slate-500 mb-6 text-sm">請輸入您的管理員帳號與密碼以登入系統。</p>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-slate-700 font-medium mb-1 text-sm flex items-center"><Mail className="mr-1 text-slate-400" size={16} /> 管理員信箱</label>
          <input required type="email" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="admin@company.com" value={customerInfo.email || ''} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1 text-sm flex items-center"><Lock className="mr-1 text-slate-400" size={16} /> 密碼</label>
          <input required type="password" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors mt-4 shadow-sm">
          登入
        </button>
      </form>
      <div className="text-center mt-4">
        <span className="text-slate-500 text-sm">還沒有帳號？ </span>
        <button onClick={() => setCurrentView('register')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">免費註冊</button>
      </div>
    </div>
  );

  const CheckoutView = () => (
    <div className="max-w-4xl mx-auto mt-12 p-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">

        <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-200">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">帳戶資訊</h3>
            <div className="font-medium text-slate-800">{customerInfo.company || '測試公司'}</div>
            <div className="text-sm text-slate-500">{customerInfo.email || 'test@example.com'}</div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{pendingOrder?.type === 'expand' ? '擴充明細' : pendingOrder?.type === 'renew' ? '手動續約' : '訂單摘要'}</h3>
            <div className="flex justify-between text-sm mb-2 text-slate-700"><span>{pendingOrder?.type === 'expand' ? '新增水表' : pendingOrder?.type === 'renew' ? '新水表設定' : '水表'}</span><span>{pendingOrder?.water || 0} 座</span></div>
            <div className="flex justify-between text-sm mb-4 text-slate-700"><span>{pendingOrder?.type === 'expand' ? '新增電表' : pendingOrder?.type === 'renew' ? '新電表設定' : '電表'}</span><span>{pendingOrder?.electricity || 0} 座</span></div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-800">總計</span>
              <span className="text-2xl font-bold text-blue-600">${pendingOrder?.cost?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 p-8">
          {!isCardFormOpen ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">選擇您的付款方式</h2>

              <div className="space-y-4">
                {/* 信用卡付款 */}
                <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition-colors">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">信用卡 / 簽帳金融卡</h3>
                  <p className="text-sm text-slate-500 mb-4">支援 Visa, Mastercard, JCB 等主要發卡機構，透過安全加密通道處理。</p>
                  <button onClick={() => setIsCardFormOpen(true)} className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-full font-bold flex items-center justify-center transition-colors">
                    <CreditCard className="mr-2" size={20} /> 輸入信用卡資訊
                  </button>
                </div>

                <div className="relative py-2 flex items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">或使用其他方式</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>



                {/* One-time Option */}
                <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition-colors">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">PayPal 單次付費</h3>
                  <button onClick={() => simulatePayment('onetime')} className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 mt-3 rounded-full font-bold flex items-center justify-center transition-colors">
                    <CreditCard className="mr-2" size={20} /> Checkout with PayPal
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center mb-6">
                <button onClick={() => setIsCardFormOpen(false)} className="text-slate-400 hover:text-slate-800 mr-3 p-1 rounded-full hover:bg-slate-100 transition-colors">
                  <ArrowRight className="transform rotate-180" size={24} />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">輸入信用卡資訊</h2>
              </div>

              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); simulatePayment('credit_card'); }}>
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1">持卡人姓名</label>
                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1">信用卡卡號</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="text" maxLength="19" className="w-full border border-slate-300 rounded-lg pl-10 p-3 outline-none focus:border-blue-500 font-mono" placeholder="0000 0000 0000 0000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 text-sm font-medium mb-1">有效期限</label>
                    <input required type="text" maxLength="5" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 font-mono" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-medium mb-1">安全碼 (CVC)</label>
                    <input required type="text" maxLength="4" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 font-mono" placeholder="123" />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg flex items-start mt-6 border border-slate-200">
                  <Lock className="text-green-600 mr-3 mt-0.5 flex-shrink-0" size={18} />
                  <p className="text-xs text-slate-500 leading-relaxed">您的交易受到 256 位元 SSL 加密保護。我們不會在伺服器上儲存您的完整信用卡資訊。</p>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-colors mt-2 shadow-lg flex justify-center items-center">
                  確認付款 ${pendingOrder?.cost?.toFixed(2) || '0.00'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="max-w-md mx-auto mt-24 text-center animate-in fade-in zoom-in duration-500">
      <CheckCircle2 className="mx-auto text-green-500 mb-6" size={80} />
      <h2 className="text-3xl font-bold text-slate-800 mb-4">付款成功！</h2>
      <p className="text-slate-600 mb-8">
        感謝您的購買。{pendingOrder?.type === 'expand' ? '您的表位擴充已生效！' : pendingOrder?.type === 'renew' ? '您的手動續約已生效！' : '您的企業帳戶已正式開通！'}<br />
        您已完成本年度繳費，請留意明年的續約通知信件。
      </p>
      <button onClick={() => setCurrentView('client_dashboard')} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold shadow-lg transition-transform hover:-translate-y-1">
        進入我的管理後台
      </button>
    </div>
  );

  const PayPalSimulationView = () => (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center pt-12 pb-12 font-sans animate-in fade-in duration-300">
      {/* PayPal Header */}
      <div className="w-full max-w-5xl flex justify-center mb-10">
        <div className="text-[#003087] font-bold text-4xl italic tracking-tighter">PayPal</div>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 px-6">
        {/* 左側：購物車摘要 */}
        <div className="md:w-1/3">
          <div className="text-2xl text-slate-800 mb-6">訂單摘要</div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-4 mb-4">CloudMeter US</div>
            <div className="flex justify-between text-slate-600 mb-3 text-sm">
              <span>{pendingOrder?.type === 'expand' ? '擴充明細' : pendingOrder?.type === 'renew' ? '手動續約' : '年度方案'} ({pendingOrder?.water || 0} 水表, {pendingOrder?.electricity || 0} 電表)</span>
              <span>${pendingOrder?.cost?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 text-2xl border-t border-slate-100 pt-4 mt-2">
              <span>總計</span>
              <span>${pendingOrder?.cost?.toFixed(2) || '0.00'} <span className="text-sm font-normal text-slate-500">USD</span></span>
            </div>

          </div>
        </div>

        {/* 右側：付款操作 */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-xl shadow-sm p-10 border border-slate-200 flex flex-col items-center">
            {!showPayPalCardForm ? (
              <>
                <h2 className="text-2xl font-semibold text-slate-800 mb-8">使用 PayPal 付款</h2>
                <div className="w-full max-w-sm mb-4">
                  <input type="email" className="w-full border border-slate-300 rounded-lg p-3 focus:border-[#0070BA] outline-none bg-slate-50 text-slate-500" value={customerInfo.email || '未提供信箱'} readOnly />
                </div>
                <button
                  onClick={() => {
                    if (pendingOrder?.type === 'expand') {
                      setMeters(prev => ({
                        water: prev.water + pendingOrder.water,
                        electricity: prev.electricity + pendingOrder.electricity
                      }));
                      setPendingOrder(null);
                    } else if (pendingOrder?.type === 'renew') {
                      setMeters({ water: pendingOrder.water, electricity: pendingOrder.electricity });
                      setPendingOrder(null);
                    }
                    setCurrentView('success');
                    setIsCardFormOpen(false);
                  }}
                  className="w-full max-w-sm bg-[#0070BA] hover:bg-[#005EA6] text-white font-bold py-3.5 rounded-full transition-colors mb-6 shadow-md"
                >
                  立即付款
                </button>

                <div className="flex items-center w-full max-w-sm mb-6">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="mx-4 text-slate-500 text-sm">或</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button onClick={() => setShowPayPalCardForm(true)} className="w-full max-w-sm bg-[#F5F7FA] border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold py-3.5 rounded-full transition-colors mb-8">
                  使用扣帳卡或信用卡付款
                </button>

                <button onClick={() => setCurrentView('checkout')} className="text-sm text-[#0070BA] hover:underline font-medium">
                  取消並回到 CloudMeter US
                </button>
              </>
            ) : (
              <div className="w-full max-w-md animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center mb-6">
                  <button onClick={() => setShowPayPalCardForm(false)} className="text-[#0070BA] hover:underline font-medium mr-4">
                    返回
                  </button>
                  <h2 className="text-2xl font-semibold text-slate-800">以訪客身分結帳</h2>
                </div>

                <form className="space-y-4" onSubmit={(e) => { 
                  e.preventDefault(); 
                  if (pendingOrder?.type === 'expand') {
                    setMeters(prev => ({
                      water: prev.water + pendingOrder.water,
                      electricity: prev.electricity + pendingOrder.electricity
                    }));
                    setPendingOrder(null);
                  } else if (pendingOrder?.type === 'renew') {
                    setMeters({ water: pendingOrder.water, electricity: pendingOrder.electricity });
                    setPendingOrder(null);
                  }
                  setCurrentView('success'); 
                  setIsCardFormOpen(false); 
                }}>
                  <div className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-4">帳單地址與卡片資訊</div>

                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#0070BA]" placeholder="名字" />
                    <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#0070BA]" placeholder="姓氏" />
                  </div>

                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="text" maxLength="19" className="w-full border border-slate-300 rounded-lg pl-10 p-3 outline-none focus:border-[#0070BA] font-mono" placeholder="卡號" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" maxLength="5" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#0070BA] font-mono" placeholder="到期日 (MM/YY)" />
                    <input required type="text" maxLength="4" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#0070BA] font-mono" placeholder="安全碼 (CSC)" />
                  </div>

                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#0070BA]" placeholder="帳單地址" />

                  <div className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mt-6 mb-4">聯絡資訊</div>
                  <input required type="email" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#0070BA] bg-slate-50" value={customerInfo.email || ''} readOnly placeholder="電子郵件" />
                  <input required type="tel" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#0070BA]" placeholder="行動電話" />

                  <div className="text-xs text-slate-500 mt-4 leading-relaxed">
                    我們將會把訂單確認信寄至上方的電子郵件地址。點擊下方按鈕，即表示您同意 PayPal 的隱私權聲明與使用條款。
                  </div>

                  <button type="submit" className="w-full bg-[#0070BA] hover:bg-[#005EA6] text-white font-bold py-4 rounded-full transition-colors mt-6 shadow-md text-lg">
                    同意並繼續
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ClientDashboardView = () => (
    <div className="max-w-5xl mx-auto mt-10 p-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <Building2 className="mr-3 text-slate-400" /> {customerInfo.company || '測試公司'} 企業後台
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">目前訂閱方案</h2>
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-8">
              <div>
                <div className="text-sm text-slate-500 mb-1">水表授權數</div>
                <div className="text-2xl font-bold text-slate-800 flex items-center"><Droplet className="text-blue-500 mr-1" size={20} /> {meters.water}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">電表授權數</div>
                <div className="text-2xl font-bold text-slate-800 flex items-center"><Zap className="text-yellow-500 mr-1" size={20} /> {meters.electricity}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">年度費用</div>
              <div className="text-2xl font-bold text-blue-600">${totalCost}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-800 mb-1 flex items-center">
                <Lock size={16} className="text-slate-400 mr-2" />
                方案狀態：啟用中 (訂閱中)
              </div>
              <div className="text-sm text-slate-500">下次帳單日期：2027-03-16 (剩餘 365 天)</div>
            </div>
            <button onClick={() => setCurrentView('client_renew')} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded shadow-sm text-sm font-medium">
              立即手動續約
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">快速操作</h2>
          <div className="space-y-3">
            <button onClick={() => setCurrentView('client_expand_meters')} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-slate-700">
              <span className="flex items-center"><Calculator size={18} className="mr-2 text-blue-500" /> 擴充表位數量</span>
              <ArrowRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );



  const ClientManageSubView = () => (
    <div className="max-w-4xl mx-auto mt-10 p-6 animate-in fade-in duration-300">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentView('client_dashboard')} className="text-slate-400 hover:text-slate-800 mr-3 p-1 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowRight className="transform rotate-180" size={24} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <Settings className="mr-3 text-slate-400" /> 訂閱與帳單管理
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">當前訂閱狀態</h2>
            <p className="text-sm text-slate-500 mt-1">您的方案為 訂閱中 模式</p>
          </div>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <CheckCircle2 size={16} className="mr-1" /> 啟用中
          </span>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-500 mb-1">下次扣款 / 到期日</div>
              <div className="text-lg font-bold text-slate-800 flex items-center">
                <CalendarDays size={18} className="mr-2 text-blue-500" /> 2027-03-16
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">預計續約金額</div>
              <div className="text-lg font-bold text-slate-800">${totalCost} USD</div>
            </div>
            <div className="md:col-span-2 pt-4 border-t border-slate-100 flex space-x-4">
              <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors">
                更新付款方式
              </button>

            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
        <History className="mr-2 text-slate-400" /> 歷史帳單
      </h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-4 font-medium">日期</th>
              <th className="p-4 font-medium">說明</th>
              <th className="p-4 font-medium">金額</th>
              <th className="p-4 font-medium">狀態</th>
              <th className="p-4 font-medium">收據</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-slate-100">
              <td className="p-4 text-slate-800">2026-03-16</td>
              <td className="p-4 text-slate-600">年度平台授權費</td>
              <td className="p-4 text-slate-800 font-medium">${totalCost}</td>
              <td className="p-4"><span className="text-green-600 font-medium">已付款</span></td>
              <td className="p-4"><button className="text-blue-500 hover:underline">下載 PDF</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const ClientRenewView = () => {
    const [renewMeters, setRenewMeters] = useState({ water: meters.water, electricity: meters.electricity });

    const newAnnualCost = (renewMeters.water * PRICES.water) + (renewMeters.electricity * PRICES.electricity);
    
    const diffWater = renewMeters.water - meters.water;
    const diffElectricity = renewMeters.electricity - meters.electricity;

    const handleRenewSubmit = () => {
      setPendingOrder({ type: 'renew', water: renewMeters.water, electricity: renewMeters.electricity, cost: newAnnualCost });
      setCurrentView('checkout');
      setIsCardFormOpen(false);
    };

    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 animate-in fade-in duration-300">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('client_dashboard')} className="text-slate-400 hover:text-slate-800 mr-3 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowRight className="transform rotate-180" size={24} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <RefreshCw className="mr-3 text-slate-400" /> 手動續約設定
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-6">請設定下期合約之表位數量</h2>

            <div className="mb-6">
              <label className="flex items-center text-slate-700 font-medium mb-2">
                <Droplet className="mr-2 text-blue-500" size={20} /> 水表數量 (Water Meters)
              </label>
              <input
                type="number" min="0"
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={renewMeters.water}
                onChange={(e) => setRenewMeters({ ...renewMeters, water: parseInt(e.target.value) || 0 })}
              />
              <div className="text-sm mt-2 flex items-center ">
                <span className="text-slate-500 mr-2">本期: {meters.water} 座</span>
                {diffWater > 0 && <span className="text-green-600 font-medium">(即將增加 {diffWater} 座)</span>}
                {diffWater < 0 && <span className="text-orange-600 font-medium">(即將減少 {Math.abs(diffWater)} 座)</span>}
                {diffWater === 0 && <span className="text-slate-400 font-medium">(與本期無差異)</span>}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center text-slate-700 font-medium mb-2">
                <Zap className="mr-2 text-yellow-500" size={20} /> 電表數量 (Electric Meters)
              </label>
              <input
                type="number" min="0"
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={renewMeters.electricity}
                onChange={(e) => setRenewMeters({ ...renewMeters, electricity: parseInt(e.target.value) || 0 })}
              />
              <div className="text-sm mt-2 flex items-center">
                <span className="text-slate-500 mr-2">本期: {meters.electricity} 座</span>
                {diffElectricity > 0 && <span className="text-green-600 font-medium">(即將增加 {diffElectricity} 座)</span>}
                {diffElectricity < 0 && <span className="text-orange-600 font-medium">(即將減少 {Math.abs(diffElectricity)} 座)</span>}
                {diffElectricity === 0 && <span className="text-slate-400 font-medium">(與本期無差異)</span>}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-6 border-b pb-4">次年度費用預估</h2>
              
              <div className="space-y-4 text-slate-700">
                <div className="flex justify-between">
                  <span>水表費用 ({renewMeters.water} x ${PRICES.water})</span>
                  <span>${(renewMeters.water * PRICES.water).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>電表費用 ({renewMeters.electricity} x ${PRICES.electricity})</span>
                  <span>${(renewMeters.electricity * PRICES.electricity).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-medium text-slate-700">本次應付總額 (USD)</span>
                <span className="text-4xl font-bold text-blue-600">${newAnnualCost.toFixed(2)}</span>
              </div>
              <button
                onClick={handleRenewSubmit}
                disabled={newAnnualCost === 0}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${newAnnualCost > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                確認設定並前往結帳
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ClientExpandMetersView = () => {
    const [addMeters, setAddMeters] = useState({ water: 0, electricity: 0 });
    const [isProcessing, setIsProcessing] = useState(false);

    const addedAnnualCost = (addMeters.water * PRICES.water) + (addMeters.electricity * PRICES.electricity);
    const proratedCost = addedAnnualCost * PRORATED_RATIO;

    const handleExpandSubmit = () => {
      setPendingOrder({ type: 'expand', water: addMeters.water, electricity: addMeters.electricity, cost: proratedCost });
      setCurrentView('checkout');
      setIsCardFormOpen(false);
    };

    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 animate-in fade-in duration-300">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('client_dashboard')} className="text-slate-400 hover:text-slate-800 mr-3 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowRight className="transform rotate-180" size={24} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <PlusCircle className="mr-3 text-slate-400" /> 擴充表位數量
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-6">請輸入欲「新增」的表位數量</h2>

            <div className="mb-6">
              <label className="flex items-center text-slate-700 font-medium mb-2">
                <Droplet className="mr-2 text-blue-500" size={20} /> 新增水表數量
              </label>
              <input
                type="number" min="0"
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={addMeters.water}
                onChange={(e) => setAddMeters({ ...addMeters, water: parseInt(e.target.value) || 0 })}
              />
              <div className="text-sm text-slate-500 mt-1">目前已有: {meters.water} 座</div>
            </div>

            <div className="mb-6">
              <label className="flex items-center text-slate-700 font-medium mb-2">
                <Zap className="mr-2 text-yellow-500" size={20} /> 新增電表數量
              </label>
              <input
                type="number" min="0"
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={addMeters.electricity}
                onChange={(e) => setAddMeters({ ...addMeters, electricity: parseInt(e.target.value) || 0 })}
              />
              <div className="text-sm text-slate-500 mt-1">目前已有: {meters.electricity} 座</div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-6 border-b pb-4">按比例計費 (Prorated)</h2>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-6 flex items-start border border-blue-100">
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  距離本年度合約到期還有 <strong>{REMAINING_DAYS} 天</strong>。<br />
                  本次擴充將依剩餘天數比例收取費用。明年度續約時將以總表位數一併計價。
                </div>
              </div>

              <div className="space-y-4 text-slate-700">
                <div className="flex justify-between">
                  <span>新增年度總價</span>
                  <span>${addedAnnualCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>比例折扣 ({REMAINING_DAYS}/365)</span>
                  <span>x {PRORATED_RATIO.toFixed(4)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-medium text-slate-700">本次應付 (USD)</span>
                <span className="text-4xl font-bold text-blue-600">${proratedCost.toFixed(2)}</span>
              </div>
              <button
                onClick={handleExpandSubmit}
                disabled={proratedCost === 0 || isProcessing}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${proratedCost > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                確認擴充並前往結帳 ${proratedCost.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 員工後台端視圖 ---

  const AdminSidebar = () => (
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col relative">
      <div className="text-white font-bold text-xl mb-6 flex items-center border-b border-slate-800 pb-4">
        <Shield className="mr-2 text-blue-400" /> 內部管理系統
      </div>

      <div className="space-y-2 flex-grow">
        <button onClick={() => setCurrentView('admin_dashboard')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${currentView === 'admin_dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
          <LayoutDashboard className="mr-3" size={20} /> 財務收益
        </button>
        <button onClick={() => setCurrentView('admin_customers')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${currentView === 'admin_customers' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
          <Users className="mr-3" size={20} /> 客戶管理
        </button>

      </div>

      <button onClick={() => setCurrentView(isLoggedIn ? 'client_dashboard' : 'calculator')} className="text-slate-500 hover:text-white text-sm mt-auto flex items-center border-t border-slate-800 pt-4">
        <LogOut size={16} className="mr-2" /> 退出管理後台
      </button>
    </div>
  );

  const AdminDashboardView = () => (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">財務收益儀表板</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
          <div className="text-slate-500 text-sm font-medium mb-1">年度累積總收益 (YTD Revenue)</div>
          <div className="text-3xl font-bold text-slate-800">$2,450,800</div>
          <div className="text-green-500 text-sm mt-2 font-medium">+18% 較去年同期</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
          <div className="text-slate-500 text-sm font-medium mb-1">本月新增收益 (New Revenue)</div>
          <div className="text-3xl font-bold text-slate-800">$128,400</div>
          <div className="text-slate-400 text-sm mt-2">來自 45 筆全新單據</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-purple-500">
          <div className="text-slate-500 text-sm font-medium mb-1">平均客單價 (Average Deal Size)</div>
          <div className="text-3xl font-bold text-slate-800">$6,200</div>
          <div className="text-slate-400 text-sm mt-2">約 410 個管理表位</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">最新收益交易紀錄</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-4 font-medium">客戶名稱</th>
              <th className="p-4 font-medium">方案內容</th>
              <th className="p-4 font-medium">金額 (USD)</th>
              <th className="p-4 font-medium">付款模式</th>
              <th className="p-4 font-medium">日期</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* 這裡插入剛才註冊的測試資料，如果有的話 */}
            {paymentType && (
              <tr className="border-b border-slate-100 bg-blue-50/50">
                <td className="p-4 font-bold text-blue-800">{customerInfo.company || '測試公司'} <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded ml-2">最新</span></td>
                <td className="p-4 text-slate-600">{meters.water} 水表, {meters.electricity} 電表</td>
                <td className="p-4 text-slate-800 font-bold">${totalCost}</td>
                <td className="p-4"><span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">{paymentType === 'credit_card' ? '線上刷卡' : '訂閱中'}</span></td>
                <td className="p-4 text-slate-500">Just Now</td>
              </tr>
            )}
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="p-4 font-medium text-slate-800">Texas Real Estate LLC</td>
              <td className="p-4 text-slate-600">150 水表, 200 電表</td>
              <td className="p-4 text-slate-800">$4,800</td>
              <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">訂閱中</span></td>
              <td className="p-4 text-slate-500">2026-03-16</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );



  const AdminCustomersView = () => {
    const [statusFilter, setStatusFilter] = useState('全部');
    
    const customersData = [
      ...(isLoggedIn ? [{
        company: customerInfo.company || '測試公司',
        email: customerInfo.email || '未提供',
        water: meters.water,
        electricity: meters.electricity,
        cost: totalCost,
        status: '訂閱中',
        date: 'Just Now',
        isCurrent: true
      }] : []),
      {
        company: 'Texas Real Estate LLC',
        email: 'admin@texasre.com',
        water: 150,
        electricity: 200,
        cost: 4800,
        status: '訂閱中',
        date: '2026-03-16'
      },
      {
        company: 'Florida Housing',
        email: 'ops@floridahousing.org',
        water: 85,
        electricity: 0,
        cost: 1020,
        status: '已逾期',
        date: '2025-03-16'
      }
    ];

    const filteredCustomers = statusFilter === '全部' 
      ? customersData 
      : customersData.filter(c => c.status === statusFilter);

    return (
      <div className="flex-1 bg-slate-50 p-8 overflow-y-auto animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">客戶管理</h1>
            <p className="text-slate-500 text-sm mt-1">檢視並管理所有註冊企業客戶與其訂閱狀態。</p>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <div className="flex items-center space-x-2 w-64 justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-sm">
              <span className="text-sm text-slate-500 font-medium">狀態篩選</span>
              <select 
                className="text-sm outline-none bg-transparent text-slate-800 cursor-pointer flex-1 text-right"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="全部">全部顯示</option>
                <option value="訂閱中">訂閱中</option>
                <option value="已逾期">已逾期</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="搜尋公司名稱或信箱..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">企業名稱 / 信箱</th>
                <th className="p-4 font-medium">表位總數</th>
                <th className="p-4 font-medium">年度費用</th>
                <th className="p-4 font-medium">訂閱狀態</th>
                <th className="p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, idx) => (
                  <tr key={idx} className={`border-b border-slate-100 hover:bg-slate-50 ${customer.isCurrent ? 'bg-blue-50/30' : ''}`}>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">
                        {customer.company}
                        {customer.isCurrent && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded ml-1">您</span>}
                      </div>
                      <div className="text-slate-500 text-xs mt-1">{customer.email}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>水表: {customer.water}</div>
                      <div>電表: {customer.electricity}</div>
                    </td>
                    <td className="p-4 text-slate-800 font-medium">${customer.cost}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.status === '已逾期' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => {
                        setSelectedCustomer(customer);
                        setCurrentView('admin_customer_details');
                      }} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded transition-colors font-medium">
                        詳細資料
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    目前沒有符合篩選條件的客戶。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const AdminCustomerDetailsView = () => {
    const [emailStatus, setEmailStatus] = useState('idle');

    const handleSendEmail = () => {
      setEmailStatus('sending');
      setTimeout(() => setEmailStatus('sent'), 1500);
    };

    if (!selectedCustomer) return null;
    return (
      <div className="flex-1 bg-slate-50 p-8 overflow-y-auto animate-in fade-in duration-300">
        <div className="flex items-center mb-8">
          <button onClick={() => setCurrentView('admin_customers')} className="text-slate-400 hover:text-slate-800 mr-4 p-1 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowRight className="transform rotate-180" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{selectedCustomer.company}</h1>
            <p className="text-slate-500 text-sm mt-1">{selectedCustomer.email}</p>
          </div>
          <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${selectedCustomer.status === '已逾期' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {selectedCustomer.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">表位資訊</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 flex items-center"><Droplet size={18} className="mr-2 text-blue-500" />水表授權數</span>
              <span className="font-bold text-slate-800">{selectedCustomer.water}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 flex items-center"><Zap size={18} className="mr-2 text-yellow-500" />電表授權數</span>
              <span className="font-bold text-slate-800">{selectedCustomer.electricity}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">財務與方案</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 flex items-center"><CreditCard size={18} className="mr-2 text-slate-400" />年度總金額</span>
              <span className="font-bold text-blue-600">${selectedCustomer.cost}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 flex items-center"><CalendarDays size={18} className="mr-2 text-slate-400" />上次付款日</span>
              <span className="font-bold text-slate-800">{selectedCustomer.date || '不適用'}</span>
            </div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-slate-600 flex items-center"><CalendarDays size={18} className="mr-2 text-slate-400" />下次付款日</span>
              <span className="font-bold text-slate-800">
                {selectedCustomer.date === 'Just Now' ? '2027-04-14' : 
                 selectedCustomer.date === '2026-03-16' ? '2027-03-16' : 
                 '已過期'}
              </span>
            </div>
            <button 
              onClick={handleSendEmail}
              disabled={emailStatus !== 'idle'}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors ${
                emailStatus === 'idle' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' :
                emailStatus === 'sending' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' :
                'bg-green-50 text-green-600'
              }`}
            >
              <Mail size={16} className="mr-2" />
              {emailStatus === 'idle' ? '寄送續約提醒 Email' :
               emailStatus === 'sending' ? '寄送中...' : '已寄出提醒'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">歷史交易紀錄</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">日期</th>
                <th className="p-4 font-medium">項目</th>
                <th className="p-4 font-medium">金額</th>
                <th className="p-4 font-medium">狀態</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100">
                <td className="p-4 text-slate-800">{selectedCustomer.date || '2026-03-16'}</td>
                <td className="p-4 text-slate-600">系統授權費 (水表 x{selectedCustomer.water}, 電表 x{selectedCustomer.electricity})</td>
                <td className="p-4 text-slate-800 font-medium">${selectedCustomer.cost}</td>
                <td className="p-4"><span className="text-green-600 font-medium">成功</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 主路由渲染邏輯
  if (currentView.startsWith('admin_')) {
    return (
      <div className="flex h-screen bg-slate-50 font-sans">
        <AdminSidebar />
        {currentView === 'admin_dashboard' && <AdminDashboardView />}
        {currentView === 'admin_customers' && <AdminCustomersView />}
        {currentView === 'admin_customer_details' && <AdminCustomerDetailsView />}
      </div>
    );
  }

  // 如果是 PayPal 模擬頁面，不渲染 Navbar 以達到跳轉的視覺效果
  if (currentView === 'paypal_simulation') {
    return <PayPalSimulationView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      {currentView === 'calculator' && CalculatorView()}
      {currentView === 'login' && LoginView()}
      {currentView === 'register' && RegisterView()}
      {currentView === 'checkout' && <CheckoutView />}
      {currentView === 'success' && <SuccessView />}
      {currentView === 'client_dashboard' && <ClientDashboardView />}
      {currentView === 'client_manage_sub' && <ClientManageSubView />}
      {currentView === 'client_renew' && <ClientRenewView />}
      {currentView === 'client_expand_meters' && <ClientExpandMetersView />}
    </div>
  );
}
