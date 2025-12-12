import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import { roomService } from '../services/roomService.js';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchRooms();
    }, [filter]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = filter === 'available'
                ? await roomService.getAvailableRooms()
                : await roomService.getAllRooms();
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Our Rooms
                    </h1>
                    <p className="text-lg text-gray-600">
                        Find the perfect room for your stay
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                            filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        All Rooms
                    </button>
                    <button
                        onClick={() => setFilter('available')}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                            filter === 'available'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Available Only
                    </button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    /* Rooms Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && rooms.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No rooms found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomsPage;
