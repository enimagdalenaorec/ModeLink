import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelProfileComponent } from './model-profile.component';

describe('ModelProfileComponent', () => {
  let component: ModelProfileComponent;
  let fixture: ComponentFixture<ModelProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
