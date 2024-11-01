import type { responseDNSType } from '@/interface/responseDNSType'
import type { NextApiRequest, NextApiResponse } from 'next'
import dns from 'node:dns'

async function getAllDnsRecords(domain: string) {
  try {
    const recordTypes = [
      'A',
      'AAAA',
      'CNAME',
      'MX',
      'NS',
      'TXT',
      'SRV',
      'PTR',
      'SOA',
    ]

    const results: responseDNSType = {}

    for (const type of recordTypes) {
      try {
        const records = await dns.promises.resolve(domain, type)
        results[type] = records
      } catch (error) {
        results[type] = `No ${type} records found or an error occurred.`
      }
    }

    return results
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(`Error fetching DNS records: ${error.message}`)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseDNSType | { error: string }>
): Promise<void> {
  const { domain } = req.query

    if (typeof domain !== 'string') {
      return res.status(400).json({ error: 'Invalid domain provided.' })
    }

  try {
    const records = await getAllDnsRecords(domain as string)
    return res.status(200).json(records)
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    return res.status(500).json({ error: 'An internal error occurred.' })
  }
}
