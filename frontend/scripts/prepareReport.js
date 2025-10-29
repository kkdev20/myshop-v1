const fs = require('fs')
const path = require('path')

function usage() {
  console.error('Usage: node prepareReport.js <reportName>')
  process.exit(1)
}

const reportName = process.argv[2]
if (!reportName) usage()

const cwd = process.cwd()
const reportDir = path.join(cwd, 'cypress', 'reports', reportName)

try {
  // ensure directory exists
  fs.mkdirSync(reportDir, { recursive: true })

  // remove any top-level files (json/html) but keep the assets folder
  const items = fs.readdirSync(reportDir)
  for (const item of items) {
    if (item === 'assets') continue
    const p = path.join(reportDir, item)
    try {
      const stat = fs.lstatSync(p)
      if (stat.isDirectory()) {
        // remove directory recursively
        fs.rmSync(p, { recursive: true, force: true })
      } else {
        // remove file
        fs.unlinkSync(p)
      }
    } catch (err) {
      // ignore individual deletion errors
    }
  }

  console.log('Prepared report directory:', reportDir)
} catch (err) {
  console.error('Failed to prepare report directory', err)
  process.exit(2)
}
