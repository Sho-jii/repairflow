import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, Printer } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useAuthStore } from '../lib/store';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1570978541623-fe3fbe775696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGluZyUyMHByZXNzJTIwY3lhbiUyMG1hZ2VudGElMjB5ZWxsb3clMjBpbmt8ZW58MXx8fHwxNzcyMTkwMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

const FLOAT_IMAGE =
  'https://images.unsplash.com/photo-1758183961426-88d64eb5f787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGluZyUyMHByZXNzJTIwaW5kdXN0cmlhbCUyMG1hY2hpbmUlMjBjb21tZXJjaWFsfGVufDF8fHx8MTc3MjE5MDE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login — would integrate OAuth in production
    setEmail('admin@repairflow.io');
    setPassword('demo');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden"
      style={{ background: '#0c0a1d' }}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent 65%)', transform: 'translate(20%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 65%)', transform: 'translate(-30%, 30%)' }}
        />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[1060px]"
      >
        <div
          className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]"
          style={{
            background: '#13111f',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          {/* Left Panel — Visual */}
          <div className="hidden lg:block relative p-3">
            <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: '640px' }}>
              <ImageWithFallback
                src={HERO_IMAGE}
                alt="Industrial printing press with CMYK ink"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Multi-layer overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a1d]/90 via-[#0c0a1d]/30 to-[#0c0a1d]/50 rounded-2xl" />
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-7 left-7 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <Printer className="w-5 h-5 text-white/90" />
                </div>
                <span className="text-white/90" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  RepairFlow
                </span>
              </motion.div>

              {/* Floating image card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-28 right-7 w-44 rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                }}
              >
                <ImageWithFallback
                  src={FLOAT_IMAGE}
                  alt="Commercial printing equipment"
                  className="w-full h-28 object-cover"
                />
                <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                  <p className="text-white/80" style={{ fontSize: '0.65rem', fontWeight: 600 }}>Press Monitor</p>
                  <p className="text-white/40" style={{ fontSize: '0.6rem' }}>Real-time tracking</p>
                </div>
              </motion.div>

              {/* Bottom text */}
              <div className="absolute bottom-8 left-7 right-7">
                <p className="text-white/90" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                  Keep your print
                  <br />
                  floor running.
                </p>
                <p className="text-white/40 mt-2" style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                  Monitor equipment, manage repairs, and minimize downtime across your entire operation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel — Form */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 lg:hidden mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(129,140,248,0.15)' }}>
                <Printer className="w-5 h-5" style={{ color: '#818cf8' }} />
              </div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em' }}>RepairFlow</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Welcome back
              </p>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#fafafa', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Log in to your
                <br />
                account
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '12px' }}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}
                  className="hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-8"
            >
              {/* Google Sign-in */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <GoogleIcon className="w-5 h-5" />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>or continue with email</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#94a3b8' }}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-12 rounded-xl placeholder:text-[#334155]"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#fafafa',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#94a3b8' }}>
                      Password
                    </Label>
                    <Link
                      to="#"
                      className="transition-colors hover:underline"
                      style={{ fontSize: '0.75rem', fontWeight: 500, color: '#818cf8' }}
                      onClick={(e) => { e.preventDefault(); /* TODO: forgot password flow */ }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="h-12 rounded-xl pr-12 placeholder:text-[#334155]"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#fafafa',
                        fontSize: '0.875rem',
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#475569' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(!!v)}
                  />
                  <label
                    htmlFor="remember"
                    className="cursor-pointer"
                    style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 400 }}
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl px-4 py-3"
                    style={{
                      fontSize: '0.8125rem',
                      color: '#fca5a5',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.15)',
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl gap-2 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 16px -4px rgba(99,102,241,0.4)',
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Log in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-8"
              style={{ fontSize: '0.6875rem', color: '#334155' }}
            >
              Protected by enterprise-grade security
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}