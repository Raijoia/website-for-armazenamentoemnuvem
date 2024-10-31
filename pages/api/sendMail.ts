import type { responseMailType } from '@/interface/responseMailType'
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { nome, email, mensagem } = req.body

    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'rai@tudoemnuvem.com.br',
        subject: `'${nome}, '${email}''`,
        text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`,
        html: `<p><strong>Nome:</strong> ${nome}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Mensagem:</strong> ${mensagem}</p>`,
      })

      console.log('Message sent: %s', info.messageId)
      res.status(200).json({ sucesso: 'Email enviado com sucesso!' })
    } catch (error) {
      console.error('Error sending email:', error)
      res.status(500).json({ erro: 'Erro ao enviar email' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
