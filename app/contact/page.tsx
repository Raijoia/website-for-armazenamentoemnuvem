'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  SendIcon,
  CheckCircleIcon,
} from 'lucide-react'
import MenuBurguer from '@/components/MenuBurguer'
import type { responseMailType } from '@/interface/responseMailType'

const enviarFormularioContato = async (dadosFormulario: {
  nome: string
  email: string
  mensagem: string
}): Promise<responseMailType> => {
  const sendMail = await fetch('/api/sendMail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: dadosFormulario.nome,
      email: dadosFormulario.email,
      mensagem: dadosFormulario.mensagem,
    }),
  })

  const result = (await sendMail.json()) as responseMailType

  return result
}

export default function PaginaContato() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    setSucesso(false)

    try {
      const resultado = await enviarFormularioContato({ nome, email, mensagem })
      if (resultado.sucesso) {
        setSucesso(true)
        setNome('')
        setEmail('')
        setMensagem('')
      }
    } catch (err) {
      setErro('Falha ao enviar mensagem. Por favor, tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6 font-sans">
      <MenuBurguer />
      <div className="max-w-4xl mx-auto container px-4 py-16">
        <header className="text-center mb-12">
          <MailIcon className="inline-block w-16 h-16 text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600">
            Ficaremos felizes em ouvir você
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Envie-nos uma mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contato o mais
                breve possível.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem</Label>
                  <Textarea
                    id="mensagem"
                    placeholder="Sua mensagem"
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={carregando}>
                  {carregando ? 'Enviando...' : 'Enviar Mensagem'}
                  <SendIcon className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {erro && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {erro}
                </div>
              )}

              {sucesso && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Sua mensagem foi enviada com sucesso!
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Você também pode nos contatar usando os seguintes detalhes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-blue-500" />
                <span>(11) 944271234</span>
              </div>
              <div className="flex items-center space-x-3">
                <MailIcon className="w-5 h-5 text-blue-500" />
                <span>falecom@tudoemnuvem.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-blue-500" />
                <span>
                  Rua Dr. clementino, 453 - Belezinho, São Paulo - SP, 03059-030
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Nossa Localização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-16 aspect-h-9">
                {/* biome-ignore lint/a11y/useIframeTitle: <explanation> */}
                {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                <iframe
                  src="//www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.7639696441743!2d-46.59405962578825!3d-23.540990260841976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5ed2fae5085b%3A0xf0c0b6190ad3c625!2sR.%20Dr.%20Clementino%2C%20453%20-%20Belenzinho%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003059-030!5e0!3m2!1spt-BR!2sbr!4v1730393954257!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
