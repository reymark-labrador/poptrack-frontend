import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { Icon, LatLng } from "leaflet"
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

interface MapPickerProps {
  lat: number
  lng: number
  onCoordinatesChange: (lat: number, lng: number) => void
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

// Component to handle map click events
const MapClickHandler = ({
  onCoordinatesChange,
}: {
  onCoordinatesChange: (lat: number, lng: number) => void
}) => {
  useMapEvents({
    click: (e: { latlng: LatLng }) => {
      const { lat, lng } = e.latlng
      onCoordinatesChange(lat, lng)
    },
  })
  return null
}

const MapPicker = ({
  lat,
  lng,
  onCoordinatesChange,
  className = "",
}: MapPickerProps) => {
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
          center={[lat, lng]}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onCoordinatesChange={onCoordinatesChange} />
          <Marker position={[lat, lng]} icon={customIcon}></Marker>
        </MapContainer>
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-3 py-2 rounded-md shadow-sm text-sm">
          <p className="font-medium text-gray-700">
            Click on map to set location
          </p>
          <p className="text-gray-600 text-xs">
            Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
          </p>
        </div>
      </div>
    </>
  )
}

export default MapPicker
