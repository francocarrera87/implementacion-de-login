const {Router}= require('express');
const CollectionManager = require('../dao/dbManagers/CollectionManager');
const ItemsManager = require('../dao/dbManagers/ItemsManager');

const router = Router();


const itemsManager = new ItemsManager(__dirname+'/../files/items.json')
const collectionManager = new CollectionManager(__dirname+'/../files/collections.json');

router.post('/',async (req, res)=>{
    await collectionManager.addCollection();
    res.send({status:'success'})
})

router.get('/:id',async (req, res)=>{
    const id = req.params.id; 

    const collection = await collectionManager.getCollection(id)

    res.send({status:'success', items: collection.items})

})

router.post('/:id/item/:iid', async (req, res)=>{
    const id = req.params.id; 
    const itemId = req.params.iid; 

    const collection = await collectionManager.getCollection(id)
    const item = await itemsManager.getItem(itemId)
    if(!collection){
        res.status(400).send('Collection does not exist')
    }
    if(!item){
        res.status(400).send('item does not exist')
    }

    collectionManager.addItem(id, itemId)

    res.send({status:'success'})
})


module.exports = router; 