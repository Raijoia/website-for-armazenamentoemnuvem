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
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  DollarSignIcon,
  X,
  Menu,
} from 'lucide-react'
import type { EmpresaType } from '@/interface/responseCNPJType'

export default function CnpjLookup() {
  const [cnpj, setCnpj] = useState('')
  const [cnpjData, setCnpjData] = useState<EmpresaType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setCnpjData(null)

    try {
      const responseData = await fetch(`/api/searchCNPJ?cnpj=${cnpj}`)
      const result = (await responseData.json()) as EmpresaType

      if(result?.error) {
        setError('Falha ao buscar dados do CNPJ. Por favor, tente novamente.')
      } else {
        setCnpjData(result)
      }
    } catch (err) {
      setError('Falha ao buscar dados do CNPJ. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
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
                href="/busqueCNPJ"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Busque por CNPJ
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
      <div className="max-w-4xl container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <BuildingIcon className="inline-block w-16 h-16 text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Consulta de CNPJ
          </h1>
          <p className="text-xl text-gray-600">
            Descubra informações detalhadas sobre as empresas
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Digite o CNPJ</CardTitle>
            <CardDescription>
              Forneça um CNPJ para consultar as informações da empresa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cnpj">CNPJ</Label>
                <div className="flex">
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={e => setCnpj(e.target.value.replace(/\D/g, ''))}
                    className="flex-grow"
                    maxLength={14}
                    required
                  />
                  <Button type="submit" className="ml-2" disabled={isLoading}>
                    {isLoading ? 'Buscando...' : 'Buscar'}
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

            {cnpjData && (
              <div className="mt-8 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Informações do CNPJ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={<BuildingIcon className="w-5 h-5" />}
                    title="CNPJ"
                    value={cnpjData?.cnpj}
                  />
                  <InfoCard
                    icon={<BuildingIcon className="w-5 h-5" />}
                    title="Razão Social"
                    value={cnpjData?.razao_social}
                  />
                  <InfoCard
                    icon={<BuildingIcon className="w-5 h-5" />}
                    title="Nome Fantasia"
                    value={cnpjData?.nome_fantasia}
                  />
                  <InfoCard
                    icon={<CalendarIcon className="w-5 h-5" />}
                    title="Data de Abertura"
                    value={new Date(
                      cnpjData?.data_inicio_atividade
                    ).toLocaleDateString('pt-BR')}
                  />
                  <InfoCard
                    icon={<BuildingIcon className="w-5 h-5" />}
                    title="Situação Cadastral"
                    value={cnpjData?.descricao_situacao_cadastral}
                  />
                  <InfoCard
                    icon={<DollarSignIcon className="w-5 h-5" />}
                    title="Capital Social"
                    value={cnpjData?.capital_social?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Endereço
                  </h3>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center space-x-3 text-gray-500 mb-2">
                      <MapPinIcon className="w-5 h-5" />
                      <h4 className="font-medium">Localização</h4>
                    </div>
                    <p className="text-gray-800">
                      {cnpjData.logradouro}, {cnpjData.numero}
                      {cnpjData.complemento && `, ${cnpjData.complemento}`}
                      <br />
                      {cnpjData.bairro} - {cnpjData.municipio} - {cnpjData.uf}
                      <br />
                      CEP: {cnpjData.cep}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Contato
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      icon={<PhoneIcon className="w-5 h-5" />}
                      title="Telefone"
                      value={cnpjData.ddd_telefone_1}
                    />
                    <InfoCard
                      icon={<MailIcon className="w-5 h-5" />}
                      title="E-mail"
                      value={cnpjData.email as string}
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