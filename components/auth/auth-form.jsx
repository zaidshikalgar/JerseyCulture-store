'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Shield, Truck, Headphones, X, Mail, Loader2, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
const inputClass = 'w-full rounded-md border border-border/50 bg-secondary px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary transition-colors';
export function AuthForm({ mode }) {
    const router = useRouter();
    const { login, registerRequestOtp, registerVerifyOtp } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showGooglePopup, setShowGooglePopup] = useState(false);
    const [googleEmail, setGoogleEmail] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleStep, setGoogleStep] = useState('email');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [infoMessage, setInfoMessage] = useState(null);
    const [otp, setOtp] = useState('');
    const [isOtpStage, setIsOtpStage] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [forgotStep, setForgotStep] = useState('request');
    const [forgotLoading, setForgotLoading] = useState(false);
    const isLogin = mode === 'login';
    function handleGoogleSignIn() {
        setShowGooglePopup(true);
        setGoogleStep('email');
        setGoogleEmail('');
    }
    function handleGoogleEmailSubmit(e) {
        e.preventDefault();
        if (!googleEmail.trim())
            return;
        setGoogleStep('confirm');
    }
    function handleGoogleConfirm() {
        setGoogleLoading(true);
        setTimeout(() => {
            setGoogleLoading(false);
            setShowGooglePopup(false);
            router.push('/');
        }, 1500);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage(null);
        setInfoMessage(null);
        if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
            setErrorMessage('Please fill all required fields.');
            return;
        }
        if (!isLogin && password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        if (!isLogin && isOtpStage && !otp.trim()) {
            setErrorMessage('Please enter the OTP sent to your email.');
            return;
        }
        setIsSubmitting(true);
        let result;
        if (isLogin) {
            result = await login(email.trim(), password);
        }
        else if (!isOtpStage) {
            result = await registerRequestOtp(name.trim(), email.trim(), password);
        }
        else {
            result = await registerVerifyOtp(email.trim(), otp.trim());
        }
        setIsSubmitting(false);
        if (!result.ok) {
            setErrorMessage(result.message || 'Authentication failed.');
            return;
        }
        if (!isLogin && !isOtpStage) {
            setIsOtpStage(true);
            setInfoMessage(result.message || 'OTP sent to your email. Please verify to continue.');
            return;
        }
        const redirectPath = result.user?.role === 'admin' ? '/admin' : '/';
        router.push(redirectPath);
        router.refresh();
    }
    async function handleForgotRequestOtp(e) {
        e.preventDefault();
        setErrorMessage(null);
        setInfoMessage(null);
        if (!forgotEmail.trim()) {
            setErrorMessage('Please enter your email.');
            return;
        }
        setForgotLoading(true);
        try {
            const result = await apiRequest('/auth/forgot-password/request-otp', {
                method: 'POST',
                body: JSON.stringify({ email: forgotEmail.trim() }),
            });
            setInfoMessage(result?.message || 'OTP sent to your email.');
            setForgotStep('verify');
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to send reset OTP.');
        }
        finally {
            setForgotLoading(false);
        }
    }
    async function handleForgotResetPassword(e) {
        e.preventDefault();
        setErrorMessage(null);
        setInfoMessage(null);
        if (!forgotOtp.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
            setErrorMessage('Please fill all reset fields.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('New passwords do not match.');
            return;
        }
        setForgotLoading(true);
        try {
            const result = await apiRequest('/auth/forgot-password/reset', {
                method: 'POST',
                body: JSON.stringify({
                    email: forgotEmail.trim(),
                    otp: forgotOtp.trim(),
                    newPassword,
                }),
            });
            setInfoMessage(result?.message || 'Password reset successful. Please sign in.');
            setShowForgotPassword(false);
            setForgotStep('request');
            setForgotOtp('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to reset password.');
        }
        finally {
            setForgotLoading(false);
        }
    }
    return (<div className="flex min-h-[calc(100vh-140px)]">
      <div className="relative hidden w-1/2 lg:block">
        <Image src="/images/auth-bg.jpg" alt="Football stadium" fill className="object-cover" sizes="50vw" priority/>
        <div className="absolute inset-0 bg-background/60"/>
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          {/* Brand wordmark intentionally hidden on this side */}
          <div className="relative z-10" />

          <div className="relative z-10">
            <h2 className="whitespace-pre-line font-serif text-4xl font-semibold italic leading-tight text-foreground">
              {isLogin ? 'Welcome back\nto the culture.' : 'Join the\nculture today.'}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/50">
              {isLogin
            ? 'Access your orders, wishlists, and exclusive member-only drops.'
            : 'Create your account for faster checkout, order tracking, and exclusive offers.'}
            </p>
          </div>

          <div className="relative z-10 flex gap-8">
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-primary"/>
              <span className="text-[11px] text-foreground/50">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="h-4 w-4 text-primary"/>
              <span className="text-[11px] text-foreground/50">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Headphones className="h-4 w-4 text-primary"/>
              <span className="text-[11px] text-foreground/50">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-16 lg:w-1/2 lg:px-20 xl:px-28">
        <Link href="/" className="mb-10 text-center lg:hidden">
          <span className="font-serif text-2xl font-bold tracking-[0.05em] text-foreground">
            JERSEY
          </span>
          <span className="block text-[10px] font-sans font-bold tracking-[0.35em] text-primary">
            CULTURE
          </span>
        </Link>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            {isLogin ? 'Sign in to your account' : 'Get started for free'}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-sm text-foreground/40">
            {isLogin
            ? 'Enter your credentials to access your account.'
            : 'Fill in your details below to get started.'}
          </p>
        </div>

        <div className="mt-8">
          <button onClick={handleGoogleSignIn} className="flex h-12 w-full items-center justify-center gap-2.5 rounded-md border border-border/50 bg-secondary text-[12px] font-medium text-foreground transition-colors hover:border-foreground/20">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"/>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-[11px] text-foreground/30">
              or continue with email
            </span>
          </div>
        </div>

        {!isLogin || !showForgotPassword ? (<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (<div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/50">
                Full Name
              </label>
              <input type="text" placeholder="Your full name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} disabled={isOtpStage}/>
            </div>)}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/50">
              Email Address
            </label>
            <input type="email" placeholder="you@example.com" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} disabled={isOtpStage}/>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/50">
                Password
              </label>
              {isLogin && (<button type="button" onClick={() => {
                    setShowForgotPassword(true);
                    setForgotEmail(email || '');
                    setErrorMessage(null);
                    setInfoMessage(null);
                }} className="text-[11px] text-primary hover:underline">
                  Forgot password?
                </button>)}
            </div>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className={`pr-10 ${inputClass}`} value={password} onChange={(e) => setPassword(e.target.value)} disabled={isOtpStage && !isLogin}/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/30 transition-colors hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              </button>
            </div>
          </div>

          {!isLogin && (<div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/50">
                Confirm Password
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Re-enter your password" className={`pr-10 ${inputClass}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isOtpStage}/>
              </div>
            </div>)}

          {!isLogin && isOtpStage && (<div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/50">
                Email OTP
              </label>
              <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" className={inputClass} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}/>
            </div>)}

          {infoMessage && (<p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-[12px] text-primary">
              {infoMessage}
            </p>)}

          {errorMessage && (<p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] text-destructive">
              {errorMessage}
            </p>)}

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-4 h-12 w-full gap-2 bg-primary text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {isSubmitting ? (<span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin"/>
                {isLogin ? 'Signing In...' : isOtpStage ? 'Verifying OTP...' : 'Sending OTP...'}
              </span>) : (<>
                {isLogin ? 'Sign In' : isOtpStage ? 'Verify OTP & Create Account' : 'Send OTP'}
                <ArrowRight className="h-4 w-4"/>
              </>)}
          </Button>

          {!isLogin && isOtpStage && (<button type="button" className="text-[11px] text-primary hover:underline" onClick={async () => {
                setErrorMessage(null);
                setInfoMessage(null);
                setIsSubmitting(true);
                const resend = await registerRequestOtp(name.trim(), email.trim(), password);
                setIsSubmitting(false);
                if (!resend.ok) {
                    setErrorMessage(resend.message || 'Failed to resend OTP');
                    return;
                }
                setInfoMessage(resend.message || 'OTP resent to your email.');
            }}>
              Resend OTP
            </button>)}
        </form>) : (<div className="rounded-md border border-border/40 bg-card p-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/50">
              Reset Password
            </p>
            {forgotStep === 'request' ? (<form className="flex flex-col gap-3" onSubmit={handleForgotRequestOtp}>
                <input type="email" placeholder="Enter your account email" className={inputClass} value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}/>
                <div className="flex gap-2">
                  <Button type="submit" disabled={forgotLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {forgotLoading ? 'Sending OTP...' : 'Send Reset OTP'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                        setShowForgotPassword(false);
                        setErrorMessage(null);
                        setInfoMessage(null);
                    }}>
                    Back to Login
                  </Button>
                </div>
              </form>) : (<form className="flex flex-col gap-3" onSubmit={handleForgotResetPassword}>
                <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter OTP" className={inputClass} value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}/>
                <input type="password" placeholder="New password" className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                <input type="password" placeholder="Confirm new password" className={inputClass} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}/>
                <div className="flex gap-2">
                  <Button type="submit" disabled={forgotLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setForgotStep('request')}>
                    Resend OTP
                  </Button>
                </div>
              </form>)}
          </div>)}

        {!isLogin && (<p className="mt-5 text-center text-[11px] leading-relaxed text-foreground/30">
            {'By creating an account, you agree to our '}
            <Link href="/terms" className="text-foreground/50 underline hover:text-foreground">
              Terms of Service
            </Link>
            {' and '}
            <Link href="/privacy" className="text-foreground/50 underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>)}

        <p className="mt-8 text-center text-sm text-foreground/40">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link href={isLogin ? '/auth/register' : '/auth/login'} className="font-medium text-primary hover:underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>

      {showGooglePopup && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border border-border/30 bg-card p-0 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="text-sm font-semibold text-foreground">
                  {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </span>
              </div>
              <button onClick={() => setShowGooglePopup(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-secondary hover:text-foreground" aria-label="Close">
                <X className="h-4 w-4"/>
              </button>
            </div>

            <div className="px-6 py-6">
              {googleStep === 'email' && (<form onSubmit={handleGoogleEmailSubmit}>
                  <p className="mb-5 text-sm text-foreground/50">
                    Enter your Google email to continue
                  </p>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/25"/>
                    <input type="email" value={googleEmail} onChange={(e) => setGoogleEmail(e.target.value)} placeholder="your.email@gmail.com" className="w-full rounded-md border border-border/50 bg-secondary py-3.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary" autoFocus required/>
                  </div>
                  <Button type="submit" className="mt-5 h-11 w-full bg-primary text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary/90">
                    Continue
                    <ArrowRight className="ml-2 h-3.5 w-3.5"/>
                  </Button>
                </form>)}

              {googleStep === 'confirm' && (<div>
                  <p className="mb-5 text-sm text-foreground/50">
                    {isLogin ? 'Continue signing in as:' : 'Continue signing up as:'}
                  </p>

                  <div className="rounded-lg border border-border/40 bg-secondary p-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                        {googleEmail.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-foreground">
                          {googleEmail
                    .split('@')[0]
                    .replace(/[._]/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </p>
                        <p className="truncate text-[12px] text-foreground/40">
                          {googleEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button onClick={() => setGoogleStep('email')} className="flex h-11 flex-1 items-center justify-center rounded-md border border-border/50 text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground">
                      Change
                    </button>
                    <Button onClick={handleGoogleConfirm} disabled={googleLoading} className="h-11 flex-1 bg-primary text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary/90">
                      {googleLoading ? (<span className="flex items-center gap-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin"/>
                          Signing in...
                        </span>) : (isLogin ? 'Sign In' : 'Create Account')}
                    </Button>
                  </div>
                </div>)}
            </div>

            <div className="border-t border-border/30 px-6 py-3.5">
              <p className="text-center text-[10px] text-foreground/25">
                {'Secured by Google. '}
                <Link href="/privacy" className="underline hover:text-foreground/40">
                  Privacy Policy
                </Link>
                {' and '}
                <Link href="/terms" className="underline hover:text-foreground/40">
                  Terms
                </Link>
              </p>
            </div>
          </div>
        </div>)}
    </div>);
}
