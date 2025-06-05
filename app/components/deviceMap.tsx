export function DeviceMapIframe({ lat, lng }: { lat: number; lng: number }) {
    const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  
    return (
      <iframe
      className="w-full h-full border-0"
        src={mapSrc}
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Device Location"
      />
    );
  }