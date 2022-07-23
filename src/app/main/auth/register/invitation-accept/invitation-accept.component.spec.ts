import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationAcceptComponent } from './invitation-accept.component';

describe('InvitationAcceptComponent', () => {
  let component: InvitationAcceptComponent;
  let fixture: ComponentFixture<InvitationAcceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationAcceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
