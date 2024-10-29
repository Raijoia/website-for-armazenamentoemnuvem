import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'node:process'

export type whoisType = {
  WhoisRecord: {
    domainName: string
    parseCode: number
    audit: {
      createdDate: string
      updatedDate: string
    }
    registrarName: string
    registrarIANAID: string
    registryData: {
      createdDate: string
      updatedDate: string
      expiresDate: string
      registrant: {
        organization: string
        state: string
        country: string
        countryCode: string
        rawText: string
      }
      administrativeContact: Record<string, unknown>
      billingContact: {
        country: string
        countryCode: string
        rawText: string
      }
      technicalContact: Record<string, unknown>
      domainName: string
      nameServers: {
        rawText: string
        hostNames: string[]
      }
      status: string
      rawText: string
      parseCode: number
      header: string
      strippedText: string
      footer: string
      audit: Record<string, unknown>
      registrarName: string
      registrarIANAID: number
      createdDateNormalized: string
      updatedDateNormalized: string
      expiresDateNormalized: string
      whoisServer: string
    }
    contactEmail: string
    domainNameExt: string
    estimatedDomainAge: number
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<whoisType | { error: string }>
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
): Promise<whoisType | void> {
  const { domain } = req.query
  let responseFull: whoisType

  if (typeof domain !== 'string') {
    return res.status(400).json({ error: 'Domain must be a string' })
  }

  const options = {
    method: 'POST',
    url: 'https://www.whoisxmlapi.com/whoisserver/WhoisService?outputFormat=JSON',
    headers: { 'Content-Type': 'application/json' },
    data: {
      domainName: `${domain}`,
      apiKey: env.apiKey?.toString(),
    },
  }

  try {
    const response = await axios.request(options)
    const responseData: whoisType = response.data
    console.log(responseData)
    return res.status(200).json(responseData)
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    return res.status(500).json({ error: error })
  }
}
