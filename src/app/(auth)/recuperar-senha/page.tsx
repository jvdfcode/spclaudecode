import type { Metadata } from 'next'
import RecoverForm from '@/components/auth/RecoverForm'

export const metadata: Metadata = { title: 'Recuperar senha — SmartPreço' }

export default function RecuperarSenhaPage() {
  return <RecoverForm />
}
