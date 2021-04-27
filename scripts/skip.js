console.log(process.env.CS_ENV)
if (process.env.CS_ENV === 'web') {
  process.exit(0)
} else {
  process.exit(1)
}
