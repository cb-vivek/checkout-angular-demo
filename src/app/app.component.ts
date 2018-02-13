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

      // To add coupons and customer related information
      let cart = cbInstance.getCart();
      cart.setCustomer({email: "vivek@chargebee.com"});

      cbInstance.setCheckoutCallbacks(function(cart) {
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
