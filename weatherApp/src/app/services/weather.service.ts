import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WeatherData } from '../models/weather.model';
import { Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private weatherDataCache = new Map<string, { data: Observable<WeatherData>, expireAt: number }>();
  private readonly CACHE_EXPIRATION_TIME = 36000000;

  constructor(private http: HttpClient) { }

  getWeatherData(city: string): Observable<WeatherData> {
    let cacheData = this.weatherDataCache.get(city);
    if (!cacheData || Date.now() > cacheData.expireAt) {
      const newData = this.fetchWeatherData(city).pipe(shareReplay(1));
      this.weatherDataCache.set(city, {
        data: newData,
        expireAt: Date.now() + this.CACHE_EXPIRATION_TIME
      });
      return newData;
    }
    return cacheData.data;
  }

  private fetchWeatherData(city: string): Observable<WeatherData> {
    const endpoint = `${environment.weatherApiBaseUrl}/${city}/today`;
    return this.http.get<WeatherData>(endpoint, {
      headers: new HttpHeaders()
        .set(environment.XRapidAPIHostHeaderName, environment.XRapidAPIHostHeaderValue)
        .set(environment.XRapidAPIkeyHeaderName, environment.XRapidAPIkeyHeaderValue),
      params: new HttpParams()
        .set('unitGroup', 'metric')
    }).pipe(
      tap(() => console.log(`Making request to API for ${city}`))
    );
  }


}
