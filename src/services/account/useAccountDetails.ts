import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import Api from 'shared/api'
import { NetworkErrorObject } from 'shared/api/helpers'

const InvoiceSchema = z
  .object({
    amountDue: z.number().nullable(),
    amountPaid: z.number().nullable(),
    amountRemaining: z.number().nullable(),
    currency: z.string().nullable(),
    customerAddress: z.string().nullish(),
    customerEmail: z.any(),
    customerName: z.string().nullable(),
    customerShipping: z.any(),
    created: z.number(),
    dueDate: z.number().nullish(),
    footer: z.any(),
    id: z.string().nullable(),
    invoicePdf: z.string().nullable(),
    lineItems: z
      .array(
        z.object({
          amount: z.number().nullable(),
          currency: z.string().nullable(),
          description: z.string().nullable(),
          period: z
            .object({
              end: z.number(),
              start: z.number(),
            })
            .nullish(),
          planName: z.string().nullable(),
          quantity: z.number().nullable(),
        })
      )
      .nullable(),
    number: z.string().nullable(),
    periodEnd: z.number().nullable(),
    periodStart: z.number().nullable(),
    status: z.string().nullable(),
    subtotal: z.number().nullable(),
    total: z.number(),
  })
  .nullable()

export const AddressSchema = z
  .object({
    city: z.string().nullable(),
    country: z.string().nullable(),
    line1: z.string().nullable(),
    line2: z.string().nullable(),
    postalCode: z.string().nullable(),
    state: z.string().nullable(),
  })
  .nullable()

export const BillingDetailsSchema = z
  .object({
    address: AddressSchema.nullable(),
    email: z.string().nullable(),
    name: z.string().nullable(),
    phone: z.string().nullable(),
  })
  .nullable()

export const PaymentMethodSchema = z
  .object({
    card: z
      .object({
        brand: z.string(),
        expMonth: z.number(),
        expYear: z.number(),
        last4: z.string(),
      })
      .nullish(),
    billingDetails: BillingDetailsSchema.nullable(),
  })
  .nullable()

export const SubscriptionDetailSchema = z
  .object({
    cancelAtPeriodEnd: z.boolean(),
    collectionMethod: z.string().nullish(),
    currentPeriodEnd: z.number(),
    customer: z
      .object({
        id: z.string(),
        discount: z
          .object({
            name: z.string().nullable(),
            percentOff: z.number().nullable(),
            durationInMonths: z.number().nullable(),
            expires: z.number().nullable(),
          })
          .nullish(),
        email: z.string(),
      })
      .nullable(),
    defaultPaymentMethod: PaymentMethodSchema.nullable(),
    latestInvoice: InvoiceSchema,
    taxIds: z.array(
      z
        .object({
          type: z.string(),
          value: z.string(),
        })
        .nullish()
    ),
    trialEnd: z.number().nullable(),
  })
  .nullable()

export const PlanSchema = z
  .object({
    baseUnitPrice: z.number(),
    benefits: z.array(z.string()),
    billingRate: z.string().nullable(),
    marketingName: z.string(),
    monthlyUploadLimit: z.number().nullish(),
    quantity: z.number().nullish(),
    value: z.string(),
    trialDays: z.number().nullish(),
  })
  .nullable()

export const AccountDetailsSchema = z.object({
  activatedStudentCount: z.number(),
  activatedUserCount: z.number(),
  checkoutSessionId: z.string().nullable(),
  delinquent: z.boolean().nullable(),
  email: z.string().nullable(),
  inactiveUserCount: z.number(),
  integrationId: z.number().nullable(),
  name: z.string().nullable(),
  nbActivePrivateRepos: z.number().nullable(),
  plan: PlanSchema,
  planAutoActivate: z.boolean().nullable(),
  planProvider: z.string().nullable(),
  repoTotalCredits: z.number(),
  rootOrganization: z
    .object({
      plan: PlanSchema,
    })
    .nullable(),
  scheduleDetail: z
    .object({
      scheduledPhase: z.object({
        quantity: z.number(),
        plan: z.string(),
        startDate: z.number(),
      }),
    })
    .nullable(),
  studentCount: z.number(),
  subscriptionDetail: SubscriptionDetailSchema,
  usesInvoice: z.boolean(),
})

export interface UseAccountDetailsArgs {
  provider: string
  owner: string
  opts?: {
    enabled?: boolean
  }
}

function getPathAccountDetails({
  provider,
  owner,
}: {
  provider: string
  owner: string
}) {
  return `/${provider}/${owner}/account-details/`
}

function fetchAccountDetails({
  provider,
  owner,
  signal,
}: {
  provider: string
  owner: string
  signal?: AbortSignal
}) {
  const path = getPathAccountDetails({ provider, owner })
  return Api.get({ path, provider, signal })
}

export function useAccountDetails({
  provider,
  owner,
  opts = {},
}: UseAccountDetailsArgs) {
  return useQuery({
    queryKey: ['accountDetails', provider, owner],
    queryFn: ({ signal }) =>
      fetchAccountDetails({ provider, owner, signal }).then((res) => {
        // TODO: remove this bandage once we convert remaining useAccountDetails components to TS
        // including tests.
        if (process.env.REACT_APP_ZOD_IGNORE_TESTS === 'true') {
          return res as z.infer<typeof AccountDetailsSchema>
        }

        const parsedRes = AccountDetailsSchema.safeParse(res)

        if (!parsedRes.success) {
          return Promise.reject({
            status: 404,
            data: {},
            dev: 'useAccountDetails - 404 failed to parse',
          } satisfies NetworkErrorObject)
        }

        return parsedRes.data
      }),
    ...opts,
  })
}
