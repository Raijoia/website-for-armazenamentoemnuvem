import type { responseType } from '@/interface/responseType';
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType | { error: string }>
// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
): Promise<responseType | void> {
  const { domain } = req.query
  let responseFull: responseType;

  if (typeof domain !== 'string') {
    return res.status(400).json({ error: 'Domain must be a string' })
  }

  let options = {
    method: 'GET',
    url: `https://login.microsoftonline.com/${domain}/.well-known/openid-configuration`,
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    const response = await axios.request(options)
    const regex =
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    const tenantId = response.data.token_endpoint.match(regex)?.[0]

    if (tenantId) {
      console.log(`Tenant com dominio ${domain} existente`)

      options = {
        method: 'GET',
        url: `https://azure-ad-tools.ai.moda/api/v1.0.0/lookup-by-tenant-id/${tenantId}`,
        headers: { 'Content-Type': 'application/json' },
      }

      axios.request(options).then(response => {
        responseFull = {
          id: response.data.tenantId,
          domainName: response.data.defaultDomainName,
          enterprise: response.data.displayName,
        }
        console.log(responseFull)
        return res.status(200).json(responseFull)
      })
    }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    const regex = /Tenant '([^']+)' not found/
    const domainNotFound =
      error.response?.data?.error_description.match(regex)?.[1]

    if (domainNotFound) {
      console.log('Tenant não encontrado no dominio', domainNotFound)
      return res
        .status(404)
        .json({ error: `Tenant não encontrado no domínio: ${domainNotFound}` })
    }
      console.error('An error occurred:', error)
      return res.status(500).json({ error: 'An internal error occurred.' })
  }
}
