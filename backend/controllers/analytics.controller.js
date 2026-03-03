import Session from '../models/Session.model.js';
import User from '../models/User.model.js';

/**
 * GET /api/analytics/summary
 * Returns aggregate stats for the admin dashboard SessionAnalytics component.
 */
export const getAnalyticsSummary = async (req, res) => {
    try {
        // ── Totals ────────────────────────────────────────────────────────
        const totalSessions = await Session.countDocuments();

        const durationAgg = await Session.aggregate([
            { $group: { _id: null, totalSeconds: { $sum: '$durationInSeconds' }, avgSeconds: { $avg: '$durationInSeconds' } } }
        ]);
        const totalSeconds = durationAgg[0]?.totalSeconds || 0;
        const avgDurationSeconds = Math.round(durationAgg[0]?.avgSeconds || 0);

        // Unique users who have at least one session
        const uniqueUserIds = await Session.distinct('user');
        const totalUniqueUsers = uniqueUserIds.length;

        // ── Sessions per day (last 30 days) ─────────────────────────────
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sessionsPerDayRaw = await Session.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const sessionsPerDay = sessionsPerDayRaw.map(d => ({ date: d._id, count: d.count }));

        // ── CEFR distribution ────────────────────────────────────────────
        const cefrRaw = await Session.aggregate([
            { $match: { cefrLevel: { $exists: true, $ne: null } } },
            { $group: { _id: '$cefrLevel', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        const cefrDistribution = cefrRaw.map(d => ({ level: d._id, count: d.count }));

        // ── Avatar usage ─────────────────────────────────────────────────
        const avatarRaw = await Session.aggregate([
            { $group: { _id: '$avatarId', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const avatarUsage = avatarRaw.map(d => ({ avatar: d._id, count: d.count }));

        res.json({
            success: true,
            data: {
                totalSessions,
                totalSeconds,
                totalMinutes: Math.round(totalSeconds / 60),
                totalUniqueUsers,
                avgDurationSeconds,
                sessionsPerDay,
                cefrDistribution,
                avatarUsage,
            }
        });
    } catch (error) {
        console.error('Analytics summary error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics summary' });
    }
};

/**
 * GET /api/analytics/user-activity
 * Returns per-user session stats for the admin activity table.
 */
export const getUserActivity = async (req, res) => {
    try {
        const activityRaw = await Session.aggregate([
            {
                $group: {
                    _id: '$user',
                    sessionCount: { $sum: 1 },
                    totalSeconds: { $sum: '$durationInSeconds' },
                    lastSession: { $max: '$createdAt' },
                    // Collect all CEFR levels to find the most common one
                    cefrLevels: { $push: '$cefrLevel' }
                }
            },
            { $sort: { lastSession: -1 } },
            { $limit: 50 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } }
        ]);

        const activity = activityRaw.map(row => {
            // Find the most-common CEFR level for this user
            const levelCounts = {};
            (row.cefrLevels || []).forEach(l => { if (l) levelCounts[l] = (levelCounts[l] || 0) + 1; });
            const topLevel = Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

            return {
                userId: row._id,
                name: row.userInfo?.name || 'مستخدم',
                email: row.userInfo?.email || '',
                sessionCount: row.sessionCount,
                totalSeconds: row.totalSeconds,
                lastSession: row.lastSession,
                cefrLevel: topLevel,
            };
        });

        res.json({ success: true, data: activity });
    } catch (error) {
        console.error('User activity error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user activity' });
    }
};
