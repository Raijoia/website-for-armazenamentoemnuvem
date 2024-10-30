'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  SearchIcon,
  GlobeIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  X,
  Menu,
} from 'lucide-react'
import type { whoisType } from '@/interface/whoisType'

export default function WhoisLookup() {
  const [domain, setDomain] = useState('')
  const [whoisData, setWhoisData] = useState<whoisType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fetchWhoisData = async (domain: string) => {
    try {
      const response = await fetch(`/api/searchWhois?domain=${domain}`)
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`)
      }
      const result = (await response.json()) as whoisType

      setWhoisData(result)
    } catch (error) {
      console.error('Error searching domain:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    fetchWhoisData(domain)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6 relative font-sans">
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-md text-gray-500 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        aria-expanded={isMenuOpen}
      >
        <span className="sr-only">Toggle menu</span>
        {isMenuOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 mt-16">
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Busque tenant
              </a>
            </li>
            <li>
              <a
                href="/whois"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Whois
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Sobre a empresa
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Contato
              </a>
            </li>
          </ul>
        </nav>
      </div>
      {isMenuOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        // biome-ignore lint/style/useSelfClosingElements: <explanation>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <GlobeIcon className="inline-block w-16 h-16 text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">WHOIS</h1>
          <p className="text-xl text-gray-600">
            Descubra informações sobre o domínio
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Digite o nome do domínio</CardTitle>
            <CardDescription>
              Dê o nome do domínio para podermos buscar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="domain">Domínio</Label>
                <div className="flex">
                  <Input
                    id="domain"
                    placeholder="dominio.com"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    className="flex-grow"
                    required
                  />
                  <Button type="submit" className="ml-2" disabled={isLoading}>
                    {isLoading ? 'Pesquisando...' : 'Pesquisar'}
                    <SearchIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {whoisData && (
              <div className="mt-8 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Informações
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={<GlobeIcon className="w-5 h-5" />}
                    title="Dominio"
                    value={whoisData.WhoisRecord.domainName}
                  />
                  <InfoCard
                    icon={<BuildingIcon className="w-5 h-5" />}
                    title="Registro"
                    value={whoisData.WhoisRecord.registrarName}
                  />
                  <InfoCard
                    icon={<CalendarIcon className="w-5 h-5" />}
                    title="Data de criação"
                    value={new Date(
                      whoisData.WhoisRecord.audit.createdDate
                    ).toLocaleDateString()}
                  />
                  <InfoCard
                    icon={<CalendarIcon className="w-5 h-5" />}
                    title="Data de expiração"
                    value={new Date(
                      whoisData.WhoisRecord.registryData.expiresDate
                    ).toDateString()}
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Servidores da hospedagem
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {whoisData.WhoisRecord.registryData.nameServers.hostNames.map(
                      (ns, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <li key={index} className="text-gray-600">
                          {ns}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Informações de registro
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoCard
                      icon={<UserIcon className="w-5 h-5" />}
                      title="Nome"
                      value={
                        whoisData.WhoisRecord.registryData.billingContact
                          ?.rawText
                      }
                    />
                    <InfoCard
                      icon={<BuildingIcon className="w-5 h-5" />}
                      title="Organização"
                      value={
                        whoisData.WhoisRecord.registryData.billingContact
                          ?.rawText
                      }
                    />
                    <InfoCard
                      icon={<GlobeIcon className="w-5 h-5" />}
                      title="Região"
                      value={
                        whoisData.WhoisRecord.registryData.billingContact
                          ?.country
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  value,
}: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-3 text-gray-500 mb-2">
        {icon}
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-gray-800 font-semibold">{value}</p>
    </div>
  )
}
