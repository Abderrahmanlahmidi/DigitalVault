import RegisterForm from '@/components/ui/auth/register/RegisterForm';
import RegisterBillboard from '@/components/ui/auth/register/RegisterBillboard';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="flex min-h-[calc(100vh-80px)]">
        <RegisterForm />
        <RegisterBillboard />
      </div>
    </div>
  );
}
