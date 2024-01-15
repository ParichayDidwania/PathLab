class ProductCatalogue {
    static __products;
    static __commute_cost;

    static init() {
        // TODO: replace by db call at intervals
        ProductCatalogue.__products = [
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 2,
                title: "Test B",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 3,
                title: "Test C",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 4,
                title: "Test D",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 5,
                title: "Test E",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 6,
                title: "Test F",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 7,
                title: "Test G",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 8,
                title: "Test H",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
        ]

        ProductCatalogue.__commute_cost = 100;
    }

    static getNoDescriptionCatalogue() {
        const products = ProductCatalogue.__products.map((product) => {
            return {
                id: product.id,
                title: product.title,
                price: product.price
            }
        })

        return products;
    }

    static getAll() {
        return ProductCatalogue.__products;
    }

    static getById(id) {
        for(const product of ProductCatalogue.__products) {
            if(id == product.id) {
                return {...product};
            }
        }
    }

    static getByIds(idArray) {
        const productArray = [];
        for(const product of ProductCatalogue.__products) {
            if(idArray.includes(product.id)) {
                productArray.push({...product})
            }
        }

        return productArray;
    }

    static getCartItemsCost(cartObject) {
        let cost = 0;
        for(const product of ProductCatalogue.__products) {
            if(cartObject[product.id]) {
                cost += product.price * cartObject[product.id]
            }
        }   

        return cost;
    }   

    static getCommuteCost() {
        return ProductCatalogue.__commute_cost;
    }
}

module.exports = ProductCatalogue;