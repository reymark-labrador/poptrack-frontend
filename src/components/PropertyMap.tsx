import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

// Add custom CSS to ensure map doesn't overlap modals
const mapStyles = `
  .leaflet-container {
    z-index: 0 !important;
  }
  .leaflet-pane {
    z-index: 0 !important;
  }
  .leaflet-control {
    z-index: 0 !important;
  }
`

interface PropertyMapProps {
  coordinates: [number, number] // [longitude, latitude]
  title: string
  address?: string
  city: string
  className?: string
}

// Fix for default marker icons in react-leaflet
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
})

const PropertyMap = ({
  coordinates,
  title,
  address,
  city,
  className = "",
}: PropertyMapProps) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height: "400px" }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <>
      <style>{mapStyles}</style>
      <div
        className={`rounded-lg overflow-hidden border relative ${className}`}
        style={{ height: "400px" }}
      >
        <MapContainer
          center={[coordinates[1], coordinates[0]]} // [lat, lng] for Leaflet
          zoom={15}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[coordinates[1], coordinates[0]]} // [lat, lng] for Leaflet
            icon={customIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {address && <p className="text-sm text-gray-600">{address}</p>}
                <p className="text-sm text-gray-600">{city}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  )
}

export default PropertyMap
