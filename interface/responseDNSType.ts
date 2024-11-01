type MXRecord = {
  exchange: string
  priority: number
}

type SOARecord = {
  nsname: string
  hostmaster: string
  serial: number
  refresh: number
  retry: number
  expire: number
  minttl: number
}

export type responseDNSType = {
  A?: string[] 
  AAAA?: string | string 
  CNAME?: string | string 
  MX?: MXRecord[] 
  NS?: string[] 
  TXT?: string[][] 
  SRV?: string | string 
  PTR?: string | string
  SOA?: SOARecord 
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any 
  error?: string
}

export interface DNSRecord {
  Tipo: string
  Nome: string
  Valor: string | string[]
  TTL?: string | number
}