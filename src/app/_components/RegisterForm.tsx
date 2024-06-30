"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    },
    onError: (error) => {
      setMessage(`Registration failed: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields (name, email, password) here */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Register
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default RegisterForm;