import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
@Component({
    selector: 'app-audio-call',
    templateUrl: './audio-call.component.html',
    styleUrl: './audio-call.component.scss',
    imports:[CommonModule,NgScrollbarModule]
})
export class AudioCallComponent {
  isAddMeetingClassVisible = false;

  toggleAddMeetingClass() {
    this.isAddMeetingClassVisible = !this.isAddMeetingClassVisible;
  }
  closeChat() {
    this.isAddMeetingClassVisible = false;
  }
  isMuted = false;
  isMuteButtonClicked = false;
  toggleMute() {
    this.isMuted = !this.isMuted;
  }
  toggleMute1() {
    this.isMuted = !this.isMuted;
    this.isMuteButtonClicked = true;
  }

  isOtherMicOffClicked: boolean = false;

  toggleOtherMicOff() {
    this.isOtherMicOffClicked = !this.isOtherMicOffClicked;
  }
  public mic = false;

  public toggleChange() {
    this.mic = !this.mic;
  }
}
