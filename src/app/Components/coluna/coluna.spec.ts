import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coluna } from './coluna';

describe('Coluna', () => {
  let component: Coluna;
  let fixture: ComponentFixture<Coluna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coluna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coluna);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
