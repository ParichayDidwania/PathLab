const express = require("express");
const router = express.Router();

router.get('/', async(req, res) => {
    res.send({
        message: "success",
        data: [
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
            {
                id: 1,
                title: "Test A",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, risus ut tristique lacinia, neque ipsum ultrices est, sed aliquam augue ante eu velit. Cras lacinia bibendum lorem, et congue enim egestas ut. Nulla elementum porttitor risus id cursus. Nam nec mollis mauris. Aenean lacinia dictum porttitor. Donec feugiat felis turpis, a posuere metus cursus a. Nullam rutrum felis neque, vitae imperdiet ipsum egestas et. Pellentesque condimentum vitae velit ac porta.",
                price: "1200"
            },
        ]
    })
})

module.exports = router;