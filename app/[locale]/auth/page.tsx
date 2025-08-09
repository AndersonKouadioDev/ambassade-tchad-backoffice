import { redirect } from 'next/navigation'
const page = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;

  const {
    locale
  } = params;

  redirect(`/${locale}/auth/login`)
  return null
}

export default page