import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryName',
})
export class CountryNamePipe implements PipeTransform {
  transform(code: string | null | undefined, countries: any[] | null): string {
    if (!code || !countries) return code || 'Not specified';

    const country = countries.find(c => c.cca3.toUpperCase() === code.toUpperCase());

    return country?.name?.translations?.spa?.common || country?.name?.common || code;
  }
}
