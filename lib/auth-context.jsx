'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from 'react';
import { apiRequest } from '@/lib/api';
const TOKEN_KEY = 'jerseyculture-auth-token';
const USER_KEY = 'jerseyculture-auth-user';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            }
            catch {
                localStorage.removeItem(USER_KEY);
            }
        }
    }, []);
    const persistSession = useCallback((payload) => {
        const authUser = {
            _id: payload._id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            phone: payload.phone || '',
            address: payload.address || {},
        };
        setUser(authUser);
        setToken(payload.token);
        localStorage.setItem(TOKEN_KEY, payload.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    }, []);
    const login = useCallback(async (email, password) => {
        try {
            const payload = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            persistSession(payload);
            return { ok: true, user: payload };
        }
        catch (error) {
            return {
                ok: false,
                message: error instanceof Error ? error.message : 'Login failed',
            };
        }
    }, [persistSession]);
    const registerRequestOtp = useCallback(async (name, email, password) => {
        try {
            const payload = await apiRequest('/auth/register/request-otp', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });
            return { ok: true, message: payload?.message || 'OTP sent to your email.' };
        }
        catch (error) {
            return {
                ok: false,
                message: error instanceof Error ? error.message : 'Failed to send OTP',
            };
        }
    }, []);
    const registerVerifyOtp = useCallback(async (email, otp) => {
        try {
            const payload = await apiRequest('/auth/register/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ email, otp }),
            });
            persistSession(payload);
            return { ok: true, user: payload };
        }
        catch (error) {
            return {
                ok: false,
                message: error instanceof Error ? error.message : 'OTP verification failed',
            };
        }
    }, [persistSession]);
    const register = useCallback(async (name, email, password) => {
        return registerRequestOtp(name, email, password);
    }, [registerRequestOtp]);
    const updateProfile = useCallback(async (profileInput) => {
        try {
            const payload = await apiRequest('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileInput),
            }, token || undefined);
            const updatedUser = {
                _id: payload._id,
                name: payload.name,
                email: payload.email,
                role: payload.role,
                phone: payload.phone || '',
                address: payload.address || {},
            };
            setUser(updatedUser);
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
            return { ok: true };
        }
        catch (error) {
            return {
                ok: false,
                message: error instanceof Error ? error.message : 'Failed to update profile',
            };
        }
    }, [token]);
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }, []);
    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        registerRequestOtp,
        registerVerifyOtp,
        updateProfile,
        logout,
    }), [user, token, login, register, registerRequestOtp, registerVerifyOtp, updateProfile, logout]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
