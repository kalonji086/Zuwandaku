"use client";

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import CheckInModal from '../components/CheckInModal';
import type { Booking } from '../../../lib/hooks/useReservations';

interface Props {
  booking: Booking;
}

export default function CheckInTrigger({ booking }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckIn = (data: any) => {
    console.log('Check-in data:', { ...data, bookingId: booking.id });
    alert('Check-in completed for ' + booking.guestName);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="text-green-600 hover:text-green-900 flex items-center gap-1 p-2 rounded-lg hover:bg-green-50"
        onClick={() => setIsOpen(true)}
      >
        <CheckCircle size={16} />
        Check-in
      </button>
      <CheckInModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCheckIn={handleCheckIn}
      />
    </>
  );
}

