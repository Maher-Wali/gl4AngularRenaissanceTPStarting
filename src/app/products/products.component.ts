import { Component, effect, inject, signal, untracked } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
  EMPTY,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";
import { AsyncPipe } from "@angular/common";
import { rxResource } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"],
    standalone: true,
    imports: [
    AsyncPipe
],
})
export class ProductsComponent {
  /* Todo : Faire le nécessaire pour créer le flux des produits à afficher */
  /* Tips : vous pouvez voir les différents imports non utilisés et vous en inspirer */
  products$!: Observable<Product[]>;
  private productService = inject(ProductService);
  private limit = 12;

  load = signal(0);
  stopLoading = signal(false);

  products = signal<Product[]>([]);

  productResourceRequest = rxResource(
    {
      request: () => {
        if (this.stopLoading()) return undefined;
        return {
          limit: this.limit,
          skip: this.load() * this.limit,
        };
      },
      loader: ({ request }) =>{
        if (!request) return EMPTY;
        return this.productService.getProducts({limit: request.limit, skip: request.skip}).pipe(
          map(response => {
              if (response.products.length + request.skip >= response.total) {
                this.stopLoading.set(true);
              }
              return response.products;
            }
          ),
        )}
    }
  )

  constructor() {
    effect(() => {
      const newProducts = this.productResourceRequest.value();

      if(newProducts && newProducts.length > 0){
        untracked(
          () => this.products.update((value) => [...value,...newProducts])
        );
      }
    })
  }

  loadMore() {
    if (!this.productResourceRequest.isLoading()) { // could add && !this.stopLoading() in the condition but i wanted to screw with the rxresource itslef to block it
      this.load.update(value => value + 1);
    }
  }
}
