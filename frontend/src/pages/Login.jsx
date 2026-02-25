import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginService } from '../api/auth.service';
import { useAuth } from '../context/AuthContext';

const DEMO_EMAIL = 'test@logah.mvp';
const DEMO_PASSWORD = 'Logah2030';
const API_URL = 'http://localhost:8080/api'; // Or use your config

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;
    const autoAdvanceRef = useRef(null);

    const navigate = useNavigate();
    const { login } = useAuth();

    // Carousel auto-advance
    const startAutoAdvance = useCallback(() => {
        if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000);
    }, [totalSlides]);

    useEffect(() => {
        startAutoAdvance();
        return () => clearInterval(autoAdvanceRef.current);
    }, [startAutoAdvance]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        startAutoAdvance();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'البريد الإلكتروني مطلوب';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'كلمة السر مطلوبة';
        } else if (formData.password.length < 6) {
            newErrors.password = 'كلمة السر يجب أن تكون 6 أحرف على الأقل';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const userData = await loginService(formData);
            login(userData);
            // Admin users → admin dashboard
            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
                // Demo users and new users → start onboarding
            } else if (userData.onboardingCompleted === false) {
                navigate('/mother-tongue');
            } else {
                navigate('/');
            }
        } catch (err) {
            setErrors({ general: err.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول' });
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setFormData({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
        setErrors({});
        setLoading(true);
        try {
            const userData = await loginService({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
            login(userData);
            navigate('/mother-tongue');
        } catch (err) {
            setErrors({ general: 'تعذر الدخول للحساب التجريبي، حاول مجدداً' });
        } finally {
            setLoading(false);
        }
    };

    const slides = [
        {
            img: 'https://c.animaapp.com/mls6bns1cyyo2R/img/illustration.png',
            title: 'العديد من الدورات التجريبية المجانية',
            desc: 'دورات مجانية لمساعدتك على اكتشاف طريقك في التعلّم.',
        },
        {
            img: 'https://c.animaapp.com/mls6bns1cyyo2R/img/illustration-1.png',
            title: 'تعلّم سريع وسهل',
            desc: 'تعلّم بسهولة وفي أي وقت، لتطوير مهاراتك في اللغة الإنجليزية بسرعة وفعالية.',
        },
        {
            img: 'https://c.animaapp.com/mls6bns1cyyo2R/img/illustration-2.png',
            title: 'دروس مخصصة لك',
            desc: 'دروس تناسب مستواك وأهدافك، لضمان التقدم المستمر.',
        },
    ];

    return (
        <main className="flex w-full min-h-screen bg-white font-sans flex-col lg:flex-row items-center lg:items-stretch gap-10 lg:gap-0 py-10 px-5 lg:p-0" dir="rtl">
            {/* Carousel Section */}
            <section aria-label="ميزات التطبيق" className="hidden lg:block w-full max-w-[500px] xl:max-w-[616px] h-[700px] xl:h-[816px] lg:mt-16 lg:mr-[60px] xl:mr-[104px] rounded-[30px] overflow-hidden relative shrink-0">
                <div className="w-full h-full overflow-hidden relative">
                    <div
                        className="flex w-[300%] h-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(${currentSlide * (100 / totalSlides)}%)` }}
                    >
                        {slides.map((slide, i) => (
                            <div className="w-[33.333%] h-full flex justify-center items-center bg-white p-[60px_40px] xl:p-[80px_60px] box-border" key={i}>
                                <div className="flex flex-col items-center text-center gap-5 max-w-[395px]">
                                    <img src={slide.img} alt={slide.title} className="w-[250px] h-[250px] xl:w-[363px] xl:h-[363px] object-contain" />
                                    <h2 className="font-bold text-[#1b0444] text-[24px] xl:text-[31px] leading-snug xl:leading-[42.7px] m-0" dir="rtl">{slide.title}</h2>
                                    <p className="font-normal text-[#858597] text-[18px] xl:text-[22px] leading-normal m-0" dir="rtl">{slide.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 flex gap-2 z-10" role="tablist" aria-label="أزرار التمرير الدائري">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            role="tab"
                            aria-selected={currentSlide === i}
                            aria-label={`الذهاب إلى الشريحة ${i + 1}`}
                            className={`h-2 rounded-[6px] cursor-pointer transition-all duration-300 border-none ${currentSlide === i ? 'w-[39px] bg-gradient-to-r from-[#2994f9] to-[#31d4ed]' : 'w-3 bg-[#eaeaff]'}`}
                            onClick={() => goToSlide(i)}
                        />
                    ))}
                </div>
            </section>

            {/* Form Section */}
            <section className="flex-1 flex flex-col items-start justify-center p-5 sm:p-[40px_20px] lg:p-[40px_60px] w-full max-w-[450px] lg:max-w-[512px] mx-auto gap-[35px]">
                <h1 className="font-bold text-[#1b0444] text-[34px] leading-normal m-0" dir="rtl">تسجيل الدخول</h1>

                {errors.general && <div role="alert" className="bg-[#fee] text-[#c33] p-3 rounded-lg text-center border border-[#fcc] w-full text-[14px]">
                    {errors.general}
                </div>}

                <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center gap-10 w-full">
                    <div className="flex flex-col gap-6 w-full">
                        {/* Email */}
                        <div className="flex flex-col gap-[6px] w-full">
                            <label htmlFor="emailInput" className="font-normal text-[#858597] text-[14px] leading-normal" dir="rtl">
                                البريد الألكتروني
                            </label>
                            <div className={`w-full h-[50px] flex items-center bg-white rounded-[12px] border transition-colors duration-300 box-border focus-within:border-[#2994f9] ${errors.email ? 'border-[#ff4444]' : 'border-[#b8b8d2]'}`}>
                                <input
                                    id="emailInput"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="flex-1 border-none bg-transparent h-full px-4 font-sans font-normal text-[#1b0444] text-[14px] outline-none text-right placeholder-gray-400"
                                    dir="ltr"
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                    aria-describedby={errors.email ? "emailError" : undefined}
                                />
                            </div>
                            {errors.email && <span id="emailError" className="text-[12px] text-[#ff4444] min-h-[18px]" dir="rtl" role="alert">{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-[6px] w-full">
                            <label htmlFor="passwordInput" className="font-normal text-[#858597] text-[14px] leading-normal" dir="rtl">
                                كلمة السر
                            </label>
                            <div className={`w-full h-[50px] flex items-center bg-white rounded-[12px] border transition-colors duration-300 box-border pl-2 focus-within:border-[#2994f9] ${errors.password ? 'border-[#ff4444]' : 'border-[#b8b8d2]'}`}>
                                <input
                                    id="passwordInput"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="flex-1 border-none bg-transparent h-full px-[8px] font-sans font-normal text-[#1b0444] text-[14px] outline-none text-right placeholder-gray-400"
                                    dir="ltr"
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                    aria-describedby={errors.password ? "passwordError" : undefined}
                                />
                                <button
                                    type="button"
                                    className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center transition-opacity duration-200 hover:opacity-70"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                        <path d="M10 4C4.5 4 2 10 2 10s2.5 6 8 6 8-6 8-6-2.5-6-8-6z" stroke="#858597" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="10" cy="10" r="2.5" stroke="#858597" strokeWidth="1.5" />
                                        {showPassword && <line x1="3" y1="3" x2="17" y2="17" stroke="#858597" strokeWidth="1.5" strokeLinecap="round" />}
                                    </svg>
                                </button>
                            </div>
                            {errors.password && <span id="passwordError" className="text-[12px] text-[#ff4444] min-h-[18px]" dir="rtl" role="alert">{errors.password}</span>}
                        </div>

                        <div className="flex justify-start">
                            <Link to="/forgot-password" className="font-normal text-[#858597] text-[15px] no-underline transition-colors duration-300 hover:text-[#2994f9]" dir="rtl">
                                هل نسيت كلمة المرور؟
                            </Link>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-4 w-full">
                        <button
                            type="submit"
                            className="w-full h-12 flex items-center justify-center rounded bg-gradient-to-br from-[#2994f9] to-[#31d4ed] cursor-pointer transition-all duration-300 ease-in-out hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white border-none"
                            disabled={loading}
                            aria-live="polite"
                        >
                            <span className="font-sans font-bold text-[15px]" dir="rtl">
                                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                            </span>
                        </button>

                        <div className="flex items-center gap-[3px]">
                            <span className="font-medium text-[#858597] text-[15px]">ليس لديك حساب؟</span>
                            <Link to="/register" className="font-medium text-[15px] bg-gradient-to-br from-[#31d4ed] to-[#2994f9] bg-clip-text text-transparent no-underline transition-opacity duration-300 hover:opacity-80">
                                إنشاء حساب
                            </Link>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex-1 h-[1px] bg-[#1b0444] opacity-25" />
                        <span className="opacity-50 font-normal text-[#1b0444] text-[14px] whitespace-nowrap" dir="rtl">
                            او سجل الدخول عن طريق
                        </span>
                        <div className="flex-1 h-[1px] bg-[#1b0444] opacity-25" />
                    </div>

                    {/* Social Login Row */}
                    <div className="flex items-center gap-3 w-full">
                        {/* Google — circular icon */}
                        <a
                            href={`${API_URL}/users/google`}
                            className="shrink-0 w-12 h-12 rounded-full border-[1.5px] border-[#b8b8d2] bg-white flex items-center justify-center cursor-pointer transition-all duration-250 ease no-underline hover:border-[#858597] hover:bg-[#f8f8ff] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                            aria-label="الدخول باستخدام حساب جوجل"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </a>

                        {/* Demo Account */}
                        <button
                            type="button"
                            className="flex-1 h-12 flex items-center justify-center gap-[10px] rounded-lg bg-[rgba(41,148,249,0.1)] border-[1.5px] border-[rgba(41,148,249,0.4)] cursor-pointer transition-all duration-250 ease relative overflow-hidden group hover:border-transparent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none !text-transparent"
                            style={{ background: 'linear-gradient(135deg, rgba(41, 148, 249, 0.1) 0%, rgba(49, 212, 237, 0.1) 100%)' }}
                            onClick={handleDemoLogin}
                            disabled={loading}
                            aria-label="تسجيل الدخول بالحساب التجريبي"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#2994f9] to-[#31d4ed] opacity-0 transition-opacity duration-250 ease pointer-events-none group-hover:opacity-100"></div>
                            <span className="text-[17px] leading-none relative z-10 transition-all duration-250 ease group-hover:brightness-[10]" aria-hidden="true">🧪</span>
                            <span className="font-sans font-bold text-[15px] dir-rtl relative z-10 bg-gradient-to-br from-[#2994f9] to-[#31d4ed] bg-clip-text text-transparent transition-all duration-250 ease group-hover:text-white group-hover:bg-none">
                                {loading ? 'جاري الدخول...' : 'الحساب التجريبي'}
                            </span>
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default Login;
