//import 'reflect-metadata';
import { Injectable } from '@angular/core';
import { ICountry } from './ICountry.model';
import { COUNTRIES } from './countries.data';

@Injectable()
export class CountryService {
	constructor() {}

	getCountries(): ICountry[] {
		return COUNTRIES;
	}

	getNorthAmericanCountries() : ICountry[] {
		return COUNTRIES.filter((country: ICountry) => {
			return country.continentName === 'North America';
		});
	}

	getEuropeanCountries() : ICountry[] {
		return COUNTRIES.filter((country: ICountry) => {
			return country.continentName === 'Europe';
		});
	}

	getAsianCountries() : ICountry[] {
		return COUNTRIES.filter((country: ICountry) => {
			return country.continentName === 'Asia';
		});
	}

	getAfricanCountries() : ICountry[] {
		return COUNTRIES.filter((country: ICountry) => {
			return country.continentName === 'Africa';
		});
	}
	
	getOceaniaCountries() : ICountry[] {
		return COUNTRIES.filter((country: ICountry) => {
			return country.continentName === 'Oceania';
		});
	}

	getSouthAmericanCountries() : ICountry[] {
		return COUNTRIES.filter((country: ICountry) => {
			return country.continentName === 'South America';
		});
	}

	getAntarcticaCountries() : ICountry[] {
		return COUNTRIES.filter((country: ICountry) => {
			return country.continentName === 'Antarctica';
		});
	}
}