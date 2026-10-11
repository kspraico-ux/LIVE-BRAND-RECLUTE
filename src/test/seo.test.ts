import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function readIndexHtml(): string {
  return readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8')
}

describe('SEO: index.html', () => {
  it('incluye JSON-LD del tipo Organization', () => {
    const html = readIndexHtml()
    expect(html).toMatch(/"@type":\s*"Organization"/)
  })

  it('usa URLs absolutas en canonical y og:image', () => {
    const html = readIndexHtml()
    expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+"/)
    expect(html).toMatch(/property="og:image" content="https?:\/\/[^"]+"/)
    expect(html).not.toMatch(/fonts\.googleapis\.com/)
  })
})
