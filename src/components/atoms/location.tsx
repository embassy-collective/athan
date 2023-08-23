import { GeoLocation } from '@/lib/store';
import { City, Country } from 'country-state-city';
import { useEffect, useMemo, useState } from 'react';
import { Select } from 'react-select-virtualized';

interface Option {
  value: string;
  lowercaseLabel: string;
  label: string;
}

interface LocationProps {
  value: GeoLocation;
  onValueChange: (value: GeoLocation) => void;
}

const Location = ({ value, onValueChange }: LocationProps) => {
  const countries = Country.getAllCountries();
  const countryByName = (name: string) => countries.find((c) => c.name === name);

  const [country, setCountry] = useState(countryByName(value.country)?.isoCode ?? '');
  const [city, setCity] = useState(value.city);

  const cities = useMemo(() => {
    if (!country) return [];
    return City.getCitiesOfCountry(country);
  }, [country]);

  const selectedCountry = useMemo(() => {
    if (!country) return null;
    return countries?.find((c) => c.isoCode === country);
  }, [country, countries]);

  const selectedCity = useMemo(() => {
    if (!city) return null;
    return cities?.find((c) => c.name === city);
  }, [city, cities]);

  useEffect(() => {
    if (!selectedCity) return;

    onValueChange({
      coords: {
        latitude: selectedCity.latitude as unknown as number,
        longitude: selectedCity.longitude as unknown as number
      },
      city: selectedCity.name,
      country: selectedCountry?.name ?? ''
    });
  }, [selectedCity]);

  return (
    <div className="flex gap-4">
      <Select
        className="w-56"
        onChange={(value: Option) => setCountry(value.value)}
        options={countries.map((country) => ({ value: country.isoCode, label: country.name }))}
      />
      {country && (
        <Select
          className="w-56"
          onChange={(value: Option) => setCity(value.value)}
          options={cities?.map((city) => ({ value: city.name, label: city.name }))}
        />
      )}
    </div>
  );
};

export default Location;
