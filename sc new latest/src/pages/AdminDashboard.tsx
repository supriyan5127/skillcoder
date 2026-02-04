import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, BookOpen, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { toast } from 'sonner';
import ParticleBackground from '@/components/ParticleBackground';
import GlowCard from '@/components/GlowCard';
import GlowText from '@/components/GlowText';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkAdmin();
        fetchData();
    }, []);

    const checkAdmin = async () => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/login');
            return;
        }
        // In a real app, check role in 'users' collection. 
        setIsAdmin(true);
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch Users
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
            setProfiles(usersData);

            // Fetch Enrollments
            const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
            const enrollmentsData = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

            // For enrollments, we need to manually join user data if needed for display
            const enrollmentsWithUserData = enrollmentsData.map(enrollment => {
                const userProfile = usersData.find(user => user.id === enrollment.user_id);
                return {
                    ...enrollment,
                    profiles: userProfile ? { email: userProfile.email, full_name: userProfile.full_name } : null
                };
            });
            setEnrollments(enrollmentsWithUserData);

        } catch (error: any) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load admin data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-primary">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <ParticleBackground />

            <div className="container mx-auto px-4 py-8 relative z-10">
                <header className="flex justify-between items-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold glow-text">SkillCoders Admin</span>
                    </Link>
                    <Button variant="outline" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-8"
                >
                    {/* Stats Overview */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <GlowCard glowColor="blue">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{profiles.length}</h3>
                                    <p className="text-muted-foreground">Total Users</p>
                                </div>
                            </div>
                        </GlowCard>
                        <GlowCard glowColor="purple">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-secondary/10 rounded-full">
                                    <BookOpen className="w-8 h-8 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{enrollments.length}</h3>
                                    <p className="text-muted-foreground">Total Enrollments</p>
                                </div>
                            </div>
                        </GlowCard>
                    </div>

                    {/* Users Table */}
                    <GlowCard className="overflow-hidden">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" /> Recent Registrations
                        </h2>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {profiles.map((profile) => (
                                        <TableRow key={profile.id}>
                                            <TableCell className="font-medium">{profile.full_name || 'N/A'}</TableCell>
                                            <TableCell>{profile.email}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${profile.role === 'admin' ? 'bg-red-500/20 text-red-500' :
                                                    profile.role === 'instructor' ? 'bg-purple-500/20 text-purple-500' :
                                                        'bg-blue-500/20 text-blue-500'
                                                    }`}>
                                                    {profile.role || 'student'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recent'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {profiles.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                No users found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </GlowCard>

                    {/* Enrollments Table */}
                    <GlowCard className="overflow-hidden">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Recent Enrollments
                        </h2>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Enrolled At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enrollments.map((enrollment) => (
                                        <TableRow key={enrollment.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{enrollment.user_email || 'Unknown'}</span>
                                                    <span className="text-xs text-muted-foreground">{enrollment.user_id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{enrollment.course_title}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(enrollment.enrolledAt || enrollment.enrolled_at || Date.now()).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {enrollments.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                                No enrollments found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </GlowCard>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
