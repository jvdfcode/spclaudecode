import type { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Criar conta — SmartPreço',
}

export default function CadastroPage() {
  return <SignupForm />
}
