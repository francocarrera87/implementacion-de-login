const {Router} = require('express');
const ItemsManager = require('../dao/dbManagers/ItemsManager');

const router = Router();

const manager = new ItemsManager(__dirname+'/../files/items.json')

router.get('/', async (req, res)=>{
    let items = await manager.getItems()

    const {limit} = req.query;
    if(limit){
        items = items.slice(0,limit)
    } 

    res.send({items: items})
})

router.get('/:id', async (req, res)=>{
    let items = await manager.getItems()
    let id = req.params.id; 

    let item = items.find(i=>i.id == id);

    res.send({item: item})
})

router.post('/', async (req, res) => {
    await manager.addItem(req.body);
    const items = await manager.getItems();
    req.io.emit('new item', items);
    res.send({ status: 'success' });  
});

router.put('/:id', async (req, res)=>{
    const id = req.params.id
    
    await manager.updateItem(id, req.body);

    res.send({status:'success'})
})

router.delete('/:id', async (req,res)=>{
    const id = req.params.id; 
    await manager.deleteItem(id);
    res.send({status:'success'})
})

module.exports = router; 