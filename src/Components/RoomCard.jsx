import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={room.imageUrl || '/placeholder-room.jpg'}
                    alt={room.roomType}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                {!room.available && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Booked
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {room.roomType}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {room.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-sm text-gray-500">Price per night</span>
                        <p className="text-2xl font-bold text-blue-600">
                            ₹{room.price}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-gray-500">Capacity</span>
                        <p className="text-lg font-semibold text-gray-700">
                            {room.capacity} Guests
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    {room.amenities?.map((amenity, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
              {amenity}
            </span>
                    ))}
                </div>

                <Link
                    to={`/room/${room.id}`}
                    className={`w-full block text-center py-3 rounded-lg font-semibold transition-colors ${
                        room.available
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {room.available ? 'Book Now' : 'Not Available'}
                </Link>
            </div>
        </div>
    );
};

export default RoomCard;
