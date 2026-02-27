import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ArrowRight, Check, X, ArrowLeft, Printer } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuthStore } from '../lib/store';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

const SIGNUP_IMAGE =
  'https://images.unsplash.com/photo-1586939735472-c24cb4621c43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcHJpbnRpbmclMjBwcm9kdWN0aW9uJTIwY29sb3IlMjBtYW5hZ2VtZW50fGVufDF8fHx8MTc3MjE5MDI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: { label: string; met: boolean }[];
}

function getPasswordStrength(password: string): PasswordStrength {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  const score = checks.filter(c => c.met).length;
  const map: Record<number, { label: string; color: string }> = {
    0: { label: '', color: '' },
    1: { label: 'Very Weak', color: 'bg-red-500' },
    2: { label: 'Weak', color: 'bg-orange-500' },
    3: { label: 'Fair', color: 'bg-yellow-500' },
    4: { label: 'Strong', color: 'bg-green-500' },
    5: { label: 'Excellent', color: 'bg-emerald-500' },
  };
  return { score, ...map[score], checks };
}

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

export function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '' as string,
    company: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const passwordStrength = getPasswordStrength(formData.password);

  const update = (key: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    else if (formData.fullName.trim().split(' ').length < 2) e.fullName = 'Please enter first and last name';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email format';
    if (formData.phone && !/^\+?[\d\s\-()]{7,}$/.test(formData.phone)) e.phone = 'Invalid phone format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!formData.password) e.password = 'Password is required';
    else if (passwordStrength.score < 3) e.password = 'Password is too weak';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.role) e.role = 'Please select a role';
    if (!formData.agreeTerms) e.agreeTerms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    toast.success('Account created successfully!', { description: 'Welcome to RepairFlow. You can now sign in.' });
    setTimeout(() => navigate('/login'), 2500);
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fafafa',
    fontSize: '0.875rem',
  };
  const labelStyle: React.CSSProperties = { fontSize: '0.8125rem', fontWeight: 500, color: '#94a3b8' };
  const errorEl = (msg: string) => (
    <p className="text-xs flex items-center gap-1 mt-1" style={{ color: '#fca5a5' }}><X className="w-3 h-3" />{msg}</p>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden" style={{ background: '#0c0a1d' }}>
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #818cf8, transparent 65%)', transform: 'translate(20%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #6366f1, transparent 65%)', transform: 'translate(-30%, 30%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[1060px]"
      >
        <div
          className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]"
          style={{ background: '#13111f', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)' }}
        >
          {/* Left — Image */}
          <div className="hidden lg:block relative p-3">
            <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: '680px' }}>
              <ImageWithFallback src={SIGNUP_IMAGE} alt="Digital printing production" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a1d]/90 via-[#0c0a1d]/30 to-[#0c0a1d]/50 rounded-2xl" />
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />

              {/* Logo */}
              <div className="absolute top-7 left-7 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <Printer className="w-5 h-5 text-white/90" />
                </div>
                <span className="text-white/90" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>RepairFlow</span>
              </div>

              {/* Step progress on image */}
              <div className="absolute bottom-8 left-7 right-7">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-white/80' : 'bg-white/15'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-white/80' : 'bg-white/15'}`} />
                </div>
                <p className="text-white/90" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                  {step === 1 ? 'Start managing\nyour print floor.' : 'One more step\nto get started.'}
                </p>
                <p className="text-white/40 mt-2" style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                  {step === 1 ? 'Create your account and connect your team in minutes.' : 'Set up your security preferences and role.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-10 overflow-y-auto" style={{ maxHeight: '100vh' }}>
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 lg:hidden mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(129,140,248,0.15)' }}>
                <Printer className="w-5 h-5" style={{ color: '#818cf8' }} />
              </div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em' }}>RepairFlow</span>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.2)' }}
                  >
                    <Check className="w-8 h-8" style={{ color: '#22c55e' }} />
                  </motion.div>
                  <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#fafafa' }}>Account Created!</h2>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '8px' }}>
                    Welcome, {formData.fullName.split(' ')[0]}! Redirecting to sign in...
                  </p>
                  <div className="mt-6 mx-auto max-w-xs">
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'linear' }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={`step-${step}`} initial={{ opacity: 0, x: step === 1 ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: step === 1 ? -16 : 16 }} transition={{ duration: 0.25 }}>
                  {step === 2 && (
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 mb-5 transition-colors hover:underline" style={{ fontSize: '0.8125rem', color: '#818cf8', fontWeight: 500 }}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  )}

                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    {step === 1 ? 'Get started' : 'Step 2 of 2'}
                  </p>
                  <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#fafafa', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                    Create your
                    <br />account
                  </h1>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '12px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }} className="hover:underline">Log in</Link>
                  </p>

                  {step === 1 ? (
                    <div className="mt-8 space-y-5">
                      {/* Google */}
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 h-12 rounded-xl transition-all duration-200"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 500 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      >
                        <GoogleIcon className="w-5 h-5" />
                        Sign up with Google
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>or</span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="fullName" style={labelStyle}>Full Name</Label>
                          <Input id="fullName" placeholder="John Doe" value={formData.fullName} onChange={e => update('fullName', e.target.value)} className={`h-12 rounded-xl placeholder:text-[#334155] ${errors.fullName ? 'border-red-500/40' : ''}`} style={inputStyle} autoComplete="name" />
                          {errors.fullName && errorEl(errors.fullName)}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="company" style={labelStyle}>Company <span style={{ color: '#475569', fontSize: '0.6875rem' }}>(opt.)</span></Label>
                          <Input id="company" placeholder="Acme Print" value={formData.company} onChange={e => update('company', e.target.value)} className="h-12 rounded-xl placeholder:text-[#334155]" style={inputStyle} autoComplete="organization" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="signupEmail" style={labelStyle}>Email</Label>
                        <Input id="signupEmail" type="email" placeholder="you@company.com" value={formData.email} onChange={e => update('email', e.target.value)} className={`h-12 rounded-xl placeholder:text-[#334155] ${errors.email ? 'border-red-500/40' : ''}`} style={inputStyle} autoComplete="email" />
                        {errors.email && errorEl(errors.email)}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" style={labelStyle}>Phone <span style={{ color: '#475569', fontSize: '0.6875rem' }}>(optional)</span></Label>
                        <Input id="phone" type="tel" placeholder="+1 555-0123" value={formData.phone} onChange={e => update('phone', e.target.value)} className={`h-12 rounded-xl placeholder:text-[#334155] ${errors.phone ? 'border-red-500/40' : ''}`} style={inputStyle} autoComplete="tel" />
                        {errors.phone && errorEl(errors.phone)}
                      </div>

                      <Button type="button" className="w-full h-12 rounded-xl gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', border: 'none', boxShadow: '0 4px 16px -4px rgba(99,102,241,0.4)' }} onClick={handleNext}>
                        Continue <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="signupPassword" style={labelStyle}>Password</Label>
                        <div className="relative">
                          <Input id="signupPassword" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password} onChange={e => update('password', e.target.value)} className={`h-12 rounded-xl pr-12 placeholder:text-[#334155] ${errors.password ? 'border-red-500/40' : ''}`} style={inputStyle} autoComplete="new-password" />
                          <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#475569' }} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                          </button>
                        </div>
                        {errors.password && errorEl(errors.password)}
                        {formData.password && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5 pt-1">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength.score ? passwordStrength.color : 'bg-white/10'}`} />
                              ))}
                            </div>
                            <span style={{ fontSize: '0.625rem', color: '#64748b' }}>{passwordStrength.label}</span>
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</Label>
                        <div className="relative">
                          <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" value={formData.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className={`h-12 rounded-xl pr-12 placeholder:text-[#334155] ${errors.confirmPassword ? 'border-red-500/40' : ''}`} style={inputStyle} autoComplete="new-password" />
                          <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#475569' }} onClick={() => setShowConfirm(!showConfirm)}>
                            {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                          </button>
                        </div>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <p className="text-xs flex items-center gap-1 mt-1" style={{ color: '#22c55e' }}><Check className="w-3 h-3" /> Passwords match</p>
                        )}
                        {errors.confirmPassword && errorEl(errors.confirmPassword)}
                      </div>

                      <div className="space-y-1.5">
                        <Label style={labelStyle}>Role</Label>
                        <Select value={formData.role} onValueChange={v => update('role', v)}>
                          <SelectTrigger className={`h-12 rounded-xl ${errors.role ? 'border-red-500/40' : ''}`} style={{ ...inputStyle, color: formData.role ? '#fafafa' : '#334155' }}>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin — Full system access</SelectItem>
                            <SelectItem value="manager">Manager — Team & operations</SelectItem>
                            <SelectItem value="technician">Technician — Field operations</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.role && errorEl(errors.role)}
                      </div>

                      <div className="flex items-start gap-2.5 pt-1">
                        <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={v => update('agreeTerms', !!v)} className="mt-0.5" />
                        <label htmlFor="terms" className="cursor-pointer leading-relaxed" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          I agree to the <span style={{ color: '#818cf8', fontWeight: 500 }}>Terms & Conditions</span> and <span style={{ color: '#818cf8', fontWeight: 500 }}>Privacy Policy</span>
                        </label>
                      </div>
                      {errors.agreeTerms && errorEl(errors.agreeTerms)}

                      <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', fontSize: '0.9375rem', fontWeight: 600, color: '#fff', border: 'none', boxShadow: '0 4px 16px -4px rgba(99,102,241,0.4)' }}>
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center mt-8" style={{ fontSize: '0.6875rem', color: '#334155' }}>
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
