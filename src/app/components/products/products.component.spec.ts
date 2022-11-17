import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of, defer } from 'rxjs';

import { ProductService } from 'src/app/services/product.service';
import { generateManyProducts } from 'src/app/data/product.mock';

import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';

fdescribe('ProductsComponent', () => {

  let component: ProductsComponent;
  let ps: jasmine.SpyObj<ProductService>;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getAll']);

    await TestBed.configureTestingModule({
      declarations: [
        ProductsComponent,
        ProductComponent,
      ],
      providers: [
        { provide: ProductService, useValue: spy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;

    ps = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    const products = generateManyProducts(10);
    ps.getAll.and.returnValue(of(products));

    fixture.detectChanges(); // ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called the method getAll', () => {
    expect(ps.getAll).toHaveBeenCalled();
  });

  describe('Test for getAllProducts', () => {
    it('should return a list of products from the service', () => {
      const products = generateManyProducts(10);
      const prevCount = component.products.length;
      ps.getAll.and.returnValue(of(products));

      component.getAllProducts();
      fixture.detectChanges();

      // expect(component.products).toEqual(products);
      expect(component.products.length).toEqual(prevCount + products.length);
    });

    it('should change the status from "loading" to "success"', fakeAsync(() => {
      // Arrange
      const products = generateManyProducts(10);
      ps.getAll.and.returnValue(defer(() => Promise.resolve(products)));
      // Act
      component.getAllProducts();
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('loading');
      tick();
      fixture.detectChanges();
      expect(component.status).toEqual('success');
    }));

    it('should change the status from "loading" to "error"', fakeAsync(() => {
      // Arrange
      const products = generateManyProducts(10);
      ps.getAll.and.returnValue(defer(() => Promise.reject('Error')));
      // Act
      component.getAllProducts();
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('loading');
      tick(1000);
      fixture.detectChanges();
      expect(component.status).toEqual('error');
    }));

  });

});
