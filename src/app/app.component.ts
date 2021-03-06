import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // button = "<button data-cb-type='checkout' data-cb-plan-id='cbdemo_grow' data-cb-addons[id][0]='cbdemo_additionaluser' data-cb-addons[quantity]='1'> subscribe </button>";
  ngOnInit() {
    document.addEventListener("DOMContentLoaded", () => {
      let cbInstance = window['Chargebee'].getInstance();

      // To add addons
      // Get the element with the corresponding plan and addons
      let planElement = document.querySelector("[data-cb-plan-id='cbdemo_grow']");
      let product = cbInstance.getProduct(planElement);
      product.addons.push({id: "cbdemo_additionaluser", quantity: 1});

      // to add coupon
      product.addCoupon("cbdemo_earlybird");

      // adding subscription custom fields
      product.data["cf_subtest"] = "subscription custom field";

      // To add coupons and customer related information with custom fields
      let cart = cbInstance.getCart();
      // Date should be in YYYY-MM-DD
      cart.setCustomer({email: "vivek@chargebee.com", cf_test: "customer custom field", cf_date: "1991-09-16"});

      cbInstance.setCheckoutCallbacks(function(cart) {
        // You can get the plan name for which the checkout happened like below
        let product = cart.products[0];
        console.log(product.planId);
        console.log(product.addons);
        return {
            loaded: function() {
                console.log("checkout opened");
            },
            close: function() {
                console.log("checkout closed");
            },
            success: function(hostedPageId) {
              console.log(hostedPageId);
              // Hosted page id will be unique token for the checkout that happened
              // You can pass this hosted page id to your backend 
              // and then call our retrieve hosted page api to get subscription details
              // https://apidocs.chargebee.com/docs/api/hosted_pages#retrieve_a_hosted_page
            },
            step: function(value) {
                // value -> which step in checkout
                console.log(value);
            }
        }
      });
    });
  }
}
