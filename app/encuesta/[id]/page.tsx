export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getSurveyForm } from '@/app/actions/forms'
import SurveyForm from '@/components/survey-form'

type SurveyPageProps = {
  params: Promise<{ id: string }>
}

export default async function SurveyPage(props: SurveyPageProps) {
  const params = await props.params
  const form = await getSurveyForm(params.id)
  if (form === null) {
    notFound()
  }
  return <SurveyForm form={form} />
}
