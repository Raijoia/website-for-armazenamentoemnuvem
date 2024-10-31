'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CloudIcon, Menu, X } from 'lucide-react'
import type { responseType } from '@/interface/responseType'
import MenuBurguer from '@/components/MenuBurguer'

export default function Component() {
  const [domain, setDomain] = useState('')
  const [searchResult, setSearchResult] = useState<responseType | null>(null)

  const searchDomainInAzure = async (domain: string) => {
    try {
      const response = await fetch(`/api/searchTenantDomain?domain=${domain}`)
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`)
      }
      const result = (await response.json()) as responseType

      setSearchResult(result)
    } catch (error) {
      console.error('Error searching domain:', error)
      setSearchResult({
        error: 'An error occurred while searching the domain.',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchDomainInAzure(domain)
    setDomain('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white relative font-sans">
      <MenuBurguer />
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <CloudIcon className="inline-block w-16 h-16 text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Armazenamento em Nuvem
          </h1>
          <p className="text-xl text-gray-600">Especializados em Modern Work</p>
        </header>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Busque o Tenant do cliente
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="domain"
                    className="text-sm font-medium text-gray-700"
                  >
                    Domínio do cliente:
                  </Label>
                  <Input
                    id="domain"
                    placeholder="dominio.com"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                  Pesquisar tenant
                </Button>
              </div>
            </form>
          </div>
          {searchResult && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Resultado da Pesquisa:
              </h3>
              {searchResult.error ? (
                <p className="text-red-500">Domínio não encontrado</p>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong>Tenant ID:</strong> {searchResult.id || 'N/A'}
                  </p>
                  <p>
                    <strong>Nome da Empresa:</strong>{' '}
                    {searchResult.enterprise || 'N/A'}
                  </p>
                  <p>
                    <strong>Domínio Principal:</strong>{' '}
                    {searchResult.domainName || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
