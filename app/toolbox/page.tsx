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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GlobeIcon, SearchIcon, FilterIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import MenuBurguer from '@/components/MenuBurguer'

interface DNSRecord {
  Tipo: string
  Nome: string
  Valor: string | string[]
  TTL?: string | number
}

const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SRV', 'PTR', 'SOA']

export default function ConsultaDNS() {
  const [dominio, setDominio] = useState('')
  const [registros, setRegistros] = useState<DNSRecord[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [tiposSelecionados, setTiposSelecionados] =
    useState<string[]>(DNS_TYPES)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const formatarValorRegistro = (tipo: string, valor: any): string => {
    switch (tipo) {
      case 'MX':
        try {
          if (typeof valor === 'object') {
            return `${valor.exchange} (prioridade: ${valor.priority})`
          }
          const mxData = JSON.parse(valor.replace(/'/g, '"'))
          return `${mxData.exchange} (prioridade: ${mxData.priority})`
        } catch {
          return valor
        }
      case 'TXT':
        try {
          if (Array.isArray(valor)) {
            return valor.join('')
          }
          return valor.replace(/^\["|"\]$/g, '').replace(/\\"/g, '"')
        } catch {
          return valor
        }
      default:
        return valor
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const formatarRegistros = (data: any): DNSRecord[] => {
    const registrosFormatados: DNSRecord[] = []

    if (typeof data !== 'object' || data === null) {
      throw new Error('Dados de DNS inválidos recebidos da API')
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(data).forEach(([tipo, valores]) => {
      if (!tiposSelecionados.includes(tipo)) return

      if (Array.isArray(valores)) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        // biome-ignore lint/complexity/noForEach: <explanation>
        valores.forEach((valor: any) => {
          registrosFormatados.push({
            Tipo: tipo,
            Nome: dominio,
            Valor: formatarValorRegistro(tipo, valor),
          })
        })
      } else if (typeof valores === 'object' && valores !== null) {
        if (tipo === 'SOA') {
          // biome-ignore lint/complexity/noForEach: <explanation>
          Object.entries(valores).forEach(([chave, valor]) => {
            registrosFormatados.push({
              Tipo: tipo,
              Nome: chave,
              Valor: valor as string,
            })
          })
        } else {
          registrosFormatados.push({
            Tipo: tipo,
            Nome: dominio,
            Valor: formatarValorRegistro(tipo, valores),
          })
        }
      } else {
        registrosFormatados.push({
          Tipo: tipo,
          Nome: dominio,
          Valor: formatarValorRegistro(tipo, valores),
        })
      }
    })

    return registrosFormatados
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    setRegistros([])

    try {
      const response = await fetch(
        `/api/searchDNS?domain=${encodeURIComponent(dominio)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar registros DNS')
      }

      const registrosFormatados = formatarRegistros(data)
      setRegistros(registrosFormatados)
    } catch (err) {
      console.error('Erro ao buscar registros DNS:', err)
      setErro(
        'Ocorreu um erro ao buscar os registros DNS. Por favor, tente novamente.'
      )
      setRegistros([])
    } finally {
      setCarregando(false)
    }
  }

  const toggleTipo = (tipo: string) => {
    setTiposSelecionados(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6 relative font-sans">
      <MenuBurguer />
      <div className="max-w-4xl mx-auto container px-4 py-16">
        <header className="text-center mb-12">
          <GlobeIcon className="inline-block w-16 h-16 text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Consulta de Registros DNS
          </h1>
          <p className="text-xl text-gray-600">
            Visualize todos os registros DNS de um domínio
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Consultar Registros DNS</CardTitle>
            <CardDescription>
              Digite um domínio para ver seus registros DNS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-grow">
                  <Label htmlFor="dominio" className="sr-only">
                    Domínio
                  </Label>
                  <Input
                    id="dominio"
                    placeholder="Digite um domínio (ex: exemplo.com.br)"
                    value={dominio}
                    onChange={e => setDominio(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={carregando}>
                  {carregando ? 'Buscando...' : 'Buscar'}
                  <SearchIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="w-full justify-between"
              >
                Filtrar por tipo de registro DNS
                <FilterIcon className="w-4 h-4 ml-2" />
              </Button>
              {mostrarFiltros && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md shadow-inner">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {DNS_TYPES.map(tipo => (
                      <div key={tipo} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tipo-${tipo}`}
                          checked={tiposSelecionados.includes(tipo)}
                          onCheckedChange={() => toggleTipo(tipo)}
                        />
                        <Label
                          htmlFor={`tipo-${tipo}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {tipo}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {erro && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {erro}
              </div>
            )}

            {registros.length > 0 ? (
              <div className="mt-6 overflow-x-auto">
                <h3 className="text-lg font-semibold mb-2">
                  Registros DNS para {dominio}:
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>TTL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registros
                      .filter(registro =>
                        tiposSelecionados.includes(registro.Tipo)
                      )
                      .map((registro, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {registro.Tipo}
                          </TableCell>
                          <TableCell>{registro.Nome}</TableCell>
                          <TableCell className="max-w-md break-all">
                            {registro.Valor}
                          </TableCell>
                          <TableCell>{registro.TTL || ''}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              !carregando &&
              !erro && (
                <p className="mt-4 text-gray-600">
                  Nenhum registro DNS encontrado.
                </p>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
