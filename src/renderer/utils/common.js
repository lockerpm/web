import creditCardType from "credit-card-type"

export function detectCardBrand(cardNumber) {
  if (!cardNumber) {
    return null
  }
  const card = creditCardType(cardNumber);
  return card[0]?.niceType || null
}