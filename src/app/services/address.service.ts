import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private provinceUrl = 'https://vietnam-administrative-division-json-server-swart.vercel.app/province';
  private districtUrl = 'https://vietnam-administrative-division-json-server-swart.vercel.app/district';
  private communeUrl = 'https://vietnam-administrative-division-json-server-swart.vercel.app/commune';

  private provinces = new Map<string, any>();
  private districts = new Map<string, any[]>();
  private communes = new Map<string, any[]>();

  private provincesSubject = new BehaviorSubject<any[]>([]);
  private districtsSubject = new BehaviorSubject<any[]>([]);
  private communesSubject = new BehaviorSubject<any[]>([]);

  provinces$ = this.provincesSubject.asObservable();
  districts$ = this.districtsSubject.asObservable();
  communes$ = this.communesSubject.asObservable();

  constructor(private http: HttpClient) { 
    this.loadAllData();
  }

  private loadAllData(): void {
    this.http.get<any[]>(this.provinceUrl).pipe(
      tap(data => {
        data.forEach(province => this.provinces.set(province.idProvince, province));
        this.provincesSubject.next(Array.from(this.provinces.values()));
      }),
      catchError(error => {
        console.error('Error fetching provinces:', error);
        return of([]);
      })
    ).subscribe();

    this.http.get<any[]>(this.districtUrl).pipe(
      tap(data => {
        data.forEach(district => {
          const provinceCode = district.idProvince;
          if (!this.districts.has(provinceCode)) {
            this.districts.set(provinceCode, []);
          }
          this.districts.get(provinceCode)?.push(district);
        });
      }),
      catchError(error => {
        console.error('Error fetching districts:', error);
        return of([]);
      })
    ).subscribe();

    this.http.get<any[]>(this.communeUrl).pipe(
      tap(data => {
        data.forEach(commune => {
          const districtCode = commune.idDistrict;
          if (!this.communes.has(districtCode)) {
            this.communes.set(districtCode, []);
          }
          this.communes.get(districtCode)?.push(commune);
        });
      }),
      catchError(error => {
        console.error('Error fetching communes:', error);
        return of([]);
      })
    ).subscribe();
  }

  getDistricts(provinceId: string): Observable<any[]> {
    const districts = this.districts.get(provinceId) || [];
    this.districtsSubject.next(districts);
    return of(districts);
  }

  getCommunes(districtId: string): Observable<any[]> {
    const communes = this.communes.get(districtId) || [];
    this.communesSubject.next(communes);
    return of(communes);
  }
  getProvinceName(provinceId: string): string | undefined {
    return this.provinces.get(provinceId)?.name;
  }

  // Lấy tên quận huyện từ ID quận huyện
  getDistrictName(districtId: string): string | undefined {
    for (const districts of this.districts.values()) {
      const district = districts.find(d => d.idDistrict === districtId);
      if (district) {
        return district.name;
      }
    }
    return undefined;
  }

  // Lấy tên phường xã từ ID phường xã
  getCommuneName(communeId: string): string | undefined {
    for (const communes of this.communes.values()) {
      const commune = communes.find(c => c.idCommune === communeId);
      if (commune) {
        return commune.name;
      }
    }
    return undefined;
  }
}
