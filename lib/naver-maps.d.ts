declare namespace naver.maps {
  class LatLng {
    constructor(latitude: number, longitude: number);
  }

  class Map {
    constructor(element: HTMLElement, options: MapOptions);
    panTo(position: LatLng): void;
    setZoom(zoom: number): void;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
  }

  const Event: {
    addListener(target: Marker, eventName: "click", listener: () => void): void;
  };

  type MapOptions = {
    center: LatLng;
    zoom: number;
    minZoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: {
      position: number;
    };
  };

  type MarkerOptions = {
    map: Map;
    position: LatLng;
    title?: string;
    icon?: {
      content: string;
      anchor: { x: number; y: number };
    };
  };

  const Position: {
    TOP_RIGHT: number;
  };
}

interface Window {
  naver: typeof naver;
}
