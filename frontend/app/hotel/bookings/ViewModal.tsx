"use client";

import { useState } from 'react';
import ViewBookingModal from '../components/ViewBookingModal';
import type { Booking } from '../../../lib/hooks/useReservations';

interface Props {
  booking: Booking;
}

export default function ViewModal({ booking }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 p-2 rounded-lg hover:bg-blue-50"
        onClick={() => setIsOpen(true)}
      >
        Voir
      </button>
      <ViewBookingModal 
        isOpen={isOpen}
        booking={booking}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

