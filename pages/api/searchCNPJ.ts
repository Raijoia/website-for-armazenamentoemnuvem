import type { EmpresaType } from '@/interface/responseCNPJType'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmpresaType | { error: string }>
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
): Promise<EmpresaType | void> {
  const { cnpj } = req.query

  const options = {
    method: 'GET',
    url: `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    const response = await axios.request(options)
    return res.status(200).json(response.data)

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    return res.status(500).json({ error: 'An internal error occurred.' })
  }
}
