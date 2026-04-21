import { ML_INSTALLMENT_FEES, getCategoryFee, getFixedCost } from '@/lib/mercadolivre.config'
import type { ViabilityInput, CostBreakdown, MlFeesMap } from '@/types'

export function calculateCostBreakdown(input: ViabilityInput, fees?: MlFeesMap): CostBreakdown {
  const { productCost, shippingCost, packagingCost, taxRate, overheadRate,
          salePrice, listingType, installments, categoryId, commissionOverride } = input

  if (salePrice < 0) throw new Error('salePrice não pode ser negativo')
  if (installments < 1 || installments > 12)
    throw new Error('installments deve estar entre 1 e 12')

  // Resolução de taxa de comissão: override manual > DB > categoria hardcoded > geral hardcoded
  let effectiveCommissionPct: number
  if (commissionOverride !== null && commissionOverride !== undefined) {
    effectiveCommissionPct = commissionOverride
  } else if (fees) {
    effectiveCommissionPct = fees.base[listingType] ?? getCategoryFee(categoryId, listingType)
  } else {
    effectiveCommissionPct = getCategoryFee(categoryId, listingType)
  }

  const commission = salePrice * effectiveCommissionPct / 100

  const installmentTable = fees
    ? (fees.installment[listingType] ?? {})
    : (ML_INSTALLMENT_FEES[listingType] as Record<number, number>)
  const installmentRate = (installmentTable[installments] ?? 0) / 100
  const installmentFee = salePrice * installmentRate

  const tax = salePrice * taxRate
  const overhead = salePrice * overheadRate
  const fixedCost = getFixedCost(salePrice)

  const total =
    productCost + commission + installmentFee +
    shippingCost + packagingCost + tax + overhead + fixedCost

  return {
    acquisition: productCost,
    commission,
    installmentFee,
    shipping: shippingCost,
    packaging: packagingCost,
    tax,
    overhead,
    fixedCost,
    total,
    effectiveCommissionPct,
  }
}
