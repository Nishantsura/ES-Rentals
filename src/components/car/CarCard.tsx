'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaWhatsapp } from "react-icons/fa";
import { Car } from '@/types/car';

interface CarCardProps {
  car: Car;
  onClick?: () => void;
  className?: string;
  linkHref?: string;
}

export function CarCard({ car, onClick, className = '', linkHref }: CarCardProps) {
  const href = linkHref || `/car/${car.id}`;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hello, I'm interested in renting the ${car.name} (${car.brand}) for AED ${car.dailyPrice} per day. Please provide more information.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const cardContent = (
    <CardContent className="p-0">
      <div className="aspect-[16/9] relative">
        <Image
          src={car.images[0]}
          alt={car.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="subtitle-1 mb-1">{car.name}</h3>
        <div className="flex flex-wrap items-center gap-2 body-2 text-muted-foreground mb-2">
          <span>{car.year}</span>
          <span>•</span>
          <span>{car.transmission}</span>
          <span>•</span>
          <span>{car.fuelType}</span>
          <span>•</span>
          <span>250kms/day</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="body-2">
            <span className="subtitle-1">AED {car.dailyPrice?.toLocaleString()}</span>
            <span className="text-muted-foreground"> / day</span>
          </div>
          <Button 
            className='rounded-full bg-green-500 hover:bg-green-700 text-white' 
            size="sm"
            onClick={handleWhatsAppClick}
          >
            <FaWhatsapp />
          </Button>
        </div>
      </div>
    </CardContent>
  );

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full ${className}`}>
      {onClick ? (
        <Link href={href} onClick={onClick}>
          {cardContent}
        </Link>
      ) : (
        <Link href={href}>
          {cardContent}
        </Link>
      )}
    </Card>
  );
}
