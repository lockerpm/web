import creditCardType from "credit-card-type"

export function detectCardBrand(cardNumber) {
  const card = creditCardType(cardNumber);
  return card[0]?.niceType || null
}