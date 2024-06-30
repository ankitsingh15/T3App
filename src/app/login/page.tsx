import Header from '../_components/Header';
import LoginForm from '../_components/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl mb-4">Login</h2>
        <LoginForm />
      </main>
    </div>
  );
}