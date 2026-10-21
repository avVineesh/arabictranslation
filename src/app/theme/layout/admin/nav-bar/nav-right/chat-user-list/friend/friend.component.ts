// angular import
import { Component, EventEmitter, Input, Output } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent {
  // public props
  @Input() friends;
  @Output() ChatOn = new EventEmitter();

  // public method
  innerChatToggle() {
    this.ChatOn.emit();
  }
}
