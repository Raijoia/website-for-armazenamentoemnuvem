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
import { GlobeIcon, SearchIcon } from 'lucide-react'
import type { DNSRecord, responseDNSType } from '@/interface/responseDNSType'
import MenuBurguer from '@/components/MenuBurguer'

const buscarRegistrosDNS = async (
  domain: string
): Promise<responseDNSType | null> => {
  const response = await fetch(`/api/searchDNS?domain=${domain}`)
  const responseData = await response.json()

  return responseData
}

export default function ConsultaDNS() {
  const [dominio, setDominio] = useState('')
  const [registros, setRegistros] = useState<responseDNSType | null>()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const formatarRegistros = (data: any): DNSRecord[] => {
    const registrosFormatados: DNSRecord[] = []

    try {
      if (data.A && Array.isArray(data.A)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        data.A.forEach((valor: string) => {
          registrosFormatados.push({
            Tipo: 'A',
            Nome: dominio,
            Valor: valor,
          })
        })
      }

      registrosFormatados.push({
        Tipo: 'AAAA',
        Nome: dominio,
        Valor: data.AAAA || 'No AAAA records found or an error occurred.',
      })

      registrosFormatados.push({
        Tipo: 'CNAME',
        Nome: dominio,
        Valor: data.CNAME || 'No CNAME records found or an error occurred.',
      })

      if (data.MX && Array.isArray(data.MX)) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        // biome-ignore lint/complexity/noForEach: <explanation>
        data.MX.forEach((mx: any) => {
          registrosFormatados.push({
            Tipo: 'MX',
            Nome: dominio,
            Valor: `valor: ${mx.exchange} | prioridade: ${mx.priority}`,
          })
        })
      }

      if (data.NS && Array.isArray(data.NS)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        data.NS.forEach((ns: string) => {
          registrosFormatados.push({
            Tipo: 'NS',
            Nome: dominio,
            Valor: ns,
          })
        })
      }

      if (data.TXT && Array.isArray(data.TXT)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        data.TXT.forEach((txt: string[]) => {
          registrosFormatados.push({
            Tipo: 'TXT',
            Nome: dominio,
            Valor: txt.join(''),
          })
        })
      }

      registrosFormatados.push({
        Tipo: 'SRV',
        Nome: dominio,
        Valor: data.SRV || 'No SRV records found or an error occurred.',
      })

      registrosFormatados.push({
        Tipo: 'PTR',
        Nome: dominio,
        Valor: data.PTR || 'No PTR records found or an error occurred.',
      })

      if (data.SOA) {
        const soa = data.SOA
        registrosFormatados.push(
          {
            Tipo: 'SOA',
            Nome: 'nsname',
            Valor: soa.nsname,
          },
          {
            Tipo: 'SOA',
            Nome: 'hostmaster',
            Valor: soa.hostmaster,
          },
          {
            Tipo: 'SOA',
            Nome: 'serial',
            Valor: soa.serial.toString(),
          },
          {
            Tipo: 'SOA',
            Nome: 'refresh',
            Valor: soa.refresh.toString(),
          },
          {
            Tipo: 'SOA',
            Nome: 'retry',
            Valor: soa.retry.toString(),
          }
        )
      }
    } catch (error) {
      console.log(error)
    }

    return registrosFormatados
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    setRegistros([])

    try {
      const resultado = await buscarRegistrosDNS(dominio)
      const registroFormatado = formatarRegistros(resultado)
      setRegistros(registroFormatado)
    } catch (err) {
      setErro(
        'Ocorreu um erro ao buscar os registros DNS. Por favor, tente novamente.'
      )
    } finally {
      setCarregando(false)
    }
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

            {erro && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {erro}
              </div>
            )}

            {registros && (
              <div className="mt-6">
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
                    {registros.map((registro, index) => (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
