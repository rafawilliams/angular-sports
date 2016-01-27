/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
sports.config(function($routeProvider){
    $routeProvider.when("/checkout",{
        templateUrl: "views/checkoutSummary.html"
    });
    $routeProvider.when("/complete",{
        templateUrl: "views/thankYou.html"
    });
    $routeProvider.when("/placeorder",{
        templateUrl: "views/placeOrder.html"
    });
    $routeProvider.when("/products",{
        templateUrl: "views/productLists.html"
    });
    $routeProvider.otherwise("/products",{
        templateUrl: "views/productLists.html"
    });
});

