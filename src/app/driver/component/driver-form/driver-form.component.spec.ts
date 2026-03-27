import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';

import { DriverFormComponent } from './driver-form.component';
import { DriverService } from '../../service/driver.service';
import { Driver } from '../../interface/driver.interface';

describe('DriverFormComponent', () => {
  let component: DriverFormComponent;
  let fixture: ComponentFixture<DriverFormComponent>;
  let driverService: jasmine.SpyObj<DriverService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    driverService = jasmine.createSpyObj('DriverService', ['addDriver', 'getDriverById', 'updateDriver']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    driverService.addDriver.and.returnValue(of({} as Driver));
    driverService.getDriverById.and.returnValue(of({} as Driver));

    await TestBed.configureTestingModule({
      imports: [DriverFormComponent],
      providers: [
        { provide: DriverService, useValue: driverService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addDriver on submit when there is no id', () => {
    component.driverForm.setValue({
      name: 'Max Verstappen',
      email: 'max@f1.com',
      password: 'secret123',
      role: 'creator',
      racingNumber: 1,
      nationality: 'Dutch',
      driverImage: 'https://example.com/max.jpg',
      driverTeam: 'Red Bull',
      driverDES: 'World champion',
      wins: 10,
      podiums: 12,
      driverWC: 4,
      dob: '1997-09-30'
    });

    const formData = component.driverForm.value as Driver;

    component.onSubmit();

    expect(driverService.addDriver).toHaveBeenCalledWith(formData);
    expect(router.navigate).toHaveBeenCalledWith(['/drivers']);
  });
});
