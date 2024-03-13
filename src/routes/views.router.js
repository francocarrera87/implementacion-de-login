const {Router} = require('express');
const ItemsManager = require('../dao/dbManagers/ItemsManager');

const manager = new ItemsManager(__dirname+'/../files/items.json')

const router = Router();

router.get('/',async (req, res)=>{
    const items = await manager.getItems()
    res.render('home',{items:items})
})


router.get('/chat',(req, res)=>{
    res.render('chat',{})
})

module.exports = router; 