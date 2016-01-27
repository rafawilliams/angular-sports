sports.constant("dataUrl","http://localhost:5500/products");
sports.constant("orderUrl","http://localhost:5500/orders");
sports.controller("sportsStoreCtrl",function($scope, $http,$location, dataUrl,orderUrl,cart){
    
    $scope.data = {
        //products : [{"name":"kayak","description":"A boat for one person","category":"Watersports","price":275,"id":"76cd6716fbcfcb7e"},{"name":"Lifejacket","description":"Protective and fashionable","category":"Watersports","price":48.95,"id":"169347620aed4801"},{"name":"Soccer Ball","description":"FIFA-approved size and weight","category":"Soccer","price":19.5,"id":"9c1220337614989c"},{"name":"Corner Flags","description":"Give your playing field a professional touch","category":"Soccer","price":34.95,"id":"7c410accfa6cb84b"},{"name":"Stadium","description":"Flat-packed 35,000-seat stadium","category":"Soccer","price":79500,"id":"f7642a70894939b7"},{"name":"Thinking Cap","description":"Improve your brain efficiency by 75%","category":"Chess","price":16,"id":"f7c3a03bc26438b3"},{"name":"Unsteady Chair","description":"Secretly give your opponent a disadvantage","category":"Chess","price":29.95,"id":"36b90f85676629f7"},{"name":"Human Chess Board","description":"A fun game for the family","category":"Chess","price":75,"id":"98aa06f94512186d"},{"name":"Bling-Bling King","description":"Gold-plated, diamond-studded king","category":"Chess","price":1200,"id":"b02b5b72939969ff"}] 
    };
    
    $http.get(dataUrl).success(function(data){
        $scope.data.products = data;
    }).error(function(error){
        $scope.data.error = error;
    });
    
    $scope.sendOrder = function(shippingDetails){
        var order = angular.copy(shippingDetails);
        order.products = cart.getProducts();
        $http.post(orderUrl,order).success(function(data){
            $scope.data.orderId = data.id;
            cart.getProducts().length =0;
        }).error(function(error){
            $scope.data.orderError = error;
            
        }).finally(function(){
            $location.path('/complete');
        });
        
    };
    
});


