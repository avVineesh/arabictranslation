// Angular import
import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, effect } from '@angular/core';

// project import
import { ThemeService } from '../../../service/theme.service';

@Component({
  selector: 'app-animation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animation-modal.component.html',
  styleUrls: ['./animation-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnimationModalComponent {
  // public props
  @Input() modalClass!: string;
  @Input() contentClass!: string;
  @Input() modalID!: string;
  @Input() backDrop = false;
  isDarkTheme: string;

  // constructor
  constructor(private themeService: ThemeService) {
    effect(() => {
      this.ApplyTheme(this.themeService.isDarkTheme());
    });
  }

  // private method
  private ApplyTheme(isDark: string) {
    this.isDarkTheme = isDark;
  }

  // public method
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close(event);
    }
  }

  close(event) {
    (document.querySelector('#' + event) as HTMLElement).classList.remove('md-show');
  }
}
