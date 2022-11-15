export default function ({ error }) {
  const isDevOrStaging = process.env.environment === 'staging' || process.env.NODE_ENV !== 'production'
  if (!isDevOrStaging) {
    return error({ statusCode: 404 })
  }
}
