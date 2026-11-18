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

  const Service: {
    Status: { OK: string };
    geocode(
      options: { query: string },
      callback: (
        status: string,
        response: { v2: { addresses: Array<{ x: string; y: string }> } },
      ) => void,
    ): void;
  };

  type MapOptions = {
    center: LatLng;
    zoom: number;
    minZoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: {
      position: number;
      style?: number;
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

  const ZoomControlStyle: {
    SMALL: number;
    LARGE: number;
  };
}

interface Window {
  naver: typeof naver;
}
