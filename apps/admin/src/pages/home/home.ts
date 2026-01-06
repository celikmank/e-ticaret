import { Component, computed } from '@angular/core';
import Blank from '../../components/blank';
import { BreadcrumbModel } from '../../models/Breadcrumb.model';

@Component({
  selector: 'app-home',
  imports: [Blank],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  readonly breadcrumbs = computed<BreadcrumbModel[]>(() => []);
}