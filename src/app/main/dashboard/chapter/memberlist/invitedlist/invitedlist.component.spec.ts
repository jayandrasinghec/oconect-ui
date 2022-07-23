import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedlistComponent } from './invitedlist.component';

describe('InvitedlistComponent', () => {
  let component: InvitedlistComponent;
  let fixture: ComponentFixture<InvitedlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitedlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
