
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Products } from '../../components/products/products';
import { Footer } from '../../components/footer/footer';

@Component({
  imports: [Navbar, Hero, Products, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export default class Home {

}
