/**
 * Exported seed function — called by server.js on first startup.
 * Seeds admin user, demo user, sessions, feedback, and app feedback
 * only if the database is empty.
 */
import User from '../models/User.model.js';
import Session from '../models/Session.model.js';
import Feedback from '../models/Feedback.model.js';
import AppFeedback from '../models/AppFeedback.model.js';

// ─── Helpers ────────────────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const recentDate = (days = 90) => new Date(Date.now() - rand(0, days) * 86400000);

// ─── Data pools (same as seedMockData.js) ────────────────────────────────────
const ARABIC_NAMES = [
    'سارة الأحمدي', 'محمد الزهراني', 'نورة العتيبي', 'عبدالله القحطاني',
    'ريم السلمي',   'خالد المطيري',  'هند الغامدي',  'يوسف الحربي',
    'منى الدوسري',  'فيصل الشمري',   'لمى الرشيدي',  'طارق العنزي',
    'دانة البقمي',  'سلطان الجهني',  'شيماء الرويلي',
];
const AVATARS = ['ola', 'tuwaiq'];
const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B1', 'B2', 'B2', 'C1'];
const AI_FEEDBACKS = [
    'أظهر المتعلم مفردات جيدة مع بعض الأخطاء في استخدام أزمنة الفعل. يُنصح بمراجعة Present Perfect.',
    'النطق كان واضحاً في معظم الأحيان، لكن كانت هناك صعوبة في نطق الأصوات الطويلة. التقدم ملحوظ.',
    'المحادثة كانت طبيعية وسلسة. استخدم المتعلم تراكيب نحوية متقدمة بشكل صحيح في أغلب الأحيان.',
    'هناك تحسن واضح في السرعة والطلاقة. ينصح بقراءة مزيد من النصوص الإنجليزية يومياً.',
    'أظهر المتعلم فهماً جيداً للسياق وأجاب بجمل كاملة. بعض الأخطاء الصغيرة في حروف الجر.',
    'المفردات المستخدمة كانت متنوعة وملائمة للسياق. النطق يحتاج إلى مزيد من التمرين.',
    'كان هناك تردد عند استخدام الأزمنة المعقدة. يُعدّ هذا أمراً طبيعياً في هذا المستوى.',
    'أداء ممتاز! استطاع المتعلم إدارة حوار كامل ومتماسك دون توقف طويل. مستوى B2 يبدو مناسباً.',
    'واجه المتعلم صعوبة في الجمل الشرطية. يُنصح بالتركيز على هذه النقطة في الجلسة القادمة.',
    'أظهر المتعلم إلماماً جيداً بالمصطلحات الوظيفية والمهنية. استمر هكذا!',
];
const EASE_OPTIONS       = ['سهل جداً', 'سهل', 'متوسط', 'صعب'];
const QUALITY_OPTIONS    = ['ممتازة', 'جيدة جداً', 'جيدة', 'مقبولة'];
const USEFULNESS_OPTIONS = ['مفيدة جداً', 'مفيدة', 'مفيدة نوعاً ما', 'غير مفيدة'];
const RECOMMEND_OPTIONS  = ['نعم بالتأكيد', 'نعم', 'ربما', 'لا'];
const ADDITIONAL_COMMENTS = [
    'التطبيق رائع جداً وأستخدمه يومياً.',
    'أتمنى إضافة المزيد من الأفاتار.',
    'الواجهة جميلة وسهلة الاستخدام.',
    'أتمنى أن تكون هناك جلسات أطول.',
    'التغذية الراجعة من الذكاء الاصطناعي مفيدة جداً.',
    '', '',
    'شكراً على هذه التجربة الرائعة!',
    'أتمنى إضافة آلية لتتبع التقدم الأسبوعي.',
    '',
];
const APP_FEEDBACK_MSGS = [
    { name: 'سارة الأحمدي',     message: '[شكوى] الصفحة تتجمد أحياناً عند بدء الجلسة على متصفح Firefox.' },
    { name: 'محمد الزهراني',    message: '[اقتراح] أقترح إضافة خيار اللغة الفرنسية كلغة هدف.' },
    { name: 'نورة العتيبي',     message: '[استفسار] كيف يمكنني تغيير الأفاتار بعد إتمام الإعداد الأولي؟' },
    { name: 'عبدالله القحطاني', message: '[شكوى] أحياناً لا تستجيب الميكروفون في بداية الجلسة.' },
    { name: 'ريم السلمي',       message: '[اقتراح] أتمنى إضافة ملخص أسبوعي يُرسل على البريد الإلكتروني.' },
    { name: 'خالد المطيري',     message: '[اقتراح] هل يمكن إضافة دعم للغة الإشارة في المستقبل؟' },
    { name: 'هند الغامدي',      message: '[شكوى] التقرير لا يظهر أحياناً بعد انتهاء الجلسة مباشرةً.' },
    { name: 'يوسف الحربي',      message: '[استفسار] هل البيانات محفوظة بشكل آمن؟ أريد التأكد من الخصوصية.' },
    { name: 'منى الدوسري',      message: '[اقتراح] يا ريت تضيفون جلسات جماعية مع مستخدمين آخرين!' },
    { name: 'فيصل الشمري',      message: '[شكوى] الصوت ينقطع أحياناً عندما تكون سرعة الإنترنت بطيئة.' },
];

