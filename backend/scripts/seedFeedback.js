import mongoose from 'mongoose';
import config from '../config/index.js';
import Feedback from '../models/Feedback.model.js';

// This is a list of mock data containing realistic Arabic feedback.
// so i can populate local database for testing the Admin Dashboard UI.
const mockFeedbacks = [
    {
        name: 'عبدالله الشهري',
        easeOfUse: 'سهل جداً',
        websiteDesign: 5,
        sessionQuality: 'ممتازة',
        usefulness: 'نعم، مفيد جداً',
        recommendation: 'بالتأكيد 🤩',
        additionalComments: 'تجربة رائعة! المحادثة مع المدرب الذكي كانت ممتعة جداً.',
        createdAt: new Date('2026-02-20T10:30:00'),
    },
    {
        name: 'نورة العتيبي',
        easeOfUse: 'سهل جداً',
        websiteDesign: 4,
        sessionQuality: 'جيدة جداً',
        usefulness: 'نعم، مفيد جداً',
        recommendation: 'بالتأكيد 🤩',
        additionalComments: 'أتمنى يكون في مستويات أكثر.',
        createdAt: new Date('2026-02-19T14:15:00'),
    },
    {
        name: 'محمد القحطاني',
        easeOfUse: 'سهل لحد ما',
        websiteDesign: 4,
        sessionQuality: 'ممتازة',
        usefulness: 'نعم، نوعاً ما',
        recommendation: 'بالتأكيد 🤩',
        additionalComments: '',
        createdAt: new Date('2026-02-18T09:00:00'),
    },
    {
        name: 'سارة الدوسري',
        easeOfUse: 'سهل جداً',
        websiteDesign: 5,
        sessionQuality: 'ممتازة',
        usefulness: 'نعم، مفيد جداً',
        recommendation: 'بالتأكيد 🤩',
        additionalComments: 'المنصة فاقت توقعاتي بصراحة، ممتازة!',
        createdAt: new Date('2026-02-17T16:45:00'),
    },
    {
        name: 'فهد المطيري',
        easeOfUse: 'محايد',
        websiteDesign: 3,
        sessionQuality: 'مقبولة',
        usefulness: 'لا، لم استفد كثيراً',
        recommendation: 'ربما 🤔',
        additionalComments: 'الجلسة كانت قصيرة وحسيت ما استفدت كثير.',
        createdAt: new Date('2026-02-16T11:20:00'),
    },
    {
        name: 'ريم الحربي',
        easeOfUse: 'سهل لحد ما',
        websiteDesign: 4,
        sessionQuality: 'جيدة جداً',
        usefulness: 'نعم، مفيد جداً',
        recommendation: 'بالتأكيد 🤩',
        additionalComments: 'حبيت التقييم اللي بعد الجلسة.',
        createdAt: new Date('2026-02-15T08:30:00'),
    },
    {
        name: 'خالد السبيعي',
        easeOfUse: 'سهل جداً',
        websiteDesign: 5,
        sessionQuality: 'ممتازة',
        usefulness: 'نعم، مفيد جداً',
        recommendation: 'بالتأكيد 🤩',
        additionalComments: '',
        createdAt: new Date('2026-02-14T13:10:00'),
    },
    {
        name: 'هند العنزي',
        easeOfUse: 'صعب',
        websiteDesign: 2,
        sessionQuality: 'سيئة',
        usefulness: 'لا، لم استفد كثيراً',
        recommendation: 'لا اعتقد 😕',
        additionalComments: 'واجهت مشاكل تقنية كثيرة خلال الجلسة.',
        createdAt: new Date('2026-02-13T17:00:00'),
    },
    {
        name: 'عمر الغامدي',
        easeOfUse: 'سهل لحد ما',
        websiteDesign: 3,
        sessionQuality: 'جيدة جداً',
        usefulness: 'نعم، نوعاً ما',
        recommendation: 'ربما 🤔',
        additionalComments: 'فكرة المنصة ممتازة بس تحتاج تطوير أكثر.',
        createdAt: new Date('2026-02-12T10:45:00'),
    },
    {
        name: 'لمى الزهراني',
        easeOfUse: 'سهل جداً',
        websiteDesign: 5,
        sessionQuality: 'ممتازة',
        usefulness: 'نعم، مفيد جداً',
        recommendation: 'بالتأكيد 🤩',
        additionalComments: 'أفضل منصة لتعلم الإنجليزية جربتها!',
        createdAt: new Date('2026-02-11T15:30:00'),
    },
    {
        name: 'تركي البقمي',
        easeOfUse: 'محايد',
        websiteDesign: 3,
        sessionQuality: 'مقبولة',
        usefulness: 'نعم، نوعاً ما',
        recommendation: 'ربما 🤔',
        additionalComments: '',
        createdAt: new Date('2026-02-10T12:00:00'),
    },
    {
        name: 'أمل الشمري',
        easeOfUse: 'سهل جداً',
        websiteDesign: 4,
        sessionQuality: 'جيدة جداً',
        usefulness: 'نعم، مفيد جداً',
        recommendation: 'بالتأكيد 🤩',
        additionalComments: 'شكراً على هالمنصة، أتمنى تضيفون دروس قراءة.',
        createdAt: new Date('2026-02-09T09:15:00'),
    },
];

// This function directly connects to the database, inserts the array of data, and disconnects.
const seedDatabase = async () => {
    try {
        console.log('🔄 Connecting to database...');
        await mongoose.connect(config.dbUri);

        const existingCount = await Feedback.countDocuments();
        if (existingCount > 0) {
            console.log(`⚠️ Database already contains ${existingCount} feedback entries.`);
            console.log('Skipping seed to avoid inserting duplicate mock data.');
        } else {
            console.log('📥 Inserting mock feedback...');
            await Feedback.insertMany(mockFeedbacks);
            console.log(`✅ Successfully seeded ${mockFeedbacks.length} feedback entries!`);
        }

        console.log('🔌 Disconnecting...');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
