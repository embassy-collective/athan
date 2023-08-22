import { useStore } from '@/lib/store';
import { City, Country } from 'country-state-city';
import { useEffect, useMemo, useState } from 'react';
import { Select } from 'react-select-virtualized';

interface Option {
  value: string;
  lowercaseLabel: string;
  label: string;
}

const Location = () => {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const countries = Country.getAllCountries();

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

  console.log('selectedCity', selectedCity);

  const { setLocation } = useStore();
  useEffect(() => {
    if (!selectedCity) return;
    setLocation({
      coords: {
        latitude: selectedCity.latitude as unknown as number,
        longitude: selectedCity.longitude as unknown as number
      },
      city: selectedCity.name,
      country: selectedCountry?.name ?? ''
    });
  }, [selectedCity]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select
        className="w-60"
        onChange={(value: Option) => setCountry(value.value)}
        options={countries.map((country) => ({ value: country.isoCode, label: country.name }))}
      />
      {country && (
        <Select
          className="w-60"
          onChange={(value: Option) => setCity(value.value)}
          options={cities?.map((city) => ({ value: city.name, label: city.name }))}
        />
      )}
    </div>
  );
};

export default Location;
