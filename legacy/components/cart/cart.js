/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module("cart",[])
        .factory("cart", function () {
            const cartData = [];
            return {
                addProduct: function (id, name, price) {
                    const existingItem = cartData.find(item => item.id === id);
                    if (existingItem) {
                        existingItem.count++;
                    } else {
                        cartData.push({ count: 1, id: id, price: price, name: name });
                    }
                },
                removeProduct: function (id) {
                    const index = cartData.findIndex(item => item.id === id);
                    if (index !== -1) {
                        cartData.splice(index, 1);
                    }
                },
                getProducts: function () {
                    return cartData;
                }
            };
        })
        .directive("cartSummary", function (cart) {
            return {
                restrict: "E",
                templateUrl: "components/cart/cartSummary.html",
                controller: function ($scope) {
                    const cartData = cart.getProducts();
                    $scope.total = function () {
                        return cartData.reduce((total, item) => total + (item.price * item.count), 0);
                    };
                    $scope.itemCount = function () {
                        return cartData.reduce((total, item) => total + item.count, 0);
                    };
                }
            };
        });