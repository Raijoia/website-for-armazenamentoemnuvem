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