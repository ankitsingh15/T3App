"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      router.push('/categories');
    },
    onError: (error) => {
      setMessage(`Login failed: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
            <label htmlFor="email" className="block">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Login
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default LoginForm;