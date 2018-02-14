import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  cbInstance;

  constructor(private http: HttpClient){

  }

  ngOnInit() {
    this.cbInstance = window['Chargebee'].init({
      site: "vivek1-test"
    });
    this.cbInstance.setPortalSession(() => {
      // Hit your end point that returns portal session object as response
      // This sample end point will call the below api
      // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
      return this.http.post("https://www.recur.in/api/create_portal_session", {customer_id: 'cbdemo_sir'}).toPromise();
    });
  }

  openCheckout() {
    // Just for demo, Logging out the previous session, in the real scenario customer id / subscription id would be passed in checkout api
    this.cbInstance.logout();
    this.cbInstance.openCheckout({
      hostedPage: () => {
        // Hit your end point that returns hosted page object as response
        // This sample end point will call the below api
        // https://apidocs.chargebee.com/docs/api/hosted_pages#checkout_new_subscription

        return this.http.post("https://www.recur.in/api/generate_hp_url", {plan_id: 'cbdemo_grow'}).toPromise();
      },
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
    });
  }

  openPortal() {
    this.cbInstance.createChargebeePortal().open();
  }
}
