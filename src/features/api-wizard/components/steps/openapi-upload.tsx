import { CheckCircle2 } from 'lucide-react'
import { useApiWizard } from '../../context/wizard-context'
import { useOpenApiParser } from '../../hooks/use-openapi-parser'
import {
  extractUpstreamFromServers,
  sanitizeApiName,
  sanitizeContextPath,
} from '../../lib/openapi-parser'
import { FileUploadZone } from '../file-upload-zone'
import { Card } from '@/components/ui/card'

export function OpenApiUploadStep() {
  const { form } = useApiWizard()
  const { parseFile, isParsing, parseError } = useOpenApiParser()
  const openApiFile = form.watch('openApiFile')

  const handleFileSelect = async (file: File) => {
    const parsed = await parseFile(file)

    if (parsed) {
      // Store file info and parsed data
      form.setValue('openApiFile', {
        fileName: file.name,
        fileContent: parsed.rawSpec,
        parsedSpec: {
          title: parsed.title,
          version: parsed.version,
          description: parsed.description,
          servers: parsed.servers,
          pathCount: parsed.pathCount,
        },
      })

      // Pre-populate API info from parsed spec
      const currentApiInfo = form.getValues('apiInfo')
      const sanitizedName = sanitizeApiName(parsed.title)

      form.setValue('apiInfo', {
        name: currentApiInfo.name || sanitizedName,
        displayName: currentApiInfo.displayName || parsed.title,
        version: parsed.version || currentApiInfo.version,
        context: currentApiInfo.context || sanitizeContextPath(sanitizedName),
        description: parsed.description || currentApiInfo.description,
      })

      // Pre-populate upstream from servers if available
      const upstream = extractUpstreamFromServers(parsed.servers)
      if (upstream) {
        const currentUpstream = form.getValues('upstream')
        form.setValue('upstream', {
          ...currentUpstream,
          host: upstream.host,
          port: upstream.port,
          scheme: upstream.scheme,
        })
      }
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          Upload OpenAPI Specification
        </h2>
        <p className='text-muted-foreground mt-2'>
          Upload your OpenAPI/Swagger specification file to get started
        </p>
      </div>

      <FileUploadZone
        onFileSelect={handleFileSelect}
        isLoading={isParsing}
        error={parseError}
        uploadedFileName={openApiFile?.fileName}
      />

      {openApiFile?.parsedSpec && (
        <Card className='p-4 bg-muted/50'>
          <div className='flex items-start gap-3'>
            <div className='rounded-full bg-green-100 dark:bg-green-950 p-2'>
              <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400' />
            </div>
            <div className='flex-1 space-y-3'>
              <div>
                <h3 className='font-semibold'>
                  Specification Parsed Successfully
                </h3>
                <p className='text-sm text-muted-foreground'>
                  We've extracted the following information from your spec
                </p>
              </div>

              <div className='grid gap-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>API Title:</span>
                  <span className='font-medium'>
                    {openApiFile.parsedSpec.title}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Version:</span>
                  <span className='font-medium'>
                    {openApiFile.parsedSpec.version}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Paths:</span>
                  <span className='font-medium'>
                    {openApiFile.parsedSpec.pathCount}
                  </span>
                </div>
                {openApiFile.parsedSpec.servers &&
                  openApiFile.parsedSpec.servers.length > 0 && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Backend Server:
                      </span>
                      <span className='font-medium text-xs'>
                        {openApiFile.parsedSpec.servers[0].url}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
