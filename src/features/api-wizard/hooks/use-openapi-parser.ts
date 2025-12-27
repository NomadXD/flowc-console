import { useState } from 'react'
import { parseOpenApiFile, type ParsedOpenApi } from '../lib/openapi-parser'

export function useOpenApiParser() {
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  const parseFile = async (file: File): Promise<ParsedOpenApi | null> => {
    setIsParsing(true)
    setParseError(null)

    try {
      const result = await parseOpenApiFile(file)

      if (!result) {
        setParseError('Failed to parse OpenAPI specification')
        return null
      }

      return result
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown parsing error'
      setParseError(message)
      return null
    } finally {
      setIsParsing(false)
    }
  }

  return { parseFile, isParsing, parseError }
}
