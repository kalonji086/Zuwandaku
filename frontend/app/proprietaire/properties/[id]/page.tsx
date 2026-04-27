'use client';

import { useParams } from 'next/navigation';
import ViewPropertyModal from '../../../components/ViewPropertyModal';

export default function PropertyDetail() {
  const params = useParams();
  const propertyId = params.id as string;

  // Mock property for demo
  const property = {
    id: propertyId,
    type: 'MAISON',
    price: 75000,
    status: 'AVAILABLE',
    commune: 'Gombe',
    quartier: { nom: 'Plateau' },
    ville: { nom: 'Kinshasa' },
    description: 'Magnifique maison moderne avec 4 chambres, parking, quartier sécurisé.',
    photos: ['https://placehold.co/800x600?text=Maison+Gombe'],
    contactPhone: '+243 999 123 456',
    contactWhatsapp: '+243 999 123 456',
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button className="mb-8 flex items-center gap-2 text-white/70 hover:text-white">
        ← Retour
      </button>
      <ViewPropertyModal isOpen={true} onClose={() => {}} property={property} />
    </div>
  );
}

