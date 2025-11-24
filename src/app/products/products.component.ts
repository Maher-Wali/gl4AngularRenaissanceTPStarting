import { Component, inject } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
  tap
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {

  private readonly PRODUCTS_PER_PAGE = 12;
  products$!: Observable<Product[]>;
  private productService = inject(ProductService);

  private loadMoreSubject$ = new BehaviorSubject<Settings>({
    limit: this.PRODUCTS_PER_PAGE,
    skip: 0
  });

  hasMore = true;

  constructor() {
    this.products$ = this.loadMoreSubject$.pipe(
      concatMap(settings => this.productService.getProducts(settings)),
      tap(response => {
        const totalLoaded = response.skip + response.products.length;
        this.hasMore = totalLoaded < response.total;
      }),
      map(response => response.products),
      scan((accumulator: Product[], newProducts: Product[]) => [...accumulator, ...newProducts], []),
      takeWhile(() => this.hasMore, true)
    );
  }

  loadMore() {
    const currentSettings = this.loadMoreSubject$.value;
    this.loadMoreSubject$.next({
      limit: currentSettings.limit,
      skip: currentSettings.skip + this.PRODUCTS_PER_PAGE
    });
  }
}