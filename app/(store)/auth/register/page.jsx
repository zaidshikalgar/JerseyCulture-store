import { AuthForm } from '@/components/auth/auth-form';
export const metadata = {
    title: 'Create Account | JerseyCulture',
};
export default function RegisterPage() {
    return <AuthForm mode="register"/>;
}
