import JSZip from 'jszip'

interface ZipContents {
  flowcYaml: string
  openApiSpec?: string // Optional: included if user uploaded spec
  openApiFileName?: string
}

export async function createDeploymentZip(
  contents: ZipContents
): Promise<Blob> {
  const zip = new JSZip()

  // Always include flowc.yaml
  zip.file('flowc.yaml', contents.flowcYaml)

  // Include OpenAPI spec if provided
  if (contents.openApiSpec && contents.openApiFileName) {
    zip.file(contents.openApiFileName, contents.openApiSpec)
  } else if (contents.openApiSpec) {
    // If we have a spec but no filename, default to openapi.yaml
    zip.file('openapi.yaml', contents.openApiSpec)
  }

  return await zip.generateAsync({ type: 'blob' })
}
