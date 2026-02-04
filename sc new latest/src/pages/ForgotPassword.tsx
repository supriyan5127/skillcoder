import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowButton from '@/components/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);

            setSubmitted(true);
            toast.success('Password reset email sent!');
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to send reset email: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
            <ParticleBackground />

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-md mx-auto">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <Link to="/" className="inline-flex items-center gap-2">
                            <Shield className="w-10 h-10 text-primary" />
                            <span className="text-2xl font-bold glow-text">SkillCoders</span>
                        </Link>
                    </motion.div>

                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 glow-border"
                    >
                        {!submitted ? (
                            <>
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                                    <p className="text-muted-foreground">
                                        Enter your email properly to reset your password
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email Address
                                        </Label>
                                        <div className="relative mt-2">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="pl-10 bg-background/50 border-border focus:border-primary"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <GlowButton
                                            variant="primary"
                                            size="lg"
                                            className="w-full"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                                                {!loading && <ArrowRight className="w-5 h-5" />}
                                            </span>
                                        </GlowButton>
                                    </motion.div>
                                </form>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Check your email</h2>
                                <p className="text-muted-foreground mb-8">
                                    We've sent a password reset link to <span className="text-foreground font-medium">{email}</span>.
                                </p>
                                <GlowButton
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Back to Reset
                                </GlowButton>
                            </div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-center mt-6"
                        >
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