// ─── Exported function ───────────────────────────────────────────────────────
export async function seedAll() {
    // ── Users ──
    const userSeeds = [
        { name: 'Demo User', email: 'test@logah.mvp', password: 'Logah2030', role: 'user', onboardingCompleted: false },
        { name: 'Admin',     email: 'admin@logah.ai', password: 'AdminLogah2030!', role: 'admin', onboardingCompleted: true },
    ];
    for (const seed of userSeeds) {
        const exists = await User.findOne({ email: seed.email });
        if (!exists) { await User.create(seed); console.log(`✅ Seeded user: ${seed.email}`); }
    }

    // ── Mock data (only if sessions collection is empty) ──
    const sessionCount = await Session.countDocuments();
    if (sessionCount > 0) return;

    const admin = await User.findOne({ email: 'admin@logah.ai' });

    const sessionDocs = Array.from({ length: 25 }, (_, i) => {
        const date = recentDate(75);
        return {
            user: admin._id,
            avatarId: pick(AVATARS),
            liveAvatarSessionId: `mock-session-${i + 1}-${Date.now()}`,
            durationInSeconds: rand(120, 900),
            cefrLevel: pick(CEFR_LEVELS),
            aiFeedback: pick(AI_FEEDBACKS),
            status: pick(['completed', 'completed', 'completed', 'interrupted']),
            createdAt: date,
            updatedAt: date,
        };
    });
    await Session.insertMany(sessionDocs);
    console.log('✅ Seeded 25 mock sessions');

    const feedbackDocs = Array.from({ length: 25 }, () => {
        const date = recentDate(60);
        return {
            name: pick(ARABIC_NAMES),
            easeOfUse: pick(EASE_OPTIONS),
            websiteDesign: rand(3, 5),
            sessionQuality: pick(QUALITY_OPTIONS),
            usefulness: pick(USEFULNESS_OPTIONS),
            recommendation: pick(RECOMMEND_OPTIONS),
            additionalComments: pick(ADDITIONAL_COMMENTS),
            createdAt: date,
            updatedAt: date,
        };
    });
    await Feedback.insertMany(feedbackDocs);
    console.log('✅ Seeded 25 mock feedbacks');

    const appFeedbackDocs = APP_FEEDBACK_MSGS.map(msg => ({
        name: msg.name,
        message: msg.message,
        userId: admin._id,
        createdAt: recentDate(30),
    }));
    await AppFeedback.insertMany(appFeedbackDocs);
    console.log('✅ Seeded 10 app feedback messages');
}
