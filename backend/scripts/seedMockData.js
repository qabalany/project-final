/**
 * Seed script — inserts mock sessions, feedback, and app feedback messages.
 * Run with: babel-node scripts/seedMockData.js
 * Safe to run multiple times (clears existing mock data first).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Session from '../models/Session.model.js';
import Feedback from '../models/Feedback.model.js';
import AppFeedback from '../models/AppFeedback.model.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/logah';

// ─── Helpers ────────────────────────────────────────────────────────────────

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Return a random Date somewhere in the last `days` days */
const recentDate = (days = 90) => {
    const now = Date.now();
    return new Date(now - rand(0, days) * 24 * 60 * 60 * 1000);
};

// ─── Data pools ─────────────────────────────────────────────────────────────

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
    '',
    '',
    'شكراً على هذه التجربة الرائعة!',
    'أتمنى إضافة آلية لتتبع التقدم الأسبوعي.',
    '',
];

const APP_FEEDBACK_MSGS = [
    { name: 'سارة الأحمدي',  message: '[شكوى] الصفحة تتجمد أحياناً عند بدء الجلسة على متصفح Firefox.' },
    { name: 'محمد الزهراني', message: '[اقتراح] أقترح إضافة خيار اللغة الفرنسية كلغة هدف.' },
    { name: 'نورة العتيبي',  message: '[استفسار] كيف يمكنني تغيير الأفاتار بعد إتمام الإعداد الأولي؟' },
    { name: 'عبدالله القحطاني', message: '[شكوى] أحياناً لا تستجيب الميكروفون في بداية الجلسة.' },
    { name: 'ريم السلمي',    message: '[اقتراح] أتمنى إضافة ملخص أسبوعي يُرسل على البريد الإلكتروني.' },
    { name: 'خالد المطيري',  message: '[اقتراح] هل يمكن إضافة دعم للغة الإشارة في المستقبل؟' },
    { name: 'هند الغامدي',   message: '[شكوى] التقرير لا يظهر أحياناً بعد انتهاء الجلسة مباشرةً.' },
    { name: 'يوسف الحربي',   message: '[استفسار] هل البيانات محفوظة بشكل آمن؟ أريد التأكد من الخصوصية.' },
    { name: 'منى الدوسري',   message: '[اقتراح] يا ريت تضيفون جلسات جماعية مع مستخدمين آخرين!' },
    { name: 'فيصل الشمري',   message: '[شكوى] الصوت ينقطع أحياناً عندما تكون سرعة الإنترنت بطيئة.' },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected:', MONGO_URI);

    // Find the admin user to link sessions to
    const admin = await User.findOne({ email: 'admin@logah.ai' });
    if (!admin) {
        console.error('❌ admin@logah.ai not found. Run the app and log in at least once.');
        process.exit(1);
    }

    // ── Wipe existing mock markers ──
    await Session.deleteMany({ liveAvatarSessionId: /^mock-/ });
    await Feedback.deleteMany({ name: { $in: ARABIC_NAMES } });
    await AppFeedback.deleteMany({ name: { $in: APP_FEEDBACK_MSGS.map(m => m.name) } });
    console.log('🗑  Cleared old mock data');

    // ── Sessions (25) ──────────────────────────────────────────────────────
    const SESSION_COUNT = 25;
    const sessionDocs = Array.from({ length: SESSION_COUNT }, (_, i) => {
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
    console.log(`✅ Inserted ${SESSION_COUNT} sessions`);

    // ── Feedback (25) ──────────────────────────────────────────────────────
    const FEEDBACK_COUNT = 25;
    const feedbackDocs = Array.from({ length: FEEDBACK_COUNT }, () => {
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
    console.log(`✅ Inserted ${FEEDBACK_COUNT} feedback entries`);

    // ── App Feedback Messages (10) ─────────────────────────────────────────
    const appFeedbackDocs = APP_FEEDBACK_MSGS.map((msg, i) => {
        const date = recentDate(30);
        return {
            name: msg.name,
            message: msg.message,
            userId: admin._id,
            createdAt: date,
            updatedAt: date,
        };
    });
    await AppFeedback.insertMany(appFeedbackDocs);
    console.log(`✅ Inserted ${APP_FEEDBACK_MSGS.length} app feedback messages`);

    await mongoose.disconnect();
    console.log('\n🎉 Mock data seeded successfully!');
}

seed().catch((err) => { console.error(err); process.exit(1); });
