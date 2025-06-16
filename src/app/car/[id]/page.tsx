import CarDetails from './carDetails'

type Props = {
  params: Promise<{ id: string }>
}

export default async function CarDetailsPage({ params }: Props) {
  return <CarDetails id={(await params).id} />
}
