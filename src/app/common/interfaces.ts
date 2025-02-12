export interface IUbication {
  place_id:     number;
  licence:      string;
  osm_type:     string;
  osm_id:       number;
  lat:          string;
  lon:          string;
  display_name: string;
  address:      IAddress;
  boundingbox:  string[];
}

export interface IAddress {
  house_number:     string;
  road:             string;
  neighbourhood:    string;
  suburb:           string;
  county:           string;
  city:             string;
  state:            string;
  "ISO3166-2-lvl4": string;
  postcode:         string;
  country:          string;
  country_code:     string;
}
