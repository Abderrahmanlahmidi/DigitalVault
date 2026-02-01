import LoginForm from '@/components/ui/auth/login/LoginForm';
import LoginBillboard from '@/components/ui/auth/login/LoginBillboard';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-black text-white font-sans">
      <LoginForm />
      <LoginBillboard />
    </div>
  );
}
