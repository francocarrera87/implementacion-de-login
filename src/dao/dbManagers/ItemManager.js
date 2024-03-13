const itemModel = require ('../models/item')

class ItemsManager {
    async getItemsPaginated(page, limit){
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 5
        };
        const items = await itemModel.paginate({}, options);
        return items;
    }

    async addItem(item){
       await itemModel.create(item);
    }

    async getItems(){
        const items = await itemModel.find().lean()
        return items;
    }

    async getItem(id){
        const items= await itemModel.find({_id: id}).lean()
        return items[0];
    }
        
    async updateItem(id, newItem){
        await itemModel.updateOne({_id : id}, newItem)
    }

    async deleteItem(id){
        await itemModel.deleteOne({_id: id})
    }
}

module.exports = ItemsManager;
