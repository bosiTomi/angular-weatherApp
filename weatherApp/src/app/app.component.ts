import { Component, OnInit } from '@angular/core';
import { WeatherData } from './models/weather.model';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  cityName = 'Budapest';
  weatherData: WeatherData = {} as WeatherData;
  
  constructor(private weatherService: WeatherService) { }
  
  ngOnInit(): void {
    this.getWeatherData(this.cityName);
  }
  
  onSubmit() {
    this.getWeatherData(this.cityName);
    this.cityName = '';
  }
  
  private getWeatherData(cityName: string) {
    if (this.weatherData && this.weatherData.address === cityName) {
      console.log(this.weatherData);
    } else {
      this.weatherService.getWeatherData(cityName)
      .subscribe({
        next: (response) => {
          if (response) {
            this.weatherData = response;
            console.log(response);
          }
        }
      });
    }
  }
    
}
