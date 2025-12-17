export function haversineDistance(
    coords1: { lat: number; lng: number } | undefined,
    coords2: { lat: number; lng: number } | undefined
): number | null {
    if (!coords1 || !coords2) return null;

    const R = 6371; // Radius of the Earth in km
    const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coords1.lat * Math.PI) / 180) *
        Math.cos((coords2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

export function formatDistance(distanceKm: number | null): string {
    if (distanceKm === null) return "Lokasi tidak diketahui";

    // Handle very small distances (less than 10 meters)
    if (distanceKm < 0.01) {
        return "< 10 m dari lokasimu";
    }

    if (distanceKm < 1) {
        const meters = Math.round(distanceKm * 1000);
        return `${meters} m dari lokasimu`;
    }

    return `${distanceKm.toFixed(1)} km dari lokasimu`;
}
