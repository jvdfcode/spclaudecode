'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deleteSkuAction, updateSkuAction } from '@/app/(app)/skus/actions'

interface Props {
  id: string
  name: string
  notes: string | null | undefined
  redirectOnDelete?: string
}

export default function SkuCardMenu({ id, name, notes, redirectOnDelete }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialog, setDialog] = useState<'delete' | 'edit' | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Edit state
  const [editName, setEditName] = useState(name)
  const [editNotes, setEditNotes] = useState(notes ?? '')
  const [saving, setSaving] = useState(false)

  function openMenu(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(v => !v)
  }

  function openDialog(type: 'delete' | 'edit') {
    setMenuOpen(false)
    if (type === 'edit') {
      setEditName(name)
      setEditNotes(notes ?? '')
    }
    setDialog(type)
  }

  async function handleDelete() {
    setSaving(true)
    const res = await deleteSkuAction(id)
    if (res.ok) {
      toast.success(`SKU "${name}" excluído.`)
      if (redirectOnDelete) {
        router.push(redirectOnDelete)
      } else {
        router.refresh()
      }
    } else {
      toast.error(res.error ?? 'Erro ao excluir SKU.')
    }
    setSaving(false)
    setDialog(null)
  }

  async function handleEdit() {
    if (!editName.trim()) return
    setSaving(true)
    const res = await updateSkuAction(id, {
      name: editName,
      notes: editNotes || null,
    })
    if (res.ok) {
      toast.success('SKU atualizado.')
      router.refresh()
    } else {
      toast.error(res.error ?? 'Erro ao atualizar SKU.')
    }
    setSaving(false)
    setDialog(null)
  }

  return (
    <>
      {/* Botão "..." */}
      <div className="relative">
        <button
          onClick={openMenu}
          aria-label="Opções do SKU"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-lg leading-none"
        >
          ···
        </button>

        {menuOpen && (
          <>
            {/* overlay para fechar */}
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div
              ref={menuRef}
              role="menu"
              aria-label="Opções do SKU"
              className="absolute right-0 top-9 z-20 min-w-[140px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
            >
              <button
                role="menuitem"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDialog('edit') }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Editar
              </button>
              <button
                role="menuitem"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDialog('delete') }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Excluir
              </button>
            </div>
          </>
        )}
      </div>

      {/* Dialog — Excluir */}
      <Dialog open={dialog === 'delete'} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Excluir SKU?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">&ldquo;{name}&rdquo;</span> e todos os seus cálculos
            serão removidos permanentemente.
          </p>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setDialog(null)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Excluindo...' : 'Excluir'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog — Editar */}
      <Dialog open={dialog === 'edit'} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Editar SKU</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sku-name">Nome</Label>
              <Input
                id="sku-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nome do produto"
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sku-notes">Notas <span className="text-gray-400">(opcional)</span></Label>
              <Input
                id="sku-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Ex: fornecedor, variação, observações"
                maxLength={300}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setDialog(null)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleEdit}
              disabled={saving || !editName.trim()}
              className="rounded-lg bg-ink-950 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
