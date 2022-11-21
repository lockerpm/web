export const generateLettersAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?uppercase=true&background=${
    getColor(name)
  }&color=fff&bold=true&length=${2}&size=256&name=${name}`
}

const getColor = string => {
  let hash = 0
  if (string.length === 0) return hash
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  hash = ((hash % ACCOUNT_COLORS.length) + ACCOUNT_COLORS.length) % ACCOUNT_COLORS.length
  return ACCOUNT_COLORS[hash]
}

const ACCOUNT_COLORS = [
  '4C3A51',
  '395B64',
  '3F4E4F',
  'A27B5C',
  'B25068',
  '4C3575',
  'F73D93',
  '2DB1AA',
  '2D4263',
  '301B3F',
  'C060A1',
  '595B83',
  '59405C',
  '3A9188',
  '4C3A51',
  '395B64',
  '3F4E4F',
  '2DB1AA',
  'A27B5C',
  '4C3575',
  'F73D93',
  '2D4263',
  '2DB1AA',
  '301B3F',
  '59405C',
  '3A9188',
  '4C3A51',
  '395B64',
  '3F4E4F',
  '2DB1AA',
  'A27B5C',
  '4C3575',
  'F73D93',
  '2D4263',
  '301B3F'
]
