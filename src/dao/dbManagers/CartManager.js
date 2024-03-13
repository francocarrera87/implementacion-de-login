

class CollectionManager {

    async addCollection(){
        const collection = { items: []}
        await CollectionManager.create(cart);
    }

    async getCollection(id){
        const cart = await CollectionManager.findOne({_id:id})
        return cart;
    }

    async addItem(id, itemId){
     
        const cart = await this.getCollection(id);   

        const index = collection.items.findIndex(i => i.item == itemId);
        if (index >= 0) {
            collection.items[index].quantity += 1;
        } else {
            collection.items.push({ item: itemId, quantity: 1 });
        }
        await CollectionManager.updateOne({_id: id,},cart)
    }
}



module.exports = CollectionManager; 