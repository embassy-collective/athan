import { GeoLocation } from '@/lib/store';
import { cn } from '@/lib/styles';
import { City, Country, ICity } from 'country-state-city';
import { FormikErrors } from 'formik';
import { useMemo } from 'react';
import Select from 'react-select-virtualized';

interface Option {
  value: string;
  lowercaseLabel: string;
  label: string;
}

interface LocationProps {
  value: GeoLocation;
  onValueChange: (value: GeoLocation) => void;
  errors?: FormikErrors<GeoLocation>;
}

const Location = ({ value, onValueChange, errors }: LocationProps) => {
  const controlStyles = {
    base: 'border rounded bg-foreground hover:cursor-pointer',
    focus: 'border-accent ring-1 ring-accent',
    nonFocus: 'border-black hover:border-black'
  };
  const placeholderStyles = 'text-primary/60 px-2 py-0.5';
  const selectInputStyles = 'pl-1 py-0.5';
  const valueContainerStyles = 'p-1 gap-1';
  const singleValueStyles = 'leading-7 ml-1';
  ('border border-accent bg-white hover:bg-red-50 hover:text-red-800 text-background hover:border-red-300 rounded-md');
  const indicatorsContainerStyles = 'p-1 gap-1';
  const clearIndicatorStyles = 'hidden text-background p-1 rounded-md hover:text-red-400';
  const indicatorSeparatorStyles = 'hidden';
  const dropdownIndicatorStyles = 'p-1 text-background rounded-md hover:text-accent';
  const menuStyles = 'p-1 mt-2 border border-black text-primary bg-foreground rounded-lg';

  const customSelectProps = {
    unstyled: true,
    classNames: {
      listBox: () => 'border border-gray-200 rounded-lg',
      control: ({ isFocused }: { isFocused: boolean }) =>
        cn(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base),
      placeholder: () => placeholderStyles,
      input: () => selectInputStyles,
      valueContainer: () => valueContainerStyles,
      singleValue: () => singleValueStyles,
      indicatorsContainer: () => indicatorsContainerStyles,
      clearIndicator: () => clearIndicatorStyles,
      indicatorSeparator: () => indicatorSeparatorStyles,
      dropdownIndicator: () => dropdownIndicatorStyles,
      menu: () => menuStyles
    }
  };

  const countries = Country.getAllCountries();
  const selectedCountry = useMemo(() => countries.find((country) => country.name === value.country), [value.country]);

  const cityId = (city: ICity) => `${city.name}#${city.longitude}#${city.latitude}`;

  const cities = useMemo(
    () => (selectedCountry?.isoCode ? City.getCitiesOfCountry(selectedCountry?.isoCode) ?? [] : []),
    [selectedCountry]
  );

  const cityById = (id: string) => {
    const [name, longitude, latitude] = id.split('#');
    return cities.find((city) => city.name === name && city.longitude === longitude && city.latitude === latitude);
  };

  const selectedCity = useMemo(
    () => (value.city ? cities.find((city) => city.name === value.city) : undefined),
    [cities, value.city]
  );

  return (
    <div className="flex gap-4">
      <div>
        <Select
          {...customSelectProps}
          value={selectedCountry ? { value: selectedCountry.isoCode, label: selectedCountry?.name } : undefined}
          className="w-56"
          onChange={(value: Option) => {
            const country = countries.find((country) => country.isoCode === value.value);
            if (!country) return;
            const city = City.getCitiesOfCountry(country?.isoCode)?.[0];
            onValueChange({
              country: country?.name,
              city: city?.name,
              coords: {
                longitude: parseFloat(city!.longitude ?? '0'),
                latitude: parseFloat(city!.latitude ?? '0')
              }
            });
          }}
          options={countries.map((country) => ({ value: country.isoCode, label: country.name }))}
        />
        {errors?.country && <p className="text-red-400">Invalid city.</p>}
      </div>
      {selectedCountry && (
        <div>
          <Select
            {...customSelectProps}
            value={selectedCity ? { value: cityId(selectedCity), label: selectedCity.name } : undefined}
            className="w-56"
            onChange={(value: Option) => {
              const city = cityById(value.value);
              if (!city) return;

              onValueChange({
                country: selectedCountry.name,
                city: city?.name,
                coords: {
                  longitude: parseFloat(city!.longitude ?? '0'),
                  latitude: parseFloat(city!.latitude ?? '0')
                }
              });
            }}
            options={cities.map((city) => ({ value: cityId(city), label: city.name }))}
          />
          {(errors?.city || errors?.coords) && <p className="text-red-400">Invalid city</p>}
        </div>
      )}
    </div>
  );
};

export default Location;
